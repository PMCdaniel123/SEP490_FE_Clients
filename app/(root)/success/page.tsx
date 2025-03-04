"use client";

import { CheckCircle} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <div className="flex  items-center justify-center min-h-screen bg-gray-100 px-8">
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
            className="w-24 h-24 flex items-center justify-center rounded-full bg-green-100"
          >
            <CheckCircle size={56} className="text-green-500" />
          </motion.div>
        </div>
        <h2 className="text-3xl font-semibold text-gray-900">THÀNH CÔNG</h2>
        <p className="text-gray-500 mt-4">Giao dịch của bạn đã được ghi nhận.</p>
        <div className="mt-8">
        <Link href="/">
          <Button  className=" text-white px-8 py-4 rounded-lg text-base">
            TRỞ VỀ
          </Button>
            </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;