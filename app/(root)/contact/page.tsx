"use client";

import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/ui/section-tilte";
import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import AnimateInView from "@/components/animate-ui/animate-section";
import { BASE_URL } from "@/constants/environments";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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

    const response = await fetch(`${BASE_URL}/users/supportuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setLoading(false);
    if (response.ok) {
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <div className="w-full md:w-[90%] mx-auto px-6 pt-10 pb-20">
      <AnimateInView>
        <section>
          <SectionTitle>Liên hệ với chúng tôi</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {/* Contact Info */}
            <div className="bg-gray-100 p-6 rounded-lg w-full col-span-1">
              <div className="flex items-center gap-4">
                <Phone className="text-brown-700 text-2xl" />
                <h3 className="text-base font-semibold">Liên hệ qua hotline</h3>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Chúng tôi phục vụ 24/7.
              </p>
              <p className="text-gray-600 text-sm font-semibold">
                Số điện thoại: 0867-435-157
              </p>
              <hr className="my-4" />
              <div className="flex items-center gap-4">
                <Mail className="text-brown-700 text-2xl" />
                <h3 className="text-base font-semibold">Liên hệ qua Email</h3>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.{" "}
              </p>
              <p className="text-gray-600 text-sm font-semibold">
                workhive.vn.official@gmail.com
              </p>
            </div>

            {/* Contact Form */}
            <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-lg w-full">
              {success && (
                <p className="text-green-500">
                  Tin nhắn đã được gửi thành công!
                </p>
              )}
              <form
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg col-span-3 md:col-span-1"
                  placeholder="Họ tên *"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg col-span-3 md:col-span-1"
                  placeholder="Email *"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg col-span-3 md:col-span-1"
                  placeholder="Số điện thoại *"
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg col-span-3"
                  rows={4}
                  placeholder="Tin nhắn *"
                  required
                ></textarea>
                <div className="col-span-3 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#8B5D27] text-white py-2 px-6 rounded-lg"
                    disabled={loading}
                  >
                    {loading ? "Đang gửi..." : "Gửi"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </AnimateInView>

      <AnimateInView delay={0.3}>
        <section className="mt-20">
          <SectionTitle>Câu hỏi thường gặp</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h4 className="font-semibold text-brown-700">
                Làm thế nào để đặt chỗ một không gian làm việc?
              </h4>
              <p className="text-gray-600 mt-2">
                Bạn chỉ cần đăng nhập, tìm kiếm không gian phù hợp, chọn ngày và
                khung giờ, sau đó hoàn tất thanh toán để xác nhận đặt chỗ.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h4 className="font-semibold text-brown-700">
                Tôi có thể hủy đặt chỗ không?
              </h4>
              <p className="text-gray-600 mt-2">
                Có. Bạn có thể hủy đặt chỗ trong thời gian quy định của từng
                workspace. Vui lòng kiểm tra chính sách hoàn tiền trước khi xác
                nhận.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h4 className="font-semibold text-brown-700">
                Làm sao để đăng ký cho thuê không gian?
              </h4>
              <p className="text-gray-600 mt-2">
                Doanh nghiệp có thể tạo tài khoản, sau đó truy cập trang
                &quot;Quản lý không gian&quot; để thêm thông tin chi tiết, hình
                ảnh và lịch hoạt động của không gian.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h4 className="font-semibold text-brown-700">
                Thanh toán có an toàn không?
              </h4>
              <p className="text-gray-600 mt-2">
                Chúng tôi sử dụng hệ thống thanh toán bảo mật, hỗ trợ nhiều hình
                thức như thẻ tín dụng, ví điện tử và chuyển khoản ngân hàng.
              </p>
            </div>
          </div>
        </section>
      </AnimateInView>

      {/* Map */}
      <AnimateInView delay={0.6}>
        <section className="mt-20">
          <SectionTitle>Bản Đồ</SectionTitle>
          <div className="w-full h-96 pt-5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6099415310764!2d106.8073027103983!3d10.841132857952651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1746595633780!5m2!1svi!2s"
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
        </section>
      </AnimateInView>
    </div>
  );
}

export default Contact;
