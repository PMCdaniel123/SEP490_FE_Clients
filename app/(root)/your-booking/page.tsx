"use client";

import { useState } from "react";
import Image from "next/image";
import { Modal } from "antd";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const bookings = [
  {
    id: 1,
    title: "Bàn làm việc cao cấp",
    image: "/space.jpg",
    checkIn: "12/03/2025",
    duration: "1 tiếng",
    capacity: "4 người",
    price: "10000 VNĐ",
    status: "success",
  },
  {
    id: 2,
    title: "Bàn làm việc cao cấp",
    image: "/space1.jpg",
    checkIn: "12/03/2025",
    duration: "1 tiếng",
    capacity: "4 người",
    price: "10000 VNĐ",
    status: "success",
  },
];

const tabs = [
  { key: "success", label: "Đã đặt thành công" },
  { key: "canceled", label: "Đã hủy" },
];

export default function YourBookingsPage() {
  const [activeTab, setActiveTab] = useState("success");
  const [userBookings, setUserBookings] = useState(bookings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<
    (typeof bookings)[0] | null
  >(null);

  const handleCancel = (id: number) => {
    setUserBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status: "canceled" } : booking
      )
    );
    setIsModalOpen(false);
    setIsConfirmModalOpen(false);
  };

  const showModal = (booking: (typeof bookings)[0]) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const showConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedBooking) {
      handleCancel(selectedBooking.id);
    }
  };

  const handleCancelConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-36">
      <h2 className="text-2xl font-bold text-[#8B5E3C] mb-4">
        Đặt chỗ của bạn
      </h2>
      <div className="flex space-x-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "py-2 font-medium text-gray-600",
              activeTab === tab.key && "border-b-2 border-black text-black"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {userBookings
          .filter((booking) => booking.status === activeTab)
          .map((booking) => (
            <div
              key={booking.id}
              className="flex items-center bg-gray-100 p-4 rounded-lg"
            >
              <Image
                src={booking.image}
                alt={booking.title}
                width={80}
                height={80}
                className="rounded-lg"
              />
              <div className="ml-4 flex-grow">
                <h3 className="font-semibold">{booking.title}</h3>
                <p className="text-gray-500 text-sm">
                  <span className="font-medium">Check In:</span>{" "}
                  {booking.checkIn} &nbsp; | &nbsp;
                  <span className="font-medium">Thời gian:</span>{" "}
                  {booking.duration} &nbsp; | &nbsp;
                  <span className="font-medium">Sức chứa:</span>{" "}
                  {booking.capacity}
                </p>
                <p className="text-black font-bold">{booking.price}</p>
              </div>
              <Button
                onClick={() => showModal(booking)}
                className=" text-white px-4 py-2 rounded-lg"
              >
                Xem chi tiết
              </Button>
            </div>
          ))}
      </div>

      <Modal
        title="Chi tiết đặt chỗ"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancelModal}
        footer={null}
      >
        {selectedBooking && (
          <div>
            <h3 className="font-semibold">{selectedBooking.title}</h3>
            <Image
              src={selectedBooking.image}
              alt={selectedBooking.title}
              width={160}
              height={160}
              className="rounded-lg mb-4"
            />
            <p className="text-gray-500 text-sm">
              <span className="font-medium">Check In:</span>{" "}
              {selectedBooking.checkIn} &nbsp; | &nbsp;
              <span className="font-medium">Thời gian:</span>{" "}
              {selectedBooking.duration} &nbsp; | &nbsp;
              <span className="font-medium">Sức chứa:</span>{" "}
              {selectedBooking.capacity}
            </p>
            <p className="text-black font-bold">{selectedBooking.price}</p>
            {selectedBooking.status === "success" && (
              <Button
                onClick={showConfirmModal}
                className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg mt-4"
              >
                Hủy đặt chỗ
              </Button>
            )}
          </div>
        )}
      </Modal>
      <Modal
        className="pt-10"
        title="Xác nhận hủy đặt chỗ"
        open={isConfirmModalOpen}
        onOk={handleConfirmCancel}
        onCancel={handleCancelConfirmModal}
        okText="Hủy đặt chỗ"
        okType="danger"
        cancelText="Không"
      >
        <p>Bạn có chắc chắn muốn hủy đặt chỗ này không?</p>
      </Modal>
    </div>
  );
}
