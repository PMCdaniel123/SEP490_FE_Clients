"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Wallet } from "lucide-react";
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

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { BASE_URL } from "@/constants/environments";

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

  const predefinedAmounts = [100000, 200000, 500000, 1000000];

  useEffect(() => {
    const fetchBalance = async () => {
      if (!customer?.id) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/users/wallet/getamountwalletbyuserid?UserId=${customer.id}`
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
          `${BASE_URL}/users/wallet/getalltransactionhistorybyuserid/${customer.id}`
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
              type: tx.description.toLowerCase().includes("thanh toán")
                ? "Thanh toán"
                : tx.description.toLowerCase().includes("hoàn")
                ? "Hoàn tiền"
                : "Nạp tiền",
              amount: tx.amount,
              date: tx.created_At,
              paymentMethod: "Chuyển khoản ngân hàng",
              description: tx.description,
              status:
                tx.status === "PAID"
                  ? "Hoàn thành"
                  : tx.status === "Active"
                  ? "Hoàn tiền"
                  : "Thất bại",
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
        `${BASE_URL}/users/wallet/createrequestdeposit`,
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

  const selectPredefinedAmount = (value: number) => {
    setRawAmount(value);
    setAmount(formatNumber(value));
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Ví WorkHive</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <Loader />
        </div>
      ) : (
        <>
          <Card className="mb-6 bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet size={40} />
                  <div>
                    <p className="text-white/80">Số dư ví</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(balance)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-white text-primary hover:bg-white/90"
                    onClick={handleDeposit}
                  >
                    <ArrowUp size={16} className="mr-1" />
                    Nạp tiền
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="deposit" className="mb-6">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="deposit">Nạp tiền</TabsTrigger>
              <TabsTrigger value="history">Lịch sử giao dịch</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit">
              <Card>
                <CardHeader>
                  <CardTitle>Nạp tiền vào ví</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Chọn số tiền</p>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {predefinedAmounts.map((preAmount) => (
                        <Button
                          key={preAmount}
                          variant="outline"
                          className={`${
                            rawAmount === preAmount
                              ? "bg-primary text-white"
                              : ""
                          }`}
                          onClick={() => selectPredefinedAmount(preAmount)}
                        >
                          {formatCurrency(preAmount)}
                        </Button>
                      ))}
                    </div>

                    <p className="text-sm text-gray-500 mb-2">
                      Hoặc nhập số tiền khác
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Nhập số tiền"
                        value={amount}
                        onChange={handleAmountChange}
                        className="text-lg"
                      />
                      <Button
                        className="min-w-[100px] text-white"
                        onClick={handleDeposit}
                      >
                        Tiếp tục
                      </Button>
                    </div>
                    {error && (
                      <p className="text-red-500 mt-2 text-sm">{error}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Lịch sử giao dịch</span>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <ArrowUp size={12} className="text-green-500" />
                        Nạp tiền
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <ArrowUp size={12} className="text-yellow-500" />
                        Hoàn tiền
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <ArrowDown size={12} className="text-red-500" />
                        Thanh toán
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionHistory
                    transactions={transactions}
                    formatCurrency={formatCurrency}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <HelpSection
            isHelpModalOpen={isHelpModalOpen}
            setIsHelpModalOpen={setIsHelpModalOpen}
          />

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-primary">
                  Chọn phương thức thanh toán
                </DialogTitle>
              </DialogHeader>
              <div className="my-6">
                <p className="text-center mb-4 font-medium">
                  Số tiền nạp:{" "}
                  <span className="text-primary font-bold">
                    {formatCurrency(rawAmount)}
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={
                      selectedPaymentMethod === "Chuyển khoản ngân hàng"
                        ? "default"
                        : "outline"
                    }
                    className={`flex flex-col items-center justify-center gap-2 p-6 h-auto ${
                      selectedPaymentMethod === "Chuyển khoản ngân hàng"
                        ? "border-2 border-primary"
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
                    <span className="text-sm">Chuyển khoản ngân hàng</span>
                  </Button>
                  <Button
                    variant={
                      selectedPaymentMethod === "Ví điện tử"
                        ? "default"
                        : "outline"
                    }
                    className={`flex flex-col items-center justify-center gap-2 p-6 h-auto ${
                      selectedPaymentMethod === "Ví điện tử"
                        ? "border-2 border-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedPaymentMethod("Ví điện tử")}
                  >
                    <Image
                      src="/zalopay.png"
                      alt="E-Wallet"
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                    <span className="text-sm">Ví điện tử</span>
                  </Button>
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={confirmDeposit}
                  disabled={!selectedPaymentMethod}
                >
                  Xác nhận thanh toán
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
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
