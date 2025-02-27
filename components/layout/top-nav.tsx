"use client";

import {
  Banknote,
  ChevronsUpDown,
  LockKeyhole,
  LogOut,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import OwnerNotification from "../owner-notification/owner-notification";

function TopNav() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-between w-[590px] bg-white rounded-xl py-2 px-4">
        <p className="font-bold text-primary">Số tiền trên hệ thống:</p>
        <p className="bg-primary text-white text-sm px-3 py-1 rounded-lg flex items-center gap-2">
          <Banknote />
          1,000,000 VND
        </p>
      </div>
      <div className="flex items-center justify-end w-full mb-4 gap-4">
        <OwnerNotification />
        <div ref={dropdownRef} className="relative">
          <div
            className="group flex items-center justify-center bg-white rounded-xl py-2 px-4 gap-4 group hover:bg-primary hover:text-white cursor-pointer transition-colors duration-200"
            onClick={() => setOpen(!open)}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full border group-hover:bg-white"
            />
            <div className="flex flex-col justify-center items-start">
              <p className="text-sm font-semibold">WorkHive Owners</p>
              <p className="text-sm">owners@gmail.com</p>
            </div>
            <ChevronsUpDown size={20} />
          </div>
          {open && (
            <ul className="absolute top-full right-0 z-10 mt-2 w-auto gap-3 rounded-xl bg-white shadow-xl pb-4">
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
              <li className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer">
                <Settings size={16} /> <span>Sửa thông tin</span>
              </li>
              <li className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer">
                <LockKeyhole size={16} /> <span>Đổi mật khẩu</span>
              </li>
              <li className="px-4 flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer">
                <LogOut size={16} /> <span>Đăng xuất</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopNav;
