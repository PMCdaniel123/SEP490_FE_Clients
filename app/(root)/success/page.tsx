"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const SuccessPage = () => {
  const order =
    typeof window !== "undefined" ? localStorage.getItem("order") : null;
  const searchParams = useSearchParams();


  const updateWalletAmount = async (
    customerWalletId: string,
    orderCode: string,
    amount: string
  ) => {
    try {
      console.log("Calling updateWalletAmount with:", {
        customerWalletId,
        orderCode,
        amount,
      });

      const updateResponse = await fetch(
        "https://localhost:5050/users/wallet/updatewalletamount",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerWalletId,
            orderCode,
            amount,
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Có lỗi xảy ra khi cập nhật số dư ví.");
      }

      await updateResponse.json();

      toast.success("Nạp tiền thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });

      localStorage.removeItem("customerWalletId");
      localStorage.removeItem("orderCode");
      localStorage.removeItem("amount");

    } catch (error) {
      console.error("Error updating wallet amount:", error);
      toast.error("Có lỗi xảy ra khi cập nhật số dư ví.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (order !== null) {
      const parsedOrder = JSON.parse(order);
      const updateWorkspaceTimeStatus = async () => {
        try {
          const response = await fetch(
            `https://localhost:5050/users/booking/updatetimestatus`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                bookingId: parsedOrder.bookingId,
                orderCode: parsedOrder.orderCode,
              }),
            }
          );
          const data = await response.json();
          console.log(data);
          localStorage.removeItem("order");
        } catch (error) {
          console.error("Error updating workspace time status:", error);
        }
      };

      updateWorkspaceTimeStatus();
    }

    const status = searchParams?.get("status");
    if (status === "PAID") {
      const customerWalletId = localStorage.getItem("customerWalletId");
      const orderCode = localStorage.getItem("orderCode");
      const amount = localStorage.getItem("amount");

      console.log("Retrieved from localStorage:", {
        customerWalletId,
        orderCode,
        amount,
      });

      if (customerWalletId && orderCode && amount) {
        updateWalletAmount(customerWalletId, orderCode, amount);
      }
    }
  }, [order, searchParams]);

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
        <p className="text-gray-500 mt-4">
          Giao dịch của bạn đã được ghi nhận.
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

export default SuccessPage;