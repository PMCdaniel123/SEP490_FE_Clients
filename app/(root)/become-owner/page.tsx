"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Modal } from "antd";
import BecomeOwnerForm from "@/components/signup-form/become-owner-form";
import WorkButton from "@/components/animate-ui/work-button";
import AnimateInView from "@/components/animate-ui/animate-section";

export default function BecomeOwner() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <section className="relative w-full h-[500px]">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="/feauture-section.jpg"
          alt="Office Space"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        <div className="relative z-20 text-white flex flex-col justify-center items-center h-full text-center px-6">
          <h1 className="text-4xl font-bold mb-4">
            Biến không gian của bạn thành cơ hội kinh doanh!
          </h1>
          <p className="text-lg max-w-2xl">
            Bạn có không gian làm việc trống? Hãy tham gia cùng chúng tôi và
            biến không gian của bạn thành nguồn thu nhập ổn định.
          </p>
          <Button
            className="mt-6 w-60 px-6 py-4 bg-black text-white border border-white rounded-md mb-4"
            onClick={handleOpen}
          >
            Đăng ký doanh nghiệp
          </Button>
          <WorkButton />
        </div>
      </section>
      <AnimateInView>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto py-16 px-6">
          <div>
            <Image
              src="/become-owner1.jpg"
              alt="Modern Office"
              width={600}
              height={400}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">
              Tối ưu hóa giá trị không gian của bạn!
            </h2>
            <p className="text-gray-600 mb-4">
              Tăng thu nhập: Biến không gian trống thành một tài sản sinh lời
              với hệ thống hỗ trợ toàn diện từ chúng tôi.
            </p>
            <p className="text-gray-600 mb-4">
              Xây dựng thương hiệu cá nhân: Định vị bạn là một phần của xu hướng
              làm việc hiện đại, mang đến giá trị cho cộng đồng freelancer,
              doanh nghiệp nhỏ và đội nhóm sáng tạo.
            </p>
            <p className="text-gray-600">
              Hệ thống quản lý thông minh: Dễ dàng quản lý đặt chỗ, lịch sử
              thanh toán, và dịch vụ khách hàng thông qua nền tảng của chúng
              tôi.
            </p>
          </div>
        </section>
      </AnimateInView>
      <AnimateInView delay={0.2}>
        <section className="bg-gray-100 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Quy trình đăng ký đơn giản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-xl font-semibold mb-2">
                  1. Điền thông tin
                </h3>
                <p className="text-gray-600">
                  Chia sẻ thông tin không gian và mô hình kinh doanh của bạn.
                </p>
              </div>
              <div>
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">
                  2. Xác thực & Duyệt
                </h3>
                <p className="text-gray-600">
                  Đội ngũ của chúng tôi sẽ liên hệ và xác minh thông tin.
                </p>
              </div>
              <div>
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">
                  3. Bắt đầu cho thuê
                </h3>
                <p className="text-gray-600">
                  Không gian của bạn sẽ hiển thị trên hệ thống và sẵn sàng được
                  đặt chỗ.
                </p>
              </div>
            </div>
          </div>
        </section>
      </AnimateInView>
      <AnimateInView delay={0.4}>
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tại sao nên hợp tác với chúng tôi?
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-lg">
            <li>🔧 Hệ thống quản lý đặt chỗ thông minh</li>
            <li>📈 Tăng tỉ lệ khai thác không gian trống</li>
            <li>💬 Hỗ trợ 24/7 từ đội ngũ chuyên môn</li>
            <li>🎯 Tăng độ phủ thương hiệu trên nền tảng</li>
            <li>💵 Chính sách hoa hồng rõ ràng, minh bạch</li>
          </ul>
        </section>
      </AnimateInView>
      <AnimateInView delay={0.6}>
        <section className="py-16 px-6 max-w-4xl mx-auto bg-gray-100 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold">Tôi cần chuẩn bị gì để bắt đầu?</h4>
              <p className="text-gray-600">
                Chỉ cần có không gian trống và thông tin cơ bản. Đội ngũ chúng
                tôi sẽ hỗ trợ bạn từng bước.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">
                Làm sao để đảm bảo khách hàng tin cậy?
              </h4>
              <p className="text-gray-600">
                Chúng tôi có hệ thống xác minh danh tính, đánh giá, và quy trình
                thanh toán an toàn.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">
                Chi phí sử dụng nền tảng là bao nhiêu?
              </h4>
              <p className="text-gray-600">
                Miễn phí đăng ký. Chúng tôi thu hoa hồng nhỏ trên mỗi giao dịch
                thành công.
              </p>
            </div>
          </div>
        </section>
      </AnimateInView>
      <Modal open={isOpen} onCancel={handleClose} footer={null}>
        <BecomeOwnerForm onClose={handleClose} />
      </Modal>
    </div>
  );
}
