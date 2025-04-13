"use client";

import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/ui/section-tilte";
import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import AnimateInView from "@/components/animate-ui/animate-section";

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
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <section className="text-center">
        <p className="text-4xl font-bold relative inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm hover:drop-shadow-md transition-all duration-300">
          Liên hệ
        </p>
        <p className="text-gray-600 mt-4 max-w-4xl mx-auto">
          Nền tảng của chúng tôi là cầu nối giữa những người đang tìm kiếm không
          gian làm việc linh hoạt và các doanh nghiệp sở hữu co-working space.
          Chúng tôi luôn sẵn sàng hỗ trợ bạn, dù bạn là người thuê đang tìm chỗ
          làm việc phù hợp, hay doanh nghiệp muốn tối ưu hóa không gian của
          mình.
        </p>
      </section>

      <AnimateInView>
        <section className="mt-20">
          <SectionTitle>Liên hệ với chúng tôi</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {/* Contact Info */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="flex items-center gap-4">
                <Phone className="text-brown-700 text-2xl" />
                <h3 className="text-lg font-semibold">Liên hệ qua hotline</h3>
              </div>
              <p className="text-gray-600 mt-2">Chúng tôi phục vụ 24/7.</p>
              <p className="text-gray-600 font-semibold">Phone: 0867-435-157</p>
              <hr className="my-4" />
              <div className="flex items-center gap-4">
                <Mail className="text-brown-700 text-2xl" />
                <h3 className="text-lg font-semibold">Liên hệ qua Email</h3>
              </div>
              <p className="text-gray-600 mt-2">
                Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.{" "}
              </p>
              <p className="text-gray-600 font-semibold">
                workhive.vn.official@gmail.com
              </p>
            </div>

            {/* Contact Form */}
            <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
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
                  className="w-full p-2 border rounded-lg"
                  placeholder="Your Name *"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Your Email *"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Your Phone *"
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg col-span-3"
                  rows={4}
                  placeholder="Your Message"
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.502144056634!2d106.7218573153343!3d10.773374992324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292b7e4b3b%3A0x2b1b1b1b1b1b1b1b!2s114%20Nguy%E1%BB%85n%20C%C6%A1%20Th%E1%BA%A1ch%2C%20Qu%E1%BA%ADn%202%2C%20TP.HCM!5e0!3m2!1sen!2s!4v1616581234567!5m2!1sen!2s"
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
