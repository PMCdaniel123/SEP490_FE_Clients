"use client";

import { useState } from "react";
import { Mail, Lock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const OwnerForm = ({ onClose }: { onClose: () => void }) => {
  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Logging in with", credentials, password);
    onClose();
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url(./owner.png)",
      }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Đăng nhập <br /> tài khoản doanh nghiệp
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              {credentials.includes("@") ? (
                <Mail size={20} />
              ) : (
                <Phone size={20} />
              )}
            </span>
            <Input
              type="text"
              placeholder="Email hoặc số điện thoại"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Lock size={20} />
            </span>
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Quên mật khẩu
            </Link>
          </div>
          <Button type="submit" className="w-full text-white">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OwnerForm;
