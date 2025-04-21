"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookUser,
  BriefcaseBusiness,
  Building,
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
import Cookies from "js-cookie";
import SlideArrowButton from "../animate-ui/slide-arrow-button";
import AnimatedBorderTrail from "../animate-ui/trail-border";

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
  const token = typeof window !== "undefined" ? Cookies.get("token") : null;
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
            throw new Error("Có lỗi xảy ra khi đăng nhập.");
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
            autoClose: 1500,
            hideProgressBar: false,
            theme: "light",
          });
          Cookies.remove("token");
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

  const handleLogOut = async () => {
    dispatch(logout());
    setOpenAccount(!openAccount);
    localStorage.removeItem("auth");

    window.location.href = "/";
  };

  return (
    <header className="bg-primary py-4 px-6 md:px-8 flex items-center justify-between text-white relative z-50 shadow-md">
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => router.push("/")}
      >
        <div className="w-9 h-9 bg-secondary rounded-md flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
          <Image
            src="/WorkHive.svg"
            alt="WorkHive Logo"
            width={22}
            height={22}
            className="object-contain"
          />
        </div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent drop-shadow-sm hover:drop-shadow-md transition-all duration-300">
          WorkHive
        </h1>
      </div>
      <nav className="hidden md:flex items-center justify-around gap-6 xl:gap-8">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className="relative group pl-2 flex items-center justify-center font-semibold cursor-pointer"
          >
            <Link
              href={item.path}
              className={`font-medium text-base transition-colors duration-200 py-4 px-4 rounded ${
                pathname === item.path
                  ? "bg-gradient-to-r from-primary to-secondary"
                  : ""
              }`}
            >
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
        <li className="relative group pl-2 flex items-center justify-center font-semibold cursor-pointer">
          <p
            className={`font-medium text-base transition-colors duration-200 py-4 px-4 rounded ${
              pathname?.includes("workspace")
                ? "bg-gradient-to-r from-primary to-secondary"
                : ""
            }`}
          >
            Danh mục
          </p>

          <span
            className={`absolute left-0 transform -translate-x-1 h-4 w-4 rounded-full bg-secondary transition-all duration-300 ${
              pathname?.includes("workspace")
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          ></span>

          <ul className="absolute top-full left-1/2 -translate-x-1/2 p-2 md:min-w-[360px] bg-white shadow-lg rounded-lg invisible opacity-0 pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 translate-y-2 transition-all duration-300 z-50 border">
            <li
              className={`flex items-center gap-4 p-3 rounded-lg bg-white text-gray-700 md:min-w-[360px] ${
                pathname === "/workspace"
                  ? "border border-primary"
                  : "hover:bg-secondary hover:text-white"
              }`}
              onClick={() => router.push("/workspace")}
            >
              <Building className="border-r-2 border-primary w-1/6" size={26} />
              <div className="w-5/6">
                <p className="font-semibold text-base">Không gian</p>
                <p className="font-light text-sm">
                  Danh sách không gian của chúng tôi
                </p>
              </div>
            </li>
            <li
              className={`mt-2 flex items-center gap-4 p-3 rounded-lg bg-white text-gray-700 md:min-w-[360px] ${
                pathname === "/workspace-owner"
                  ? "border border-primary"
                  : "hover:bg-secondary hover:text-white"
              }`}
              onClick={() => router.push("/workspace-owner")}
            >
              <BriefcaseBusiness
                className="border-r-2 border-primary w-1/6"
                size={26}
              />
              <div className="w-5/6">
                <p className="font-semibold text-base">Thương hiệu</p>
                <p className="font-light text-sm">
                  Danh sách thương hiệu của chúng tôi
                </p>
              </div>
            </li>
          </ul>
        </li>
      </nav>
      <div className="flex items-center gap-3 md:gap-4">
        <Link
          href="/become-owner"
          className="font-medium hidden md:block h-full"
        >
          <SlideArrowButton
            text="Trở thành doanh nghiệp"
            primaryColor="#B49057"
            icon={BriefcaseBusiness}
          />
        </Link>
        {isToken && customer && <Notification customer={customer} />}
        {!isToken ? (
          <AnimatedBorderTrail trailSize="sm" trailColor="#D0BEA0">
            <div className="flex flex-col md:flex-row items-center border rounded-xl text-fourth bg-white h-full w-full md:w-auto shadow-md overflow-hidden">
              <p
                onClick={() => {
                  setSignInModalOpen(true);
                  handleCloseSignUpForm();
                }}
                className="z-50 text-sm font-semibold flex items-center justify-center hover:bg-fourth hover:text-white py-3 md:py-3 px-4 md:px-5 rounded-t-xl md:rounded-l-xl md:rounded-t-none md:rounded-tl-xl border-b md:border-b-0 md:border-r transition-all duration-300 cursor-pointer w-full md:w-auto"
              >
                <span>Đăng nhập</span>
              </p>
              <p
                onClick={() => {
                  setSignUpModalOpen(true);
                }}
                className="z-50 text-sm font-semibold flex items-center justify-center hover:bg-fourth hover:text-white py-3 md:py-3 px-4 md:px-5 rounded-b-xl md:rounded-r-xl md:rounded-b-none border-t md:border-t-0 md:border-l transition-all duration-300 cursor-pointer w-full md:w-auto"
              >
                <span>Đăng ký</span>
              </p>
            </div>
          </AnimatedBorderTrail>
        ) : (
          <div
            ref={dropdownRef}
            className="relative h-full max-w-[140px] md:max-w-none"
          >
            <div
              className="group flex items-center justify-center border rounded-xl py-2 px-4 gap-3 bg-secondary/70 hover:bg-fourth cursor-pointer transition-all duration-300 shadow-md w-full"
              onClick={() => setOpenAccount(!openAccount)}
            >
              <Image
                src={customer?.avatar || "/WorkHive.svg"}
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full border-2 border-white bg-white object-cover"
              />
              <div className="hidden md:flex flex-col justify-center items-start md:w-[140px]">
                <p className="text-sm font-semibold truncate md:w-[140px]">
                  {customer?.fullName}
                </p>
                <p className="text-xs font-medium truncate md:w-[140px] opacity-90">
                  {customer?.email}
                </p>
              </div>
              <ChevronsUpDown
                size={18}
                className="transition-transform duration-300 group-hover:rotate-180"
              />
            </div>
            {openAccount && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 z-10 mt-2 rounded-xl bg-white shadow-xl pb-2 text-black border border-secondary overflow-hidden w-max min-w-[220px]"
              >
                <div className="flex items-center justify-center py-3 px-4 gap-4 bg-gradient-to-r from-primary to-fourth">
                  <Image
                    src={customer?.avatar || "/WorkHive.svg"}
                    alt="Logo"
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-white bg-white object-cover"
                  />
                  <div className="flex flex-col justify-center items-start">
                    <p className="text-sm font-semibold text-white">
                      {customer?.fullName}
                    </p>
                    <p className="text-xs font-medium text-white/90">
                      {customer?.email}
                    </p>
                  </div>
                </div>
                <Separator className="mb-1" />
                <Link
                  onClick={() => setOpenAccount(!openAccount)}
                  href="/profile"
                  className="px-4 flex items-center gap-3 hover:bg-primary hover:text-white py-2.5 transition-colors duration-200 cursor-pointer"
                >
                  <BookUser size={16} />
                  <span>Hồ sơ</span>
                </Link>
                <Link
                  onClick={() => setOpenAccount(!openAccount)}
                  href="/purchase-history"
                  className="px-4 flex items-center gap-3 hover:bg-primary hover:text-white py-2.5 transition-colors duration-200 cursor-pointer"
                >
                  <History size={16} />
                  <span>Lịch sử thanh toán</span>
                </Link>
                <Link
                  onClick={() => setOpenAccount(!openAccount)}
                  href="/user-feedbacks"
                  className="px-4 flex items-center gap-3 hover:bg-primary hover:text-white py-2.5 transition-colors duration-200 cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>Trung tâm hỗ trợ</span>
                </Link>
                <Link
                  onClick={() => setOpenAccount(!openAccount)}
                  href="/wallet"
                  className="px-4 flex items-center gap-3 hover:bg-primary hover:text-white py-2.5 transition-colors duration-200 cursor-pointer"
                >
                  <Wallet size={16} />
                  <span>Ví WorkHive</span>
                </Link>
                <Separator className="my-1" />
                <li
                  onClick={handleLogOut}
                  className="px-4 flex items-center gap-3 hover:bg-red-500 hover:text-white py-2.5 transition-colors duration-200 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </li>
              </motion.div>
            )}
          </div>
        )}
        <button
          className="md:hidden flex items-center justify-center p-2 bg-secondary/70 rounded-xl hover:bg-fourth transition-colors duration-300"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="absolute top-full left-0 w-full bg-primary text-white flex flex-col items-center gap-3 py-4 md:hidden shadow-lg border-t border-white/10"
        >
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`font-medium text-base py-2 px-4 rounded-lg ${
                pathname === item.path
                  ? "bg-secondary/40 text-white"
                  : "hover:bg-secondary/20"
              } transition-colors duration-200 w-4/5 text-center`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href={"/workspace"}
            className={`font-medium text-base py-2 px-4 rounded-lg ${
              pathname === "/workspace"
                ? "bg-secondary/40 text-white"
                : "hover:bg-secondary/20"
            } transition-colors duration-200 w-4/5 text-center`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Không gian
          </Link>
          <Link
            href={"/workspace-owner"}
            className={`font-medium text-base py-2 px-4 rounded-lg ${
              pathname === "/workspace-owner"
                ? "bg-secondary/40 text-white"
                : "hover:bg-secondary/20"
            } transition-colors duration-200 w-4/5 text-center`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Thương hiệu
          </Link>
          <Link
            href="/become-owner"
            className="font-medium w-4/5 mt-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <button className="text-base px-5 py-3 rounded-xl shadow-md hover:bg-fourth bg-secondary flex items-center justify-center gap-2 w-full transition-all duration-300">
              <BriefcaseBusiness size={18} />
              <span>Trở thành doanh nghiệp</span>
            </button>
          </Link>
        </motion.nav>
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
