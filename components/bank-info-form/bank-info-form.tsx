"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { BASE_URL } from "@/constants/environments";
import Loader from "@/components/loader/Loader";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BankInformationFormProps {
  customerId?: number;
}

interface BankInfo {
  bankName: string;
  bankNumber: string;
  bankAccountName: string;
}

interface Bank {
  id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string;
}

const BankInformationForm = ({ customerId }: BankInformationFormProps) => {
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    bankName: "",
    bankNumber: "",
    bankAccountName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>([]);
  const [banksFetching, setBanksFetching] = useState(false);
  const [bankSearchValue, setBankSearchValue] = useState("");
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch banks from API
    const fetchBanks = async () => {
      setBanksFetching(true);
      try {
        const response = await fetch("https://api.vietqr.io/v2/banks");
        if (!response.ok) {
          throw new Error("Failed to fetch banks");
        }

        const data = await response.json();
        if (data && data.data) {
          setBanks(data.data);
          setFilteredBanks(data.data);
        }
      } catch (error) {
        console.error("Error fetching banks:", error);
        toast.error("Có lỗi xảy ra khi tải danh sách ngân hàng", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setBanksFetching(false);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    if (!customerId) return;

    const fetchBankInfo = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/users/wallet/getcustomerwalletinformation/${customerId}`
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

  useEffect(() => {
    if (bankSearchValue.trim() === "") {
      setFilteredBanks(banks);
    } else {
      const searchTerm = bankSearchValue.toLowerCase().trim();
      const filtered = banks.filter(
        (bank) =>
          bank.name.toLowerCase().includes(searchTerm) ||
          bank.shortName.toLowerCase().includes(searchTerm) ||
          (bank.code && bank.code.toLowerCase().includes(searchTerm))
      );
      setFilteredBanks(filtered);
    }
  }, [bankSearchValue, banks]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankChange = (value: string) => {
    setBankInfo((prev) => ({
      ...prev,
      bankName: value,
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
          {banksFetching ? (
            <div className="w-full h-10 bg-gray-100 rounded animate-pulse flex items-center justify-center">
              <div className="text-xs text-gray-500">
                Đang tải danh sách ngân hàng...
              </div>
            </div>
          ) : (
            <div className="relative">
              <Select
                onValueChange={handleBankChange}
                value={bankInfo.bankName}
                name="bankName"
                open={bankDropdownOpen}
                onOpenChange={setBankDropdownOpen}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn ngân hàng">
                    {bankInfo.bankName && (
                      <div className="flex items-center gap-2">
                        {banks.find((b) => b.name === bankInfo.bankName)
                          ?.logo && (
                          <img
                            src={
                              banks.find((b) => b.name === bankInfo.bankName)
                                ?.logo
                            }
                            alt={bankInfo.bankName}
                            className="w-5 h-5 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        <span>{bankInfo.bankName}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <div className="p-2 sticky top-0 bg-white z-10 border-b">
                    <div className="relative">
                      <Input
                        placeholder="Tìm kiếm ngân hàng"
                        value={bankSearchValue}
                        onChange={(e) => setBankSearchValue(e.target.value)}
                        className="pl-10"
                      />
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    {filteredBanks.length === 0 ? (
                      <div className="py-6 text-center text-gray-500">
                        Không tìm thấy ngân hàng phù hợp
                      </div>
                    ) : (
                      filteredBanks.map((bank) => (
                        <SelectItem
                          key={bank.id}
                          value={bank.name}
                          className="flex items-center"
                        >
                          <div className="flex items-center gap-2">
                            {bank.logo ? (
                              <img
                                src={bank.logo}
                                alt={bank.name}
                                className="w-5 h-5 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
                                {bank.shortName?.charAt(0) ||
                                  bank.name.charAt(0)}
                              </div>
                            )}
                            <span className="text-sm">{bank.name}</span>
                            {bank.code && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({bank.code})
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </div>
                </SelectContent>
              </Select>
            </div>
          )}
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
