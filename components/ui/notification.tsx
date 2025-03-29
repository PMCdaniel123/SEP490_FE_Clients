"use client"
import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/constants/environments";

interface Notification {
  id: number;
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

const Notification = ({ customer }: { customer: Customer }) => {
  const router = useRouter(); 
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    if (!customer.id) return;

    try {
      const response = await axios.get(
        `${BASE_URL}/users/usernotification/${customer.id}`
      );
      const fetchedNotifications = response.data.customerNotificationDTOs
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
    } catch {
      toast.error("Có lỗi xảy ra khi tải thông báo!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
    }
  };

  const markAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );

    try {
      await axios.get(
        `${BASE_URL}/users/updateusernotification/${id}`
      );
    } catch {
      toast.error("Có lỗi xảy ra khi đánh dấu thông báo đã đọc!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (customer?.id) {
      fetchNotifications();
    }
  }, [customer]);

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

  const MAX_DISPLAY = 5;

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="relative cursor-pointer p-3 bg-secondary/60 hover:bg-fourth rounded-full text-white border"
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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-4 w-80 bg-[#835101] shadow-lg rounded-lg border overflow-hidden"
        >
          <div className="p-4 font-semibold border-b text-white">Thông báo</div>
          {notifications.length > 0 ? (
            <>
              {notifications.slice(0, MAX_DISPLAY).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-gray-100 ${
                    notification.read ? "bg-gray-50" : "bg-white"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div>
                    <span className="text-black">
                      {notification.message.length > 50
                        ? `${notification.message.slice(0, 50)}...`
                        : notification.message}
                    </span>
                    <div className="text-xs text-gray-500">
                      {notification.time}
                    </div>
                  </div>
                  {notification.read && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                </div>
              ))}
               {notifications.length > MAX_DISPLAY && (
                <div className="p-4 text-center">
                  <button
                    onClick={() => router.push("/thong-bao")}
                  >
                    Xem tất cả
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-gray-500 text-center">
              Không có thông báo mới
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Notification;
