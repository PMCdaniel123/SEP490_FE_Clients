"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  Bell,
  Filter,
  DollarSign,
  RefreshCw,
  CheckCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { Separator } from "@/components/ui/separator";
import { BASE_URL } from "@/constants/environments";
import Loader from "@/components/loader/Loader";
import { notificationEvents } from "@/components/ui/notification";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import Pagination from "@/components/pagination/pagination";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  time: string;
  createdAt: number;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { customer } = useSelector((state: RootState) => state.auth);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const token = typeof window !== "undefined" ? Cookies.get("token") : null;
  const google_token =
    typeof window !== "undefined" ? Cookies.get("google_token") : null;
  const router = useRouter();
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of notifications per page

  const getIconForTitle = (title: string) => {
    switch (title) {
      case "Đặt chỗ thành công":
        return <CheckCircle size={20} className="text-green-500" />;
      case "Nạp tiền thành công":
        return <DollarSign size={20} className="text-blue-500" />;
      case "Hoàn tiền thành công":
        return <RefreshCw size={20} className="text-yellow-500" />;
      default:
        return <CheckCircle size={20} className="text-gray-500" />;
    }
  };

  const fetchNotifications = useCallback(async () => {
    if (!customer?.id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/users/usernotification/${customer.id}`
      );

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi tải thông báo.");
      }

      const data = await response.json();
      const fetchedNotifications = data.customerNotificationDTOs
        .map(
          (notification: {
            userNotificationId: number;
            title: string;
            description: string;
            isRead: number;
            createAt: string;
          }) => ({
            id: notification.userNotificationId,
            title: notification.title,
            message: notification.description,
            read: notification.isRead === 1,
            time: dayjs(notification.createAt).format("HH:mm:ss, DD/MM/YYYY"),
            createdAt: new Date(notification.createAt).getTime(),
          })
        )
        .sort((a: Notification, b: Notification) => b.createdAt - a.createdAt);

      setNotifications(fetchedNotifications);
      // Reset to first page when new notifications are loaded
      setCurrentPage(1);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  }, [customer?.id]);

  const markAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );

    try {
      const response = await fetch(
        `${BASE_URL}/users/updateusernotification/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || google_token}`,
          },
        }
      );

      if (response.status === 401) {
        router.push("/unauthorized");
        throw new Error("Bạn không được phép truy cập!");
      } else if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi đánh dấu thông báo đã đọc.");
      }

      const event = new CustomEvent(notificationEvents.MARKED_READ, {
        detail: { id },
      });
      window.dispatchEvent(event);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
    }
  };

  const markAllAsRead = async () => {
    if (!customer?.id || isMarkingAll) return;

    const unreadNotifications = filteredNotifications.filter(
      (notification) => !notification.read
    );
    if (unreadNotifications.length === 0) {
      toast.info("Không có thông báo nào để đánh dấu đã đọc", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }

    setIsMarkingAll(true);

    try {
      // Get all unread notification IDs
      const unreadIds = unreadNotifications.map(
        (notification) => notification.id
      );

      // Update local state immediately for better user experience
      setNotifications((prev) =>
        prev.map((notification) => {
          if (!notification.read) {
            return { ...notification, read: true };
          }
          return notification;
        })
      );

      // Make API calls for each unread notification
      const markPromises = unreadIds.map((id) =>
        fetch(`${BASE_URL}/users/updateusernotification/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || google_token}`,
          },
        }).then((response) => {
          if (response.status === 401) {
            router.push("/unauthorized");
            throw new Error("Bạn không được phép truy cập!");
          } else if (!response.ok) {
            throw new Error("Có lỗi xảy ra khi đánh dấu thông báo!");
          }
        })
      );

      await Promise.all(markPromises);

      // Dispatch events for each marked notification
      unreadIds.forEach((id) => {
        const event = new CustomEvent(notificationEvents.MARKED_READ, {
          detail: { id },
        });
        window.dispatchEvent(event);
      });

      toast.success("Tất cả thông báo đã được đánh dấu là đã đọc", {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi đánh dấu thông báo!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
      });

      // Revert to previous state if there was an error
      fetchNotifications();
    } finally {
      setIsMarkingAll(false);
    }
  };

  useEffect(() => {
    if ((token || google_token) && customer?.id) {
      fetchNotifications();
    }
  }, [customer, fetchNotifications, token, google_token]);

  useEffect(() => {
    const handleNotificationMarkedRead = (event: CustomEvent) => {
      const { id } = event.detail;
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    };

    window.addEventListener(
      notificationEvents.MARKED_READ,
      handleNotificationMarkedRead as EventListener
    );

    const notifyLoaded = () => {
      const event = new CustomEvent(notificationEvents.UPDATED);
      window.dispatchEvent(event);
    };

    if (!loading && notifications.length > 0) {
      notifyLoaded();
    }

    return () => {
      window.removeEventListener(
        notificationEvents.MARKED_READ,
        handleNotificationMarkedRead as EventListener
      );
    };
  }, [loading, notifications]);

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((notification) => !notification.read)
      : notifications;

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Calculate pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = filteredNotifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Thông báo</h1>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              disabled={isMarkingAll}
              variant="outline"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <CheckCheck size={16} />
              <span>Đánh dấu tất cả đã đọc</span>
            </Button>
          )}
          <button
            onClick={() =>
              setFilter((prevFilter) =>
                prevFilter === "all" ? "unread" : "all"
              )
            }
            className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <Filter size={16} />
            {filter === "all" ? "Chỉ chưa đọc" : "Tất cả"}
          </button>
        </div>
      </div>
      <Separator className="mb-6" />

      {filteredNotifications.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {currentNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b last:border-b-0 flex flex-col cursor-pointer transition-all hover:bg-gray-100 ${
                notification.read ? "bg-gray-50" : "bg-white"
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getIconForTitle(notification.title)}
                  <h3 className="text-gray-800 text-base font-semibold">
                    {notification.title}
                  </h3>
                </div>
                <p className="text-gray-800 text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.time}
                </p>
              </div>
              {notification.read && (
                <div className="flex justify-end mt-4">
                  <CheckCheck size={20} className="text-green-500" />
                </div>
              )}
            </div>
          ))}

          {/* Add pagination component */}
          {totalPages > 1 && (
            <div className="mt-4 pb-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8 text-center">
          <Bell size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-semibold">
            Không có thông báo nào
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Bạn sẽ nhận được thông báo khi có cập nhật mới.
          </p>
        </div>
      )}
    </div>
  );
}
