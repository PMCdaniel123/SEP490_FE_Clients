"use client";

import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/ui/section-tilte";
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: "08d6dceb-4e8d-44fd-941d-d8a6c301be34",
        ...formData,
      }),
    });

    setLoading(false);
    if (response.ok) {
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <section className="mb-12">
        <SectionTitle>Liên Hệ</SectionTitle>
        <p className="text-lg text-gray-600">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng
          tôi qua các kênh dưới đây.
        </p>
      </section>

      <section className="mb-12">
        <SectionTitle>Thông Tin Liên Hệ</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-5">
          <div>
            <h3 className="text-xl font-semibold">Địa Chỉ</h3>
            <p className="text-gray-600">114 Nguyễn Cơ Thạch, Quận 2, TP.HCM</p>
            <h3 className="text-xl font-semibold mt-4">Điện Thoại</h3>
            <p className="text-gray-600">+84 123 456 789</p>
            <h3 className="text-xl font-semibold mt-4">Email</h3>
            <p className="text-gray-600">info@company.com</p>
          </div>
          <div className="flex justify-center items-center">
            <img
              src="/banner.png"
              alt="Contact"
              className="rounded-lg w-full h-auto max-w-md"
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionTitle>Gửi Tin Nhắn</SectionTitle>
        {success && (
          <p className="text-green-500">Tin nhắn đã được gửi thành công!</p>
        )}
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          <div className="md:col-span-1 pt-5">
            <label className="block text-sm font-medium">Tên của bạn</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
              placeholder="Nhập tên của bạn"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium pt-5">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Tin nhắn</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
              rows={4}
              placeholder="Nhập tin nhắn của bạn"
              required
            ></textarea>
          </div>
          <div className="md:col-span-2 justify-center flex">
            <Button
              type="submit"
              className="w-60 bg-black text-white py-3 rounded-lg"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi Tin Nhắn"}
            </Button>
          </div>
        </form>
      </section>
      <section className="mb-12">
        <SectionTitle>Bản Đồ</SectionTitle>
        <div className="w-full h-96 pt-5">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.502144056634!2d106.7218573153343!3d10.773374992324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292b7e4b3b%3A0x2b1b1b1b1b1b1b1b!2s114%20Nguy%E1%BB%85n%20C%C6%A1%20Th%E1%BA%A1ch%2C%20Qu%E1%BA%ADn%202%2C%20TP.HCM!5e0!3m2!1sen!2s!4v1616581234567!5m2!1sen!2s"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

export default Contact;
