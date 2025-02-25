"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignInButton } from "../signin-form/signin-button";
import { menuItems } from "@/constants/constant";
import { Modal } from "antd";
import SignupPage from "@/app/(auth)/sign-up/page";
import Image from "next/image";
import { Separator } from "../ui/separator";
import Notification from "../ui/notification";

function Header() {
  const pathname = usePathname();

  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenAccount(false);
      }
    }

    if (openAccount) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openAccount]);

  const handleCloseSignUpForm = () => {
    setSignUpModalOpen(false);
  };

  return (
    <header className="bg-primary py-4 px-16 flex items-center justify-between text-white relative z-50">
      <h1
        className="text-3xl font-extrabold cursor-pointer"
        onClick={() => router.push("/")}
      >
        WorkHive
      </h1>
      <nav className="hidden md:flex items-center justify-around gap-10">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className="relative group py-4 pl-6 flex items-center justify-center font-semibold cursor-pointer"
          >
            <Link href={item.path} className="font-medium text-base">
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
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/become-owner" className="font-medium">
          <button className="text-base px-5 py-3 rounded-xl shadow hover:bg-secondary bg-[#484848]">
            Trở thành doanh nghiệp
          </button>
        </Link>
        <Notification />
        <div ref={dropdownRef} className="relative">
          <div
            className="group flex items-center justify-center border rounded-xl py-2 px-4 gap-4 group hover:bg-secondary cursor-pointer transition-colors duration-200"
            onClick={() => setOpenAccount(!openAccount)}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full border bg-white"
            />
            <div className="flex flex-col justify-center items-start">
              <p className="text-sm font-semibold">WorkHive Customer</p>
              <p className="text-sm">customer@gmail.com</p>
            </div>
            <ChevronsUpDown size={20} />
          </div>
          {openAccount && (
            <ul className="absolute top-full right-0 z-10 mt-2 w-auto gap-3 rounded-xl bg-white shadow-xl pb-4 text-black">
              <div className="flex items-center justify-center py-2 px-4 gap-4">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-full border"
                />
                <div className="flex flex-col justify-center items-start">
                  <p className="text-sm font-semibold">WorkHive Owners</p>
                  <p className="text-sm">owners@gmail.com</p>
                </div>
              </div>
              <Separator className="my-2" />
              <li
                onClick={() => {
                  setSignInModalOpen(true);
                  handleCloseSignUpForm();
                  setOpenAccount(!openAccount);
                }}
                className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
              >
                <span>Đăng nhập</span>
              </li>
              <li
                onClick={() => {
                  setSignUpModalOpen(true);
                  setOpenAccount(!openAccount);
                }}
                className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
              >
                <span>Đăng ký</span>
              </li>
              <Link
                onClick={() => setOpenAccount(!openAccount)}
                href="/checkout"
                className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
              >
                <span>Thanh toán</span>
              </Link>
              <Link
                onClick={() => setOpenAccount(!openAccount)}
                href="/profile"
                className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
              >
                <span>Hồ sơ</span>
              </Link>
              <Link
                onClick={() => setOpenAccount(!openAccount)}
                href="/purchase-history"
                className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
              >
                <span>Lịch sử thanh toán</span>
              </Link>
              <Link
                onClick={() => setOpenAccount(!openAccount)}
                href="/your-booking"
                className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
              >
                <span>Đặt chỗ của bạn</span>
              </Link>
            </ul>
          )}
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
