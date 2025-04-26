"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LockIcon, HomeIcon } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        <div className="md:w-2/5 relative">
          <div className="absolute inset-0 w-full h-full">
            <div className="relative w-full h-full">
              <Image
                src="/become-owner.jpg"
                alt="Workspace"
                fill
                style={{ objectFit: "cover" }}
                priority
                className="brightness-[0.6]"
              />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-primary to-black/50 z-10"></div>
          <div className="relative z-20 h-full flex flex-col items-center justify-center p-6 text-white">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/30">
              <LockIcon size={48} className="text-white" />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">
              Khu vực hạn chế
            </h2>
            <p className="text-white/80 text-center">
              Vui lòng xác thực tài khoản của bạn để truy cập khu vực này
            </p>
          </div>
        </div>

        <div className="md:w-3/5 p-8 md:p-12">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-3">
                Bạn không có quyền truy cập trang này
              </h1>
              <div className="h-1 w-20 bg-primary rounded-full"></div>
            </div>

            <p className="text-gray-600">
              Có vẻ như bạn đang cố gắng truy cập một trang mà bạn không được
              phép xem. Điều này có thể xảy ra vì một trong những lý do sau:
            </p>

            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Bạn cần đăng nhập để xem nội dung này</li>
              <li>Tài khoản của bạn không có quyền truy cập trang này</li>
              <li>Đường dẫn URL không chính xác</li>
            </ul>

            <div className="pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/">
                  <Button
                    variant="outline"
                    className="bg-[#8B5E3C] hover:bg-[#6E462C] hover:text-white text-white px-6 py-3 w-full sm:w-auto flex items-center justify-center gap-2"
                  >
                    <HomeIcon size={18} />
                    Về trang chủ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
