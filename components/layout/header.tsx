"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookUser,
  BriefcaseBusiness,
  ChevronsUpDown,
  History,
  LogOut,
  Menu,
  MessageCircle,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignInButton } from "../signin-form/signin-button";
import { menuItems } from "@/constants/constant";
import { Modal } from "antd";
import { SignUpForm } from "@/components/signup-form/signup-form";
import Image from "next/image";
import { Separator } from "../ui/separator";
import Notification from "../ui/notification";
import { useDispatch } from "react-redux";
import { login, logout } from "@/stores/slices/authSlice";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { toast } from "react-toastify";
import { BASE_URL } from "@/constants/environments";

function Header() {
  const pathname = usePathname();
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { customer } = useSelector((state: RootState) => state.auth);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [isToken, setIsToken] = useState(false);

  useEffect(() => {
    if (token !== null && token !== undefined && token !== "") {
      const getCustomerData = async () => {
        try {
          const decodeResponse = await fetch(
            `${BASE_URL}/users/decodejwttoken`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: token,
              }),
            }
          );

          if (!decodeResponse.ok) {
            throw new Error("Có lỗi xảy ra khi giải mã token.");
          }

          const decoded = await decodeResponse.json();
          const customerData = {
            id: decoded.claims.sub,
            fullName: decoded.claims.name,
            email: decoded.claims.email,
            phone: decoded.claims.Phone,
            roleId: decoded.claims.RoleId,
            avatar: decoded.avatarUrl,
          };

          setIsToken(true);
          dispatch(login(customerData));
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Đã xảy ra lỗi!";
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            theme: "light",
          });
          localStorage.removeItem("token");
          return;
        }
      };
      getCustomerData();
    }
  }, [dispatch, token]);

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

  const handleLogOut = () => {
    setOpenAccount(!openAccount);
    dispatch(logout());
    localStorage.removeItem("auth");
    window.location.reload();
  };

  return (
    <header className="bg-primary py-4 px-8 flex items-center justify-between text-white relative z-50">
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
        <Link
          href="/become-owner"
          className="font-medium hidden md:block h-full"
        >
          <button className="flex gap-2 text-base px-5 py-4 rounded-xl shadow border bg-secondary/60 hover:bg-fourth hover:text-white transition-colors duration-200">
            <BriefcaseBusiness /> Trở thành doanh nghiệp
          </button>
        </Link>
        {isToken && customer && <Notification customer={customer} />}
        {!isToken ? (
          <div className="flex flex-col md:flex-row items-center border rounded-xl bg-secondary/60 h-full w-full md:w-auto">
            <p
              onClick={() => {
                setSignInModalOpen(true);
                handleCloseSignUpForm();
              }}
              className="font-medium flex items-center justify-center hover:bg-fourth hover:text-white py-3 md:py-4 px-4 md:px-5 rounded-t-xl md:rounded-l-xl md:rounded-t-none md:rounded-tl-xl border-b md:border-b-0 md:border-r transition-colors duration-200 cursor-pointer w-full md:w-auto"
            >
              <span>Đăng nhập</span>
            </p>
            <p
              onClick={() => {
                setSignUpModalOpen(true);
              }}
              className="font-medium flex items-center justify-center hover:bg-fourth hover:text-white py-3 md:py-4 px-4 md:px-5 rounded-b-xl md:rounded-r-xl md:rounded-b-none border-t md:border-t-0 md:border-l transition-colors duration-200 cursor-pointer w-full md:w-auto"
            >
              <span>Đăng ký</span>
            </p>
          </div>
        ) : (
          <div ref={dropdownRef} className="relative h-full">
            <div
              className="group flex items-center justify-center border rounded-xl py-2 px-4 gap-4 group bg-secondary/60 hover:bg-fourth cursor-pointer transition-colors duration-200"
              onClick={() => setOpenAccount(!openAccount)}
            >
              <Image
                src={customer?.avatar || "/logo.png"}
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full border bg-white"
              />
              <div className="hidden md:flex flex-col justify-center items-start">
                <p className="text-sm font-semibold">{customer?.fullName}</p>
                <p className="text-xs font-medium">{customer?.email}</p>
              </div>
              <ChevronsUpDown size={20} />
            </div>
            {openAccount && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 z-10 mt-2 w-auto gap-3 rounded-xl bg-white shadow-xl pb-4 text-black border"
              >
                <div className="flex items-center justify-center py-2 px-4 gap-4 bg-primary rounded-t-xl">
                  <Image
                    src={customer?.avatar || "/logo.png"}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full border bg-white"
                  />
                  <div className="flex flex-col justify-center items-start">
                    <p className="text-sm font-semibold text-white">
                      {customer?.fullName}
                    </p>
                    <p className="text-xs font-medium text-white">
                      {customer?.email}
                    </p>
                  </div>
                </div>
                <Separator className="mb-2" />
                <Link
                  onClick={() => setOpenAccount(!openAccount)}
                  href="/profile"
                  className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
                >
                  <BookUser size={16} />
                  <span>Hồ sơ</span>
                </Link>
                <Link
                  onClick={() => setOpenAccount(!openAccount)}
                  href="/purchase-history"
                  className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
                >
                  <History size={16} />
                  <span>Lịch sử thanh toán</span>
                </Link>
                <Link
                  onClick={() => setOpenAccount(!openAccount)}
                  href="/user-feedbacks"
                  className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>Trung tâm hỗ trợ</span>
                </Link>
                <Link
                  onClick={() => setOpenAccount(!openAccount)}
                  href="/wallet"
                  className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
                >
                  <Wallet size={16} />
                  <span>Ví WorkHive</span>
                </Link>
                <li
                  onClick={handleLogOut}
                  className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </li>
              </motion.div>
            )}
          </div>
        )}
        <button
          className="md:hidden flex items-center justify-center p-2"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-primary text-white flex flex-col items-center gap-4 py-4 md:hidden">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="font-medium text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/become-owner"
            className="font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            <button className="text-base px-5 py-3 rounded-xl shadow hover:bg-secondary bg-[#484848]">
              Trở thành doanh nghiệp
            </button>
          </Link>
        </nav>
      )}

      <Modal
        open={isSignUpModalOpen}
        onCancel={() => setSignUpModalOpen(false)}
        footer={null}
        width={530}
      >
        <SignUpForm onCloseSignUpForm={handleCloseSignUpForm} />
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
