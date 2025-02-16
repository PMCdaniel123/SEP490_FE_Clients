"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Checkout() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    voucher: "",
    paymentMethod: "cash",
  });

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
        <h2 className="text-2xl font-bold text-gray-800">Thanh toán</h2>

        {/* User Information */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Thông tin người đặt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
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
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Yêu cầu khác</h3>
          <textarea
            name="notes"
            placeholder="Nhập ghi chú"
            className="w-full p-2 border rounded mt-3"
            rows={4}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Voucher */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Voucher</h3>
          <input
            type="text"
            name="voucher"
            placeholder="Chọn khuyến mãi"
            className="w-full p-2 border rounded mt-3"
            onChange={handleChange}
          />
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                onChange={handleChange}
              />
              Thanh toán bằng ngân hàng
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                defaultChecked
                onChange={handleChange}
              />
              Thanh toán bằng ví điện tử
            </label>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="bg-gray-100 p-6 rounded-lg h-fit sticky top-6">
        <h3 className="text-lg font-semibold">Bàn cơ bản</h3>
        <p className="text-gray-500">Kana Coffee</p>
        <div className="my-4 flex items-center gap-3">
          <Image
            src="/feauture-section.jpg"
            alt="Table"
            width={100}
            height={100}
            className="rounded-lg"
          />
          <div>
            <p className="text-gray-600">Meeting Room</p>
            <p className="text-gray-600">72m²</p>
          </div>
        </div>
        <div className="border-t pt-4 text-gray-700">
          <p>
            Subtotal: <span className="font-semibold">$1750</span>
          </p>
          <p>
            Discount: <span className="font-semibold">Free</span>
          </p>
          <p className="text-lg font-bold">Total: $1750</p>
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
