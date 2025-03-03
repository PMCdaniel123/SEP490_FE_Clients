"use client";

import { useState } from "react";
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

const WalletPage = () => {
  const [balance, setBalance] = useState(100000);
  const [amount, setAmount] = useState("");
  const [rawAmount, setRawAmount] = useState(0);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "Nạp tiền",
      amount: 500000,
      date: "2024-02-25",
      paymentMethod: "Credit Card",
      description: "Nạp tiền vào ví",
      status: "Hoàn thành",
    },
    {
      id: 2,
      type: "Thanh toán",
      amount: 300000,
      date: "2024-02-24",
      paymentMethod: "Credit Card",
      description: "Thanh toán dịch vụ",
      status: "Hoàn thành",
    },
    {
      id: 3,
      type: "Thanh toán",
      amount: 150000,
      date: "2024-02-23",
      paymentMethod: "Credit Card",
      description: "Thanh toán dịch vụ",
      status: "Hoàn thành",
    },
  ]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleDeposit = () => {
    setIsModalOpen(true);
  };

  const confirmDeposit = () => {
    setBalance(balance + rawAmount);
    setTransactions([
      {
        id: transactions.length + 1,
        type: "Nạp tiền",
        amount: rawAmount,
        date: new Date().toISOString().split("T")[0],
        paymentMethod: selectedPaymentMethod,
        description: "Nạp tiền vào ví",
        status: "Hoàn thành",
      },
      ...transactions,
    ]);
    setAmount("");
    setRawAmount(0);
    setError("");
    setIsModalOpen(false);
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
    setRawAmount(Number(value));
    setAmount(formatNumber(Number(value)));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8 border">
      <h1 className="text-2xl font-bold mb-4">Ví WorkHive</h1>

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
              onClick={() => setSelectedPaymentMethod("Chuyển khoản ngân hàng")}
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
    </div>
  );
};

export default WalletPage;
