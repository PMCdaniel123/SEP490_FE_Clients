"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { BASE_URL } from "@/constants/environments";
import Loader from "@/components/loader/Loader";

interface BankInformationFormProps {
  customerId?: number;
}

interface BankInfo {
  bankName: string;
  bankNumber: string;
  bankAccountName: string;
}

const BankInformationForm = ({ customerId }: BankInformationFormProps) => {
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    bankName: "",
    bankNumber: "",
    bankAccountName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!customerId) return;

    const fetchBankInfo = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/users/wallet/getcustomerwalletinformation?customerId=${customerId}`
        );

        if (!response.ok) {
          if (response.status !== 404) {
            throw new Error("Failed to fetch bank information");
          }
          // If 404, we just continue with empty state (user has no bank info yet)
          return;
        }

        const data = await response.json();
        if (data) {
          setBankInfo({
            bankName: data.bankName || "",
            bankNumber: data.bankNumber || "",
            bankAccountName: data.bankAccountName || "",
          });
        }
      } catch (error) {
        console.error("Error fetching bank info:", error);
        toast.error("Có lỗi xảy ra khi tải thông tin ngân hàng", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankInfo();
  }, [customerId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId) {
      toast.error("Bạn cần đăng nhập để cập nhật thông tin ngân hàng", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Simple validation
    if (
      !bankInfo.bankName ||
      !bankInfo.bankNumber ||
      !bankInfo.bankAccountName
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `${BASE_URL}/users/wallet/updatecustomerwalletinformation`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId,
            bankName: bankInfo.bankName,
            bankNumber: bankInfo.bankNumber,
            bankAccountName: bankInfo.bankAccountName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update bank information");
      }

      toast.success("Cập nhật thông tin ngân hàng thành công", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error updating bank info:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin ngân hàng", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="bankName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tên ngân hàng
          </label>
          <Input
            id="bankName"
            name="bankName"
            value={bankInfo.bankName}
            onChange={handleInputChange}
            placeholder="VD: Techcombank, Vietcombank, MB Bank..."
            className="w-full"
            required
          />
        </div>

        <div>
          <label
            htmlFor="bankNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Số tài khoản
          </label>
          <Input
            id="bankNumber"
            name="bankNumber"
            value={bankInfo.bankNumber}
            onChange={handleInputChange}
            placeholder="Nhập số tài khoản ngân hàng"
            className="w-full"
            required
          />
        </div>

        <div>
          <label
            htmlFor="bankAccountName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tên chủ tài khoản
          </label>
          <Input
            id="bankAccountName"
            name="bankAccountName"
            value={bankInfo.bankAccountName}
            onChange={handleInputChange}
            placeholder="Tên chủ tài khoản ngân hàng"
            className="w-full"
            required
          />
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang lưu...
            </span>
          ) : (
            "Cập nhật thông tin ngân hàng"
          )}
        </Button>
      </div>

      <div className="bg-secondary border border-third rounded-lg p-4 text-sm text-white mt-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="font-medium mb-1">Thông tin quan trọng</h3>
            <p>
              Thông tin ngân hàng của bạn sẽ được sử dụng trong các trường hợp
              rút tiền về Tài khoản ngân hàng. Vui lòng đảm bảo thông tin chính
              xác.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BankInformationForm;
