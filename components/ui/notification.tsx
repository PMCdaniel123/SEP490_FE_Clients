import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Notification {
  id: number;
  message: string;
  read: boolean;
  time: string;
}

const Notification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Đặt của bạn đã thanh toán thành công!",
      read: false,
      time: "10:30 AM",
    },
    {
      id: 2,
      message: "Đặt chỗ của bạn đã hủy!",
      read: false,
      time: "11:00 AM",
    },
    { id: 3, message: "Xem ưu đãi mới", read: true, time: "12:00 PM" },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

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
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-gray-100 ${
                  notification.read ? "bg-gray-50" : "bg-white"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div>
                  <span className="text-black">{notification.message}</span>
                  <div className="text-xs text-gray-500">
                    {notification.time}
                  </div>
                </div>
                {notification.read && (
                  <CheckCircle size={16} className="text-green-500" />
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500 text-center">
              No new notifications
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Notification;
