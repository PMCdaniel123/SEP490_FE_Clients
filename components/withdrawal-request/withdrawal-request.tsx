"use client";

import { useState, useEffect } from "react";
import { ArrowDown, DollarSign, CreditCard, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { Modal } from "antd";
import { BASE_URL } from "@/constants/environments";

interface WithdrawalRequestProps {
  customerId?: number;
  balance: string;
  bankInfo: {
    bankName: string;
    bankNumber: string;
    bankAccountName: string;
  } | null;
  onBankInfoTabClick: () => void;
  onWithdrawalSuccess: () => void;
}

const WithdrawalRequest = ({
  customerId,
  balance,
  bankInfo,
  onBankInfoTabClick,
  onWithdrawalSuccess,
}: WithdrawalRequestProps) => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawTitle, setWithdrawTitle] = useState("Yêu cầu rút tiền");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Removed unused localBankInfo state and its associated useEffect

  useEffect(() => {
    if (!customerId) {
      setIsLoading(false);
      return;
    }

    const fetchWithdrawalRequests = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/users/customerwithdrawalrequests/${customerId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch withdrawal requests");
        }
        const data = await response.json();
        if (data && data.customerWithdrawalRequests) {
          const sortedRequests = [...data.customerWithdrawalRequests].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setWithdrawalRequests(sortedRequests);
        }
      } catch (error) {
        console.error("Error fetching withdrawal requests:", error);
        toast.error("Không thể tải lịch sử yêu cầu rút tiền", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawalRequests();
  }, [customerId]);

  // Make fetchWithdrawalRequests available outside the useEffect
  const fetchWithdrawalRequests = async () => {
    if (!customerId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/users/customerwithdrawalrequests/${customerId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch withdrawal requests");
      }
      const data = await response.json();
      if (data && data.customerWithdrawalRequests) {
        const sortedRequests = [...data.customerWithdrawalRequests].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setWithdrawalRequests(sortedRequests);
      }
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      toast.error("Không thể tải lịch sử yêu cầu rút tiền", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handling request check
  const hasActiveHandlingRequest = () => {
    if (!withdrawalRequests.length) return false;
    const handlingRequests = withdrawalRequests.filter(
      (request) => request.status === "Handling"
    );

    if (handlingRequests.length === 0) return false;
    const now = new Date();
    return handlingRequests.some((request) => {
      const createdAt = new Date(request.createdAt);
      const hoursDifference =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      return hoursDifference < 24;
    });
  };

  const handleWithdraw = () => {
    if (Number(balance) <= 0) {
      toast.error("Số dư của bạn phải lớn hơn 0 để có thể rút tiền", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
      return;
    }

    if (
      !bankInfo ||
      !bankInfo.bankName ||
      !bankInfo.bankNumber ||
      !bankInfo.bankAccountName
    ) {
      toast.error("Vui lòng cập nhật thông tin ngân hàng trước khi rút tiền", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
      return;
    }

    if (hasActiveHandlingRequest()) {
      toast.error(
        "Bạn đã có một yêu cầu rút tiền đang xử lý. Vui lòng chờ sau 24 giờ hoặc đợi yêu cầu hiện tại được hoàn thành",
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        }
      );
      return;
    }

    setIsWithdrawModalOpen(true);
  };

  const confirmWithdraw = async () => {
    if (!customerId) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/customer-withdrawal-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: withdrawTitle,
          description: withdrawDescription || "Yêu cầu rút tiền",
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi gửi yêu cầu rút tiền.");
      }

      toast.success("Yêu cầu rút tiền đã được gửi thành công", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });

      // Update withdrawal requests list using our extracted function
      await fetchWithdrawalRequests();

      // Close the modal and trigger callbacks
      setIsWithdrawModalOpen(false);
      onWithdrawalSuccess();
    } catch {
      toast.error("Có lỗi xảy ra khi gửi yêu cầu rút tiền.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {!bankInfo || !bankInfo.bankName ? (
        <div className="py-6 text-center">
          <div className="mb-4 p-3 rounded-full bg-gray-100 inline-block">
            <CreditCard className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            Chưa có thông tin ngân hàng
          </h3>
          <p className="text-gray-500 mb-4">
            Vui lòng cập nhật thông tin ngân hàng trước khi rút tiền
          </p>
          <Button
            onClick={onBankInfoTabClick}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Cập nhật thông tin ngân hàng
          </Button>
        </div>
      ) : withdrawalRequests.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Yêu cầu rút tiền</h3>
            <Button
              onClick={handleWithdraw}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <DollarSign size={16} className="mr-1" />
              Tạo yêu cầu rút tiền mới
            </Button>
          </div>

          <div className="space-y-3">
            {withdrawalRequests.map((request) => (
              <div
                key={request.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{request.title}</h4>
                  <Badge
                    className={`
                      ${
                        request.status === "Handling" &&
                        "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }
                      ${
                        request.status === "Success" &&
                        "bg-green-100 text-green-800 border-green-200"
                      }
                      ${
                        request.status === "Fail" &&
                        "bg-red-100 text-red-800 border-red-200"
                      }
                    `}
                  >
                    {request.status === "Handling"
                      ? "Đang xử lý"
                      : request.status === "Success"
                      ? "Đã hoàn thành"
                      : request.status === "Fail"
                      ? "Đã từ chối"
                      : request.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {request.description}
                </p>
                <div className="text-sm text-gray-500">
                  Ngày tạo: {formatDate(request.createdAt)}
                </div>
                {request.managerResponse &&
                  request.managerResponse !== "N/A" &&
                  request.status === "Fail" && (
                    <div className="mt-2 bg-gray-50 p-2 rounded border border-gray-100">
                      <p className="text-xs text-gray-400">Phản hồi:</p>
                      <p className="text-sm">{request.managerResponse}</p>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-secondary text-white">
                <DollarSign size={18} />
              </div>
              <div>
                <h3 className="font-medium mb-1">LƯU Ý:</h3>
                <p className="text-sm text-gray-600">
                  Tạo yêu cầu rút tiền để chuyển tiền từ ví WorkHive về tài
                  khoản ngân hàng của bạn. Yêu cầu sẽ được nhân viên xử lý trong
                  vòng 24 giờ làm việc.
                </p>
                <p className="text-sm text-gray-600 pt-4">
                  Trong quá trình xử lý yêu cầu, bạn không thể thực hiện các
                  giao dịch nạp tiền hoặc hủy đặt chỗ.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleWithdraw}
              className="bg-primary hover:bg-primary/90 text-white px-6"
              size="lg"
            >
              <DollarSign size={18} className="mr-2" />
              Tạo yêu cầu rút tiền
            </Button>
          </div>

          {bankInfo && (
            <div className="border-t border-gray-100 mt-6 pt-6">
              <div className="text-sm space-y-3">
                <h4 className="font-medium">Thông tin tài khoản:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-500">Ngân hàng:</p>
                    <p className="font-medium">{bankInfo.bankName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Số tài khoản:</p>
                    <p className="font-medium">{bankInfo.bankNumber}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Chủ tài khoản:</p>
                  <p className="font-medium">{bankInfo.bankAccountName}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal
        title={
          <div className="text-xl font-bold text-primary flex items-center gap-2">
            <ArrowDown className="h-5 w-5" />
            Yêu cầu rút tiền
          </div>
        }
        open={isWithdrawModalOpen}
        onCancel={() => setIsWithdrawModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            variant="outline"
            onClick={() => setIsWithdrawModalOpen(false)}
            className="flex-1 m-4 px-6"
            disabled={isSubmitting}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            className="flex-1 bg-primary text-white hover:bg-primary/90"
            onClick={confirmWithdraw}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang xử lý...
              </>
            ) : (
              "Gửi yêu cầu rút tiền"
            )}
          </Button>,
        ]}
        width={500}
      >
        <div className="my-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-center font-medium">
              Số dư hiện tại:{" "}
              <span className="text-primary font-bold text-lg">
                {formatCurrency(Number(balance))}
              </span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="withdrawTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tiêu đề
              </label>
              <Input
                id="withdrawTitle"
                value={withdrawTitle}
                onChange={(e) => setWithdrawTitle(e.target.value)}
                placeholder="Tiêu đề yêu cầu rút tiền"
                className="w-full"
              />
            </div>
            <div>
              <label
                htmlFor="withdrawDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mô tả (không bắt buộc)
              </label>
              <Textarea
                id="withdrawDescription"
                value={withdrawDescription}
                onChange={(e) => setWithdrawDescription(e.target.value)}
                placeholder="Mô tả chi tiết (nếu cần)"
                className="w-full"
                rows={3}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm mb-3">Thông tin ngân hàng:</p>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ngân hàng:</span>
                <span className="font-medium">{bankInfo?.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số tài khoản:</span>
                <span className="font-medium">{bankInfo?.bankNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Chủ tài khoản:</span>
                <span className="font-medium">{bankInfo?.bankAccountName}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <p className="text-center text-sm text-yellow-700 flex items-center justify-center gap-2">
              <InfoIcon className="h-5 w-5" />
              Yêu cầu rút tiền của bạn sẽ được xử lý trong vòng 24 giờ làm việc
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WithdrawalRequest;
