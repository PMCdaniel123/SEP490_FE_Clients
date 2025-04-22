"use client";

import { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  Wallet,
  History,
  CreditCard,
  LockIcon,
  AlertTriangle,
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
import TransactionHistory from "@/components/transaction-history/transaction-history";
import HelpSection from "@/components/help-section/help-section";
import WithdrawalRequest from "@/components/withdrawal-request/withdrawal-request";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { toast } from "react-toastify";
import Loader from "@/components/loader/Loader";
import BankInformationForm from "@/components/bank-info-form/bank-info-form";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { BASE_URL } from "@/constants/environments";

const WalletPage = () => {
  const { customer } = useSelector((state: RootState) => state.auth);
  const [balance, setBalance] = useState("0");
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
      afterTransactionAmount: number;
    }[]
  >([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [bankInfo, setBankInfo] = useState<{
    bankName: string;
    bankNumber: string;
    bankAccountName: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("deposit");
  const [isWalletLocked, setIsWalletLocked] = useState(false);

  const predefinedAmounts = [100000, 200000, 500000, 1000000];

  useEffect(() => {
    if (!customer?.id) return;

    setIsLoading(true);
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/users/wallet/getamountwalletbyuserid?UserId=${customer.id}`
        );
        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải số dư ví.");
        }
        const data = await response.json();
        const formatted =
          data === null || data === undefined ? "0" : data.amount;
        setBalance(formatted);
      } catch {
        toast.error("Có lỗi xảy ra khi tải số dư ví.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTransactions = async () => {
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
          afterTransactionAmount: number;
        }

        const formattedTransactions = data.userTransactionHistoryDTOs.map(
          (tx: TransactionDTO, index: number) => {
            return {
              id: index + 1,
              type: tx.description.toLowerCase().includes("thanh toán")
                ? "Thanh toán"
                : tx.description.toLowerCase().includes("hoàn")
                ? "Hoàn tiền"
                : tx.description.toLowerCase().includes("rút")
                ? "Rút tiền"
                : "Nạp tiền",
              amount: tx.amount,
              date: tx.created_At,
              afterTransactionAmount: tx.afterTransactionAmount,
              description: tx.description,
              status:
                tx.status === "PAID"
                  ? "Hoàn thành"
                  : tx.status === "REFUND"
                  ? "Hoàn thành"
                  : tx.status === "Withdraw Success"
                  ? "Hoàn thành"
                  : "Thất bại",
            };
          }
        );
        setTransactions(formattedTransactions);
      } catch {
        toast.error("Có lỗi xảy ra khi tải lịch sử giao dịch.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
      }
    };

    const fetchBankInfo = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/users/wallet/getcustomerwalletinformation/${customer.id}`
        );
        if (!response.ok) {
          if (response.status !== 404) {
            throw new Error("Failed to fetch bank information");
          }
          setBankInfo(null);
          setIsWalletLocked(false); // Reset lock
          return;
        }
        const data = await response.json();
        setBankInfo({
          bankName: data.bankName || "",
          bankNumber: data.bankNumber || "",
          bankAccountName: data.bankAccountName || "",
        });

        if (data && data.isLock === 1) {
          setIsWalletLocked(true);
        } else {
          setIsWalletLocked(false);
        }
      } catch (error) {
        console.error("Error fetching bank info:", error);
        setBankInfo(null);
        setIsWalletLocked(false);
      }
    };

    fetchBalance();
    fetchTransactions();
    fetchBankInfo();
  }, [customer]);

  const handleDeposit = () => {
    if (rawAmount < 1000) {
      setError("Số tiền nạp phải lớn hơn 1000 đ.");
      toast.error("Số tiền nạp phải lớn hơn 1000 đ.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
      return;
    }

    setIsModalOpen(true);
  };

  const handleOpenWithdrawTab = () => {
    setActiveTab("withdraw");
    const withdrawTab = document.querySelector(
      '[value="withdraw"]'
    ) as HTMLButtonElement;
    if (withdrawTab) withdrawTab.click();
  };

  const handleOpenBankInfoTab = () => {
    setActiveTab("bankinfo");
    const bankInfoTab = document.querySelector(
      '[value="bankinfo"]'
    ) as HTMLButtonElement;
    if (bankInfoTab) bankInfoTab.click();
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
        autoClose: 1500,
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

  const handleWithdrawalSuccess = () => {
    // Refresh balance and wallet information after successful withdrawal request
    if (!customer?.id) return;

    const refreshWalletData = async () => {
      try {
        // Fetch balance
        const balanceResponse = await fetch(
          `${BASE_URL}/users/wallet/getamountwalletbyuserid?UserId=${customer.id}`
        );
        if (balanceResponse.ok) {
          const data = await balanceResponse.json();
          const formatted =
            data === null || data === undefined ? "0" : data.amount;
          setBalance(formatted);
        }

        // Fetch wallet information including lock status
        const walletInfoResponse = await fetch(
          `${BASE_URL}/users/wallet/getcustomerwalletinformation/${customer.id}`
        );
        if (walletInfoResponse.ok) {
          const data = await walletInfoResponse.json();
          setBankInfo({
            bankName: data.bankName || "",
            bankNumber: data.bankNumber || "",
            bankAccountName: data.bankAccountName || "",
          });

          // Update wallet lock status
          if (data && data.isLock === 1) {
            setIsWalletLocked(true);
          } else {
            setIsWalletLocked(false);
          }
        }
      } catch (error) {
        console.error("Error refreshing wallet data:", error);
      }
    };

    refreshWalletData();
  };

  const handleBankInfoUpdated = (updatedBankInfo: {
    bankName: string;
    bankNumber: string;
    bankAccountName: string;
  }) => {
    // Update the local state when bank info is updated
    setBankInfo(updatedBankInfo);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-white via-white to-gray-50 shadow-lg rounded-lg my-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Ví WorkHive</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <Loader />
        </div>
      ) : (
        <>
          <Card className="mb-6 bg-gradient-to-r from-primary via-primary to-secondary text-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                    <Wallet size={32} />
                  </div>
                  <div>
                    <p className="text-white/80">Số dư ví</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(Number(balance))}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-white text-primary hover:bg-white/90 shadow-md"
                    onClick={() => {
                      setActiveTab("deposit");
                      const depositTab = document.querySelector(
                        '[value="deposit"]'
                      ) as HTMLButtonElement;
                      if (depositTab) depositTab.click();
                    }}
                  >
                    <ArrowUp size={16} className="mr-1" />
                    Nạp tiền
                  </Button>
                  <Button
                    className="bg-secondary text-white hover:bg-secondary/90 shadow-md"
                    onClick={handleOpenWithdrawTab}
                  >
                    <ArrowDown size={16} className="mr-1" />
                    Rút tiền
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {isWalletLocked && (
            <div className="mb-6 p-4 bg-yellow-100 text-yellow-700 rounded-lg flex items-center gap-2">
              <AlertTriangle size={20} />
              <span>Ví của bạn đang bị khóa.</span>
            </div>
          )}

          <Tabs
            defaultValue="deposit"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-4 mb-4 bg-gray-100/70 rounded-xl overflow-hidden p-1">
              <TabsTrigger
                value="deposit"
                className="data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:bg-gradient-to-r from-primary to-secondary  data-[state=active]:shadow-sm rounded-lg transition-all duration-300 p-4"
              >
                Nạp tiền
              </TabsTrigger>
              <TabsTrigger
                value="withdraw"
                className="data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:bg-gradient-to-r from-primary to-secondary data-[state=active]:shadow-sm rounded-lg transition-all duration-300"
              >
                Rút tiền
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:bg-gradient-to-r from-primary to-secondary data-[state=active]:shadow-sm rounded-lg transition-all duration-300"
              >
                Lịch sử giao dịch
              </TabsTrigger>
              <TabsTrigger
                value="bankinfo"
                className="data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:bg-gradient-to-r from-primary to-secondary data-[state=active]:shadow-sm rounded-lg transition-all duration-300"
              >
                Thông tin ngân hàng
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="deposit"
              className="animate-in fade-in-50 duration-300"
            >
              <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-gray-100 overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <ArrowUp size={18} className="text-green-500" />
                    Nạp tiền vào ví
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {isWalletLocked ? (
                    <div className="py-8">
                      <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-3 bg-red-100 rounded-full">
                          <LockIcon size={36} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Ví của bạn đang bị khóa
                        </h3>
                        <p className="text-gray-600 max-w-md">
                          Ví của bạn hiện đang bị khóa do có yêu cầu rút tiền
                          đang xử lý. Bạn không thể nạp tiền trong thời gian
                          này.
                        </p>
                        <p className="text-gray-600 text-sm italic">
                          Vui lòng liên hệ hỗ trợ hoặc đợi đến khi yêu cầu rút
                          tiền của bạn được xử lý.
                        </p>
                        <Button
                          className="bg-primary hover:bg-primary/90 text-white mt-2"
                          onClick={() => setIsHelpModalOpen(true)}
                        >
                          Liên hệ hỗ trợ
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 space-y-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Chọn số tiền
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                          {predefinedAmounts.map((preAmount) => (
                            <Button
                              key={preAmount}
                              variant={
                                rawAmount === preAmount ? "default" : "outline"
                              }
                              className={`
                                ${
                                  rawAmount === preAmount
                                    ? "bg-primary text-white shadow-md transform scale-105"
                                    : "hover:border-primary/50 hover:text-primary"
                                }
                                transition-all duration-200 border-2 h-14
                              `}
                              onClick={() => selectPredefinedAmount(preAmount)}
                              disabled={isWalletLocked}
                            >
                              {formatCurrency(preAmount)}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Hoặc nhập số tiền khác
                        </p>
                        <div className="flex gap-3 items-stretch">
                          <div className="flex-1 relative">
                            <Input
                              type="text"
                              placeholder="Nhập số tiền"
                              value={amount}
                              onChange={handleAmountChange}
                              className="text-lg h-12 pr-16"
                              disabled={isWalletLocked}
                            />
                          </div>
                          <Button
                            className="min-w-[120px] h-12 bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow transition-all"
                            onClick={handleDeposit}
                            disabled={isWalletLocked}
                          >
                            <ArrowUp size={16} className="mr-2" />
                            Tiếp tục
                          </Button>
                        </div>
                        {error && (
                          <p className="text-red-500 mt-2 text-sm flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="12"></line>
                              <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="withdraw"
              className="animate-in fade-in-50 duration-300"
            >
              <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-gray-100 overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <ArrowDown size={18} className="text-red-500" />
                    Rút tiền
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <WithdrawalRequest
                    customerId={customer?.id ? Number(customer.id) : undefined}
                    balance={balance}
                    bankInfo={bankInfo}
                    onBankInfoTabClick={handleOpenBankInfoTab}
                    onWithdrawalSuccess={handleWithdrawalSuccess}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="history"
              className="animate-in fade-in-50 duration-300"
            >
              <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-gray-100 overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-xl text-primary flex items-center gap-2">
                      <History size={18} />
                      Lịch sử giao dịch
                    </span>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 border-green-500 text-green-700 bg-green-50"
                      >
                        <ArrowUp size={12} className="text-green-500" />
                        Nạp tiền
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 border-yellow-500 text-yellow-700 bg-yellow-50"
                      >
                        <ArrowUp size={12} className="text-yellow-500" />
                        Hoàn tiền
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 border-blue-500 text-blue-700 bg-blue-50"
                      >
                        <ArrowDown size={12} className="text-blue-500" />
                        Rút tiền
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 border-red-500 text-red-700 bg-red-50"
                      >
                        <ArrowDown size={12} className="text-red-500" />
                        Thanh toán
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {transactions.length > 0 ? (
                    <TransactionHistory
                      transactions={transactions}
                      formatCurrency={formatCurrency}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="bg-gray-100/50 p-4 rounded-full mb-4">
                        <Wallet size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500">Chưa có giao dịch nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="bankinfo"
              className="animate-in fade-in-50 duration-300"
            >
              <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-gray-100 overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <CreditCard size={18} />
                    Thông tin ngân hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <BankInformationForm
                    customerId={customer?.id ? Number(customer.id) : undefined}
                    onBankInfoUpdated={handleBankInfoUpdated}
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
              <DialogHeader className="border-b pb-4">
                <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Thanh toán qua chuyển khoản
                </DialogTitle>
              </DialogHeader>
              <div className="my-6 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-center font-medium">
                    Số tiền nạp:{" "}
                    <span className="text-primary font-bold text-lg">
                      {formatCurrency(rawAmount)}
                    </span>
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="flex flex-col items-center border-2 border-primary rounded-lg p-6 w-full max-w-[280px]">
                    <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                      <Image
                        src="/vietqr.png"
                        alt="Bank Transfer"
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                    <span className="font-medium text-center">
                      Chuyển khoản ngân hàng
                    </span>
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      Thanh toán an toàn và bảo mật
                    </span>
                  </div>
                </div>

                <div className="bg-third p-4 rounded-lg border border-secondary">
                  <p className="text-center text-sm text-primary flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-info"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                    Bạn sẽ được chuyển đến trang thanh toán an toàn sau khi xác
                    nhận
                  </p>
                </div>
              </div>
              <DialogFooter className="flex gap-2 border-t pt-4">
                <Button
                  className="flex-1 bg-primary text-white hover:bg-primary/90"
                  onClick={confirmDeposit}
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
