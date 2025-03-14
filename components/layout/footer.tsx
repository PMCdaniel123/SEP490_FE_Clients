import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Separator } from "../ui/separator";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-seventh">
      <div className="mx-auto px-4 py-16 sm:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-8">
          <div className="col-span-1 sm:col-span-2">
            <h2 className="text-5xl font-extrabold text-primary">WorkHive</h2>
            <p className="text-fifth text-sm mt-6">
              Chúng tôi cung cấp một nền tảng sáng tạo để quản lý đặt chỗ, thanh toán và không gian làm việc một cách dễ dàng.
            </p>
            <div className="flex gap-4 mt-4">
              <button className="bg-sixth hover:bg-fifth px-4 py-2 rounded-lg">
                CH Play
              </button>
              <button className="bg-sixth hover:bg-fifth px-4 py-2 rounded-lg">
                App Store
              </button>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-bold text-fourth">TRUY CẬP NHANH</h3>
            <ul className="mt-4 font-base text-base space-y-2 text-fourth">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <Link href="/about">Giới thiệu</Link>
              </li>
              <li>
                <Link href="/workspace">Không gian</Link>
              </li>
              <li>
                <Link href="/contact">Liên hệ</Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-bold text-fourth">TRỢ GIÚP</h3>
            <ul className="mt-4 font-base text-base space-y-2 text-fourth">
              <li>
                <Link href="/contact-us">Liên hệ WorkHive</Link>
              </li>
              <li>
                <Link href="/#">Phản hồi dịch vụ</Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <h3 className="font-bold text-fourth">THÔNG TIN LIÊN HỆ</h3>
            <ul className="mt-4 font-base text-base space-y-2 text-fourth">
              <li>Số điện thoại: 1234567890</li>
              <li>Email: workhive@email.com</li>
              <li>Địa chỉ: 123 Lê Văn Việt, Thủ Đức</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <Facebook className="text-fourth hover:text-gray-800" />
              <Twitter className="text-fourth hover:text-gray-800" />
              <Instagram className="text-fourth hover:text-gray-800" />
              <Linkedin className="text-fourth hover:text-gray-800" />
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-sixth" />

      <div className="bg-seventh text-center py-4 flex items-center justify-between px-20">
        <p className="text-fourth font-semibold">
          © 2025 SP25SE173 | All rights reserved
        </p>
        <p className="text-fourth font-semibold">
          Created with love by GSP25SE13
        </p>
      </div>
    </footer>
  );
}

export default Footer;