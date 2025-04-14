"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  CheckCheck,
  CheckCircle,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/constants/environments";
import dayjs from "dayjs";
import Link from "next/link";

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  time: string;
  createdAt: number;
}

interface Customer {
  id: string | null;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  roleId?: string | null;
  avatar?: string | null;
}

// Create a custom event for notification updates
export const notificationEvents = {
  UPDATED: "notification:updated",
  MARKED_READ: "notification:marked-read",
  FETCH_REQUESTED: "notification:fetch-requested",
  BOOKING_SUCCESS: "notification:booking-success",
  BOOKING_CANCELED: "notification:booking-canceled",
};

const MIN_API_CALL_INTERVAL = 5000;

const Notification = ({ customer }: { customer: Customer }) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const getIconForTitle = (title: string) => {
    switch (title) {
      case "Đặt chỗ thành công":
        return <CheckCircle size={16} className="text-primary" />;
      case "Nạp tiền thành công":
        return <DollarSign size={16} className="text-primary" />;
      case "Hoàn tiền thành công":
        return <RefreshCw size={16} className="text-primary" />;
      default:
        return <CheckCircle size={16} className="text-gray-500" />;
    }
  };
  const fetchNotifications = useCallback(
    async (force = false) => {
      if (!customer.id) return;

      // Prevent concurrent API calls
      if (isFetchingRef.current) return;

      // Don't call API too frequently unless forced
      const now = Date.now();
      if (!force && now - lastFetchTimeRef.current < MIN_API_CALL_INTERVAL)
        return;

      isFetchingRef.current = true;

      try {
        const response = await fetch(
          `${BASE_URL}/users/usernotification/${customer.id}`,
          { cache: "no-store" }
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
          .sort(
            (a: Notification, b: Notification) => b.createdAt - a.createdAt
          );

        const hasNewNotifications = fetchedNotifications.some(
          (newNotif: Notification) =>
            !notifications.some((oldNotif) => oldNotif.id === newNotif.id)
        );

        // Update state only if there are changes
        if (
          hasNewNotifications ||
          fetchedNotifications.length !== notifications.length
        ) {
          setNotifications(fetchedNotifications);

          // If there are new notifications, show a toast notification
          // But only if this isn't the initial load and the dropdown isn't open
          if (hasNewNotifications && lastFetchTimeRef.current > 0 && !isOpen) {
            toast.info("Bạn có thông báo mới!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              theme: "light",
            });
          }
        }

        lastFetchTimeRef.current = now;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tải thông báo!";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
      } finally {
        isFetchingRef.current = false;
      }
    },
    [customer.id, notifications, isOpen]
  );

  const markAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );

    try {
      const response = await fetch(
        `${BASE_URL}/users/updateusernotification/${id}`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi đánh dấu thông báo đã đọc.");
      }

      const event = new CustomEvent(notificationEvents.MARKED_READ, {
        detail: { id },
      });
      window.dispatchEvent(event);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi đánh dấu thông báo đã đọc!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (customer?.id) {
      fetchNotifications(true);
    }
  }, [customer, fetchNotifications]);

  useEffect(() => {
    const handleNotificationUpdate = () => {
      fetchNotifications();
    };

    const handleFetchRequested = () => {
      fetchNotifications(true);
    };

    const handleBookingSuccess = () => {
      fetchNotifications(true);
    };

    const handleBookingCanceled = () => {
      fetchNotifications(true);
    };

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

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchNotifications();
      }
    };

    window.addEventListener(
      notificationEvents.UPDATED,
      handleNotificationUpdate
    );
    window.addEventListener(
      notificationEvents.MARKED_READ,
      handleNotificationMarkedRead as EventListener
    );
    window.addEventListener(
      notificationEvents.FETCH_REQUESTED,
      handleFetchRequested
    );
    window.addEventListener(
      notificationEvents.BOOKING_SUCCESS,
      handleBookingSuccess
    );
    window.addEventListener(
      notificationEvents.BOOKING_CANCELED,
      handleBookingCanceled
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener(
        notificationEvents.UPDATED,
        handleNotificationUpdate
      );
      window.removeEventListener(
        notificationEvents.MARKED_READ,
        handleNotificationMarkedRead as EventListener
      );
      window.removeEventListener(
        notificationEvents.FETCH_REQUESTED,
        handleFetchRequested
      );
      window.removeEventListener(
        notificationEvents.BOOKING_SUCCESS,
        handleBookingSuccess
      );
      window.removeEventListener(
        notificationEvents.BOOKING_CANCELED,
        handleBookingCanceled
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications(true);
    }
  }, [isOpen, fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const MAX_DISPLAY = 3;

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="relative cursor-pointer p-3 bg-secondary hover:bg-fourth rounded-full text-white border"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {isOpen && (
        <motion.div
          initial={{ scale: 0, rotate: "180deg" }}
          animate={{
            scale: 1,
            rotate: "0deg",
            transition: {
              type: "spring",
              bounce: 0.25,
            },
          }}
          exit={{ scale: 0, rotate: "180deg" }}
          className="absolute right-0 mt-4 w-80 bg-[#835101] shadow-lg rounded-lg border overflow-hidden"
        >
          <Link href="/notification">
            <div className="p-4 font-semibold border-b text-white">
              Thông báo
            </div>
          </Link>
          {notifications.length > 0 ? (
            <>
              {notifications.slice(0, MAX_DISPLAY).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 flex flex-col cursor-pointer transition-all hover:bg-gray-100 ${
                    notification.read ? "bg-gray-50" : "bg-white"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {getIconForTitle(notification.title)}{" "}
                      <h3 className="text-black font-semibold text-sm">
                        {notification.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-800 text-sm">
                    {notification.message.length > 50
                      ? `${notification.message.slice(0, 50)}...`
                      : notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.time}
                  </p>
                  {notification.read && (
                    <div className="flex justify-end mt-auto">
                      <CheckCheck size={16} className="text-green-500" />
                    </div>
                  )}
                </div>
              ))}
              {notifications.length > MAX_DISPLAY && (
                <div className="p-2 text-center">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/notification");
                    }}
                  >
                    Xem tất cả
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text- text-center">Không có thông báo mới</div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Notification;
