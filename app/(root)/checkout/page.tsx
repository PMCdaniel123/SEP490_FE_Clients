"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import Beverage from "@/components/beverages-list/beverage";
import Amenity from "@/components/amenities-list/amenity";
import { Label } from "@/components/ui/label";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  notes: "",
  voucher: "",
  paymentMethod: "cash",
};

const paymentMethods = [
  { value: "bank", label: "Thanh toán bằng ngân hàng" },
  { value: "cash", label: "Thanh toán bằng ví điện tử" },
];

const roomDetails = {
  name: "Bàn cơ bản",
  location: "Kana Coffee",
  imageSrc: "/feauture-section.jpg",
  roomType: "Meeting Room",
  size: "72m²",
  subtotal: 175000,
  voucher: "SUMMER25",
  total: 175000,
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export default function Checkout() {
  const [formData, setFormData] = useState(initialFormData);
  const { beverageList, amenityList } = useSelector(
    (state: RootState) => state.cart
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanh toán thành công!");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Section */}
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-primary">Thanh toán</h2>

        {/* User Information */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg space-y-4">
          <h3 className="text-lg font-semibold">Thông tin người đặt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Họ tên"
              className="p-2 border rounded w-full"
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="p-2 border rounded w-full"
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              className="p-2 border rounded w-full col-span-1 md:col-span-2"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Additional Requests */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg space-y-4">
          <h3 className="text-lg font-semibold">Yêu cầu khác</h3>
          <textarea
            name="notes"
            placeholder="Nhập ghi chú"
            className="w-full p-2 border rounded"
            rows={4}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Voucher */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg space-y-4">
          <h3 className="text-lg font-semibold">Voucher</h3>
          <input
            type="text"
            name="voucher"
            placeholder="Chọn khuyến mãi"
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg space-y-4">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <label key={method.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  onChange={handleChange}
                  defaultChecked={method.value === "cash"}
                />
                {method.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="bg-gray-100 p-4 rounded-lg h-fit sticky top-6 shadow-lg space-y-4">
        <h3 className="text-lg font-semibold">{roomDetails.name}</h3>
        <p className="text-gray-500">{roomDetails.location}</p>
        <div className="my-4 flex items-center gap-3">
          <Image
            src={roomDetails.imageSrc}
            alt="Table"
            width={100}
            height={100}
            className="rounded-lg"
          />
          <div>
            <p className="text-gray-600">{roomDetails.roomType}</p>
            <p className="text-gray-600">{roomDetails.size}</p>
          </div>
        </div>
        <div className="border-t pt-4 text-gray-700 space-y-2">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span className="font-semibold">
              {formatCurrency(roomDetails.subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Voucher:</span>
            <span className="font-semibold">{roomDetails.voucher}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(roomDetails.total)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 my-8">
          {beverageList.length > 0 && (
            <div>
              <Label className="mb-2">Thực đơn:</Label>
              {beverageList.map((item) => (
                <Beverage key={item.id} item={item} />
              ))}
            </div>
          )}
          {amenityList.length > 0 && (
            <div>
              <Label className="mb-2">Các tiện ích:</Label>
              {amenityList.map((item) => (
                <Amenity key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-3 mt-5 rounded-lg"
        >
          THANH TOÁN
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
}
