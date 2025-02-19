"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <div className="relative w-full max-w-md">
        <Image
          src="/404.png"
          alt="404 Not Found"
          width={500}
          height={300}
          priority
          className="mx-auto"
        />
      </div>
      <p className="text-gray-600 mt-4 text-lg">
        Không tìm thấy trang bạn đã truy cập. Bạn có thể quay lại trang chủ.
      </p>

      <Link href="/">
        <Button className="mt-6 bg-[#8B5E3C] hover:bg-[#6E462C] text-white px-6 py-3 rounded-lg">
          Trang chủ
        </Button>
      </Link>
    </div>
  );
}
