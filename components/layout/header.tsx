"use client";

import { useState } from "react";
import { AlignJustify, ChevronDown, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton } from "../signin-form/signin-button";
import { menuItems } from "@/constants/constant";
import { Modal } from "antd";
import SignupPage from "@/app/(auth)/sign-up/page";

function Header() {
  const pathname = usePathname();

  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);

  const handleCloseSignUpForm = () => {
    setSignUpModalOpen(false);
  };

  return (
    <header className="bg-primary py-4 px-20 flex items-center justify-between text-white relative z-50">
      <h1 className="text-3xl font-extrabold">WorkHive</h1>
      <nav className="hidden md:flex items-center justify-around space-x-12 md:gap-8">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className="relative group py-4 pl-6 flex items-center justify-center font-semibold cursor-pointer"
          >
            <Link href={item.path} className="font-medium">
              {item.name}
            </Link>

            <span
              className={`absolute left-0 transform -translate-x-1 h-4 w-4 rounded-full bg-secondary transition-all duration-300 ${
                pathname === item.path
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            ></span>
          </li>
        ))}
        <div className="relative group p-2">
          <div className="font-medium flex items-center gap-2 cursor-pointer">
            <p>Không gian & Workshop</p>
            <span className="group-hover:rotate-180 transition duration-100">
              <ChevronDown size={16} />
            </span>
          </div>

          <ul className="absolute hidden group-hover:block top-3/4 left-0 z-50 mt-2 w-[400px] gap-3 rounded-md bg-white shadow-lg p-4">
            <li>
              <Link
                href="/workspace"
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seventh hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="text-base font-semibold leading-none text-primary">
                  Không gian
                </div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  Xem tất cả không gian của WorkHive.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/workshop"
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seventh hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="text-base font-semibold leading-none text-primary">
                  Workshop
                </div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  Xem tất cả workshop của WorkHive.
                </p>
              </Link>
            </li>
          </ul>
        </div>
        <Link href="/" className="font-medium">
          Tải Ứng dụng WorkHive
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        <Link href="/become-owner" className="font-medium">
          <button className="bg-fourth text-white px-6 py-3 rounded-full shadow hover:bg-fifth">
            Trở thành doanh nghiệp
          </button>
        </Link>
        <div className="relative group flex items-center rounded-full bg-white pl-3 p-1 gap-2">
          <span className="text-fourth mx-2">
            <AlignJustify size={28} />
          </span>
          <span className="rounded-full bg-fourth p-1">
            <UserRound size={32} />
          </span>
          <ul className="absolute hidden group-hover:block top-3/4 right-0 z-50 mt-2 w-auto gap-3 rounded-md bg-white shadow-lg p-4">
            <li>
              <button
                onClick={() => setSignUpModalOpen(true)}
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seventh hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="text-base font-semibold leading-none text-primary">
                  Đăng ký
                </div>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setSignInModalOpen(true);
                  handleCloseSignUpForm();
                }}
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seventh hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="text-base font-semibold leading-none text-primary">
                  Đăng nhập
                </div>
              </button>
            </li>
            <li>
              <Link
                href="/checkout"
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seventh hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="text-base font-semibold leading-none text-primary">
                  Thanh toán
                </div>
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seventh hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="text-base font-semibold leading-none text-primary">
                  Hồ sơ
                </div>
              </Link>
            </li>
            <li>
              <Link
                href="/purchase-history"
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seventh hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="text-base font-semibold leading-none text-primary">
                  Lịch sử thanh toán
                </div>
              </Link>
            </li>
            <li>
              <Link
                href="/your-booking"
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seventh hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="text-base font-semibold leading-none text-primary">
                  Đặt chỗ của bạn
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <Modal
        open={isSignUpModalOpen}
        onCancel={() => setSignUpModalOpen(false)}
        footer={null}
        width={900}
      >
        <SignupPage onCloseSignUpForm={handleCloseSignUpForm} />
      </Modal>

      <SignInButton
        open={isSignInModalOpen}
        onOpenChange={setSignInModalOpen}
        onCloseSignUpForm={handleCloseSignUpForm}
      />
    </header>
  );
}

export default Header;
