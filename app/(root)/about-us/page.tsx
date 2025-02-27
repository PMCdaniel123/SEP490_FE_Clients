"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
      <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden rounded-xl">
        <Image
          src="/banner.png"
          alt="Về Chúng Tôi"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl lg:text-5xl font-bold">
            Về Hệ Thống Của Chúng Tôi
          </h1>
          <p className="mt-4 text-lg lg:text-xl max-w-3xl">
            Chúng tôi cung cấp một nền tảng sáng tạo để quản lý đặt chỗ, thanh
            toán và không gian làm việc một cách dễ dàng.
          </p>
        </div>
      </div>
      <section className="mt-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Trải Nghiệm Mượt Mà
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Hệ thống của chúng tôi được thiết kế để cung cấp trải nghiệm đặt chỗ
            không gian làm việc mượt mà. Dù bạn là freelancer, startup hay doanh
            nghiệp, chúng tôi cung cấp nhiều không gian để đáp ứng nhu cầu của
            bạn.
          </p>
        </div>
        <Image
          src="/become-owner.jpg"
          alt="Không Gian Làm Việc"
          width={600}
          height={400}
          className="rounded-lg"
        />
      </section>
      <section className="mt-16 grid lg:grid-cols-2 gap-12 items-center">
        <Image
          src="/become-owner1.jpg"
          alt="Đặt Chỗ Dễ Dàng"
          width={600}
          height={400}
          className="rounded-lg"
        />
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Đặt Chỗ & Thanh Toán Dễ Dàng
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Thưởng thức quy trình đặt chỗ mượt mà với các tùy chọn thanh toán an
            toàn. Nền tảng của chúng tôi đảm bảo các giao dịch an toàn và không
            gặp rắc rối cho tất cả người dùng.
          </p>
        </div>
      </section>
      <section className="mt-16 bg-gray-100 py-12 px-6 text-center rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-900">
          Tham Gia Ngay Hôm Nay
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Khám phá những không gian làm việc tốt nhất và tối ưu hóa quản lý
          không gian làm việc của bạn với hệ thống tiên tiến của chúng tôi.
        </p>
        <Link href="/">
          <Button className="mt-6 px-6 py-3  text-white text-lg rounded-lg transition">
            Bắt Đầu
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default AboutUs;
