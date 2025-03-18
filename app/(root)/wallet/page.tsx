"use client";

import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import TransactionHistory from "@/components/transaction-history/transaction-history";
import HelpSection from "@/components/help-section/help-section";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { toast } from "react-toastify";
import Loader from "@/components/loader/Loader";


const WalletPage = () => {
  const { customer } = useSelector((state: RootState) => state.auth);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [rawAmount, setRawAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<
    {
      id: number;
      type: string;
      amount: number;
      date: string;
      paymentMethod: string;
      description: string;
      status: string;
    }[]
  >([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!customer?.id) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://localhost:5050/users/wallet/getamountwalletbyuserid?UserId=${customer.id}`
        );
        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải số dư ví.");
        }
        const data = await response.json();
        setBalance(data.amount);
      } catch {
        toast.error("Có lỗi xảy ra khi tải số dư ví.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTransactions = async () => {
      if (!customer?.id) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://localhost:5050/users/wallet/getalltransactionhistorybyuserid/${customer.id}`
        );
        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải lịch sử giao dịch.");
        }
        const data = await response.json();
        interface TransactionDTO {
          amount: number;
          created_At: string;
          description: string;
          status: string;
        }

        const formattedTransactions = data.userTransactionHistoryDTOs.map(
          (tx: TransactionDTO, index: number) => {
            return {
              id: index + 1,
              type: tx.amount > 0 ? "Nạp tiền" : "Thanh toán",
              amount: tx.amount,
              date: tx.created_At,
              paymentMethod: "Chuyển khoản ngân hàng",
              description: tx.description,
              status: tx.status === "PAID" ? "Hoàn thành" : "Thất bại",
            };
          }
        );
        setTransactions(formattedTransactions);
      } catch {
        toast.error("Có lỗi xảy ra khi tải lịch sử giao dịch.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
    fetchTransactions();
  }, [customer]);

  const handleDeposit = () => {
    if (rawAmount < 1000) {
      setError("Số tiền nạp phải lớn hơn 1000 đ.");
      toast.error("Số tiền nạp phải lớn hơn 1000 đ.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
      return;
    }

    setIsModalOpen(true);
  };

  const confirmDeposit = async () => {
    if (!customer?.id) return;

    try {
      const response = await fetch(
        "https://localhost:5050/users/wallet/createrequestdeposit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: customer.id,
            amount: rawAmount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi nạp tiền.");
      }

      const data = await response.json();
      localStorage.setItem("customerWalletId", data.customerWalletId);
      localStorage.setItem("orderCode", data.orderCode);
      localStorage.setItem("amount", data.amount);
      window.location.href = data.checkoutUrl;
    } catch {
      toast.error("Có lỗi xảy ra khi nạp tiền.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString("vi-VN");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = Number(value);
    setRawAmount(numericValue);
    setAmount(formatNumber(numericValue));

    if (numericValue < 1000) {
      setError("Số tiền nạp phải lớn hơn 1000 đ.");
    } else {
      setError("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8 border">
      <h1 className="text-2xl font-bold mb-4">Ví WorkHive</h1>
  
      {isLoading ? (
        <div className="flex justify-center items-center">
       <Loader />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <CreditCard size={32} className="text-primary" />
              <div>
                <p className="text-gray-600">Số dư ví</p>
                <p className="text-xl font-semibold">{formatCurrency(balance)}</p>
              </div>
            </div>
          </div>
  
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Nạp tiền</h2>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Nhập số tiền"
                value={amount}
                onChange={handleAmountChange}
              />
              <Button className="text-white" onClick={handleDeposit}>
                Nạp
              </Button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <TransactionHistory
            transactions={transactions}
            formatCurrency={formatCurrency}
          />
          <HelpSection
            isHelpModalOpen={isHelpModalOpen}
            setIsHelpModalOpen={setIsHelpModalOpen}
          />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-primary">
                  Chọn phương thức thanh toán
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 my-8">
                <Button
                  variant={
                    selectedPaymentMethod === "Chuyển khoản ngân hàng"
                      ? "default"
                      : "outline"
                  }
                  className={`flex flex-col items-center justify-center gap-2 py-8 ${
                    selectedPaymentMethod === "Chuyển khoản ngân hàng"
                      ? "text-white"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedPaymentMethod("Chuyển khoản ngân hàng")
                  }
                >
                  <Image
                    src="/vietqr.png"
                    alt="Bank Transfer"
                    width={60}
                    height={60}
                  />
                  Chuyển khoản ngân hàng
                </Button>
                <Button
                  variant={
                    selectedPaymentMethod === "Ví điện tử" ? "default" : "outline"
                  }
                  className={`flex flex-col items-center justify-center py-8 ${
                    selectedPaymentMethod === "Ví điện tử" ? "text-white" : ""
                  }`}
                  onClick={() => setSelectedPaymentMethod("Ví điện tử")}
                >
                  <Image
                    src="/zalopay.png"
                    alt="E-Wallet"
                    width={40}
                    height={20}
                    className="object-cover"
                  />
                  Ví điện tử
                </Button>
              </div>
              <DialogFooter>
                <Button className="text-white" onClick={confirmDeposit}>
                  Xác nhận
                </Button>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default WalletPage;