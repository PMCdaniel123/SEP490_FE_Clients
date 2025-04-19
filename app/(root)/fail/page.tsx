"use client";

import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

const FailComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-10 text-center max-w-lg w-full"
      >
        <div className="flex justify-center items-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="w-24 h-24 flex items-center justify-center rounded-full bg-red-100"
          >
            <XCircle size={56} className="text-red-500" />
          </motion.div>
        </div>
        <h2 className="text-3xl font-semibold text-gray-900">THẤT BẠI</h2>
        <p className="text-gray-500 mt-4">
          Giao dịch không thành công <br />
          Hãy thử lại hoặc chọn phương thức thanh toán khác.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button className=" text-white px-8 py-4 rounded-lg text-base">
              TRỞ VỀ
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailComponent />
    </Suspense>
  );
}
