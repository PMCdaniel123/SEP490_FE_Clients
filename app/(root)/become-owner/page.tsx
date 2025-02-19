"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Modal } from "antd";
import { SignUpForm } from "@/components/signup-form/signup-form";

export default function BecomeOwner() {
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);

  const handleOpenSignUpForm = () => {
    setSignUpModalOpen(true);
  };

  const handleCloseSignUpForm = () => {
    setSignUpModalOpen(false);
  };

  return (
    <div>
      <section className="relative w-full h-[500px]">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="/become-owner.jpg"
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
            className="mt-6 w-48 px-6 py-2 bg-black text-white rounded"
            onClick={handleOpenSignUpForm}
          >
            Đăng ký
          </Button>
        </div>
      </section>
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
            Tăng thu nhập: Biến không gian trống thành một tài sản sinh lời với
            hệ thống hỗ trợ toàn diện từ chúng tôi.
          </p>
          <p className="text-gray-600 mb-4">
            Xây dựng thương hiệu cá nhân: Định vị bạn là một phần của xu hướng
            làm việc hiện đại, mang đến giá trị cho cộng đồng freelancer, doanh
            nghiệp nhỏ và đội nhóm sáng tạo.
          </p>
          <p className="text-gray-600">
            Hệ thống quản lý thông minh: Dễ dàng quản lý đặt chỗ, lịch sử thanh
            toán, và dịch vụ khách hàng thông qua nền tảng của chúng tôi.
          </p>
        </div>
      </section>
      <Modal
        open={isSignUpModalOpen}
        onCancel={handleCloseSignUpForm}
        footer={null}
        width={600}
      >
        <SignUpForm onCloseSignUpForm={handleCloseSignUpForm} role="owner" />
      </Modal>
    </div>
  );
}
