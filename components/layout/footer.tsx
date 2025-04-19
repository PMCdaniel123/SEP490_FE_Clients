import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Separator } from "../ui/separator";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-seventh text-fourth text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-primary">WorkHive</h2>
            <p className="text-fifth">
              Chúng tôi cung cấp một nền tảng sáng tạo để quản lý đặt chỗ, thanh
              toán và không gian làm việc một cách dễ dàng.
            </p>
            <div className="flex gap-2">
              <button className="bg-sixth hover:bg-fifth text-sm px-4 py-2 rounded-md transition duration-300">
                CH Play
              </button>
              <button className="bg-sixth hover:bg-fifth text-sm px-4 py-2 rounded-md transition duration-300">
                App Store
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-base mb-4">TRUY CẬP NHANH</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:underline hover:text-primary hover:font-medium transition-all duration-200"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="hover:underline hover:text-primary hover:font-medium transition-all duration-200"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/workspace"
                  className="hover:underline hover:text-primary hover:font-medium transition-all duration-200"
                >
                  Không gian
                </Link>
              </li>
              <li>
                <Link
                  href="/workspace-owner"
                  className="hover:underline hover:text-primary hover:font-medium transition-all duration-200"
                >
                  Thương hiệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-base mb-4">TRỢ GIÚP</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="hover:underline hover:text-primary hover:font-medium transition-all duration-200"
                >
                  Liên hệ WorkHive
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:underline hover:text-primary hover:font-medium transition-all duration-200"
                >
                  Phản hồi dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="/become-owner"
                  className="hover:underline hover:text-primary hover:font-medium transition-all duration-200"
                >
                  Trở thành doanh nghiệp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-base mb-4">THÔNG TIN LIÊN HỆ</h3>
            <ul className="space-y-2">
              <li>
                <strong>Số điện thoại:</strong> 0867-435-157
              </li>
              <li>
                <strong>Email:</strong> workhive.vn.official@gmail.com
              </li>
              <li>
                <strong>Địa chỉ:</strong> 114 Nguyễn Cơ Thạch, An Lợi Đông, Thủ
                Đức, Hồ Chí Minh, Việt Nam
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <Facebook className="hover:text-primary transition-colors" />
              <Twitter className="hover:text-primary transition-colors" />
              <Instagram className="hover:text-primary transition-colors" />
              <Linkedin className="hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-sixth" />

      {/* Bottom Footer */}
      <div className="bg-seventh text-center text-xs md:text-sm py-4 px-4 md:px-20 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="font-medium">© 2025 SP25SE173 | All rights reserved</p>
        <p className="font-medium">Created with ❤️ by GSP25SE13</p>
      </div>
    </footer>
  );
}

export default Footer;
