"use client";

import { useState } from "react";
import {
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  Phone,
  Mail,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
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

      <div>
        <h2 className="text-lg font-semibold mb-2">Lịch sử giao dịch</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          {transactions.length > 0 ? (
            <ul>
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex flex-col p-2 border-b last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {tx.type === "Nạp tiền" ? (
                        <ArrowDownCircle className="text-green-500" />
                      ) : (
                        <ArrowUpCircle className="text-red-500" />
                      )}
                      <span>{tx.type}</span>
                    </div>
                    <span>{formatCurrency(tx.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-500 text-sm">{tx.date}</span>
                    <span className="text-gray-500 text-sm">
                      {tx.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-500 text-sm">
                      {tx.description}
                    </span>
                    <span
                      className={`text-sm ${
                        tx.status === "Hoàn thành"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Chưa có giao dịch nào.</p>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 flex justify-end">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsHelpModalOpen(true)}
        >
          <HelpCircle size={24} className="text-primary" />
          <span>Hỗ trợ khách hàng</span>
        </Button>
      </div>

      <Dialog open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hỗ trợ khách hàng</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <Phone size={24} className="text-primary" />
              <span className="text-gray-600">Điện thoại: 0123-456-789</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={24} className="text-primary" />
              <span className="text-gray-600">Email: support@workhive.com</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHelpModalOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Button
              variant={
                selectedPaymentMethod === "Bank Transfer"
                  ? "default"
                  : "outline"
              }
              className={
                selectedPaymentMethod === "Bank Transfer" ? "text-white" : ""
              }
              onClick={() => setSelectedPaymentMethod("Bank Transfer")}
            >
              Chuyển khoản ngân hàng
            </Button>
            <Button
              variant={
                selectedPaymentMethod === "E-Wallet" ? "default" : "outline"
              }
              className={
                selectedPaymentMethod === "E-Wallet" ? "text-white" : ""
              }
              onClick={() => setSelectedPaymentMethod("E-Wallet")}
            >
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
