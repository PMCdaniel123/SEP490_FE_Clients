"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, Bell, Filter } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { Separator } from "@/components/ui/separator";
import { BASE_URL } from "@/constants/environments";
import Loader from "@/components/loader/Loader";

interface Notification {
  id: number;
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
            description: string;
            isRead: number;
            createAt: string;
          }) => ({
            id: notification.userNotificationId,
            message: notification.description,
            read: notification.isRead === 1,
            time: new Date(notification.createAt).toLocaleString(),
            createdAt: new Date(notification.createAt).getTime(),
          })
        )
        .sort((a: Notification, b: Notification) => b.createdAt - a.createdAt);

      setNotifications(fetchedNotifications);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
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
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi đánh dấu thông báo đã đọc.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && customer?.id) {
      fetchNotifications();
    }
  }, [customer, fetchNotifications]);

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((notification) => !notification.read)
      : notifications;

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
        <button
          onClick={() =>
            setFilter((prevFilter) => (prevFilter === "all" ? "unread" : "all"))
          }
          className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          <Filter size={16} />
          {filter === "all" ? "Chỉ chưa đọc" : "Tất cả"}
        </button>
      </div>
      <Separator className="mb-6" />

      {filteredNotifications.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b last:border-b-0 flex items-start justify-between cursor-pointer transition-all hover:bg-gray-100 ${
                notification.read ? "bg-gray-50" : "bg-white"
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex flex-col flex-1">
                <p className="text-gray-800 text-base font-medium mb-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
              {notification.read && (
                <CheckCircle
                  size={20}
                  className="text-green-500 ml-3 flex-shrink-0"
                />
              )}
            </div>
          ))}
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
