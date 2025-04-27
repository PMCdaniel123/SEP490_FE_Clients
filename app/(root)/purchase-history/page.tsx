/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader/Loader";
import Pagination from "@/components/pagination/pagination";
import dayjs from "dayjs";
import TransactionDetailsModal from "@/components/transaction-details-modal/transaction-details-modal";
import ReviewForm from "@/components/review-list/review-form";
import { DatePicker, Dropdown, Empty, Modal, Select, Tooltip } from "antd";
import {
  CalendarOutlined,
  DownOutlined,
  FilterOutlined,
  LoadingOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "@/constants/environments";
import { notificationEvents } from "@/components/ui/notification";

import Cookies from "js-cookie";
import { Clock, TriangleAlert } from "lucide-react";

interface Transaction {
  booking_Id: number;
  booking_StartDate: string;
  booking_EndDate: string;
  booking_Price: number;
  booking_Status?: string;
  booking_CreatedAt: string;
  payment_Method: string;
  workspace_Id: number;
  workspace_Name: string;
  workspace_Capacity: number;
  workspace_Category: string;
  workspace_Description: string;
  workspace_Area: number;
  workspace_CleanTime: number;
  promotion_Code: string;
  discount: number;
  bookingHistoryAmenities: {
    name: string;
    quantity: number;
    unitPrice: number;
    imageUrl: string;
  }[];
  bookingHistoryBeverages: {
    name: string;
    quantity: number;
    unitPrice: number;
    imageUrl: string;
  }[];
  bookingHistoryWorkspaceImages: { imageUrl: string }[];
  license_Name: string;
  license_Address: string;
  isReview: number;
}

const tabs = [
  { key: "Success", label: "Hoàn thành" },
  { key: "Cancelled", label: "Đã hủy" },
];

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("success");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<null | Transaction>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  const { customer } = useSelector((state: RootState) => state.auth);
  const [isCancelBookingModal, setIsCancelBookingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = typeof window !== "undefined" ? Cookies.get("token") : null;
  const google_token =
    typeof window !== "undefined" ? Cookies.get("google_token") : null;

  // New state for filtering and sorting
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest" | "price-high" | "price-low"
  >("newest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!customer) return;

      try {
        const response = await axios.get(
          `${BASE_URL}/users/booking/historybookings`,
          {
            params: { UserId: customer.id },
          }
        );
        setTransactions(response.data.bookingHistories);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    fetchTransactionHistory();
  }, [customer]);

  const showModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showReviewModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsReviewModalOpen(true);
  };

  const handleReviewCancel = () => {
    setIsReviewModalOpen(false);
  };

  const handleCancelBookingModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsCancelBookingModal(true);
    setIsModalOpen(false);
  };

  const handleCancelBookingCancel = () => {
    setIsCancelBookingModal(false);
  };

  const handleReviewSubmit = async (review: {
    rating: number;
    comment: string;
    images: string[];
  }) => {
    if (!selectedTransaction) return;

    const reviewData = {
      bookingId: selectedTransaction.booking_Id,
      rate: review.rating,
      comment: review.comment,
      images: review.images.map((url) => ({ url })),
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/users/booking/rating`,
        reviewData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || google_token}`,
          },
        }
      );

      if (response.status === 401) {
        router.push("/unauthorized");
        throw new Error("Bạn không được phép truy cập!");
      } else if (response.status !== 200) {
        throw new Error(
          response.data.notification || "Có lỗi xảy ra khi gửi đánh giá."
        );
      }

      setIsReviewModalOpen(false);
      toast.success(
        response.data.notification || "Đánh giá đã được gửi thành công!"
      );

      const fetchTransactionHistory = async () => {
        if (!customer) return;

        try {
          const response = await axios.get(
            `${BASE_URL}/users/booking/historybookings`,
            {
              params: { UserId: customer.id },
            }
          );
          setTransactions(response.data.bookingHistories);
          setLoading(false);
        } catch {
          setLoading(false);
        }
      };
      fetchTransactionHistory();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage || "Có lỗi xảy ra khi gửi đánh giá.");
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "Success":
        return "Hoàn thành";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const handleRebook = (transaction: Transaction) => {
    if (!transaction.workspace_Id) return;
    console.log("Rebook:", transaction);
    router.push(`/workspace/${transaction.workspace_Id}`);
  };

  const handleContact = (transaction: Transaction) => {
    console.log("Contact:", transaction);
    router.push(`/feedback?bookingId=${transaction.booking_Id}`);
  };

  const handleCancelTransaction = async (transaction: Transaction | null) => {
    if (transaction === null) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/cancelbooking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || google_token}`,
        },
        body: JSON.stringify({
          bookingId: transaction.booking_Id,
        }),
      });
      if (response.status === 401) {
        router.push("/unauthorized");
        throw new Error("Bạn không được phép truy cập!");
      } else if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi hủy đơn đặt chỗ.");
      }

      const data = await response.json();
      if (
        data &&
        data.notification === "Ví đã bị khóa để thực hiện yêu cầu rút tiền" &&
        data.isLock === 1
      ) {
        throw new Error("Không thể hủy do bạn đang thực hiện yêu cầu rút tiền");
      }
      console.log(data);
      toast.success("Hủy đơn đặt chỗ thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
      setIsCancelBookingModal(false);
      setIsLoading(false);
      if (customer) {
        try {
          const response = await axios.get(
            `${BASE_URL}/users/booking/historybookings`,
            {
              params: { UserId: customer.id },
            }
          );
          setTransactions(response.data.bookingHistories);
        } catch (error) {
          console.error("Error fetching updated transaction history:", error);
        }
      }
      const event = new CustomEvent(notificationEvents.BOOKING_CANCELED);
      window.dispatchEvent(event);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        theme: "light",
      });
      setIsLoading(false);
    }
  };

  // loc transaction
  const sortTransactions = (transactions: Transaction[]) => {
    switch (sortOrder) {
      case "oldest":
        return [...transactions].sort(
          (a, b) =>
            new Date(a.booking_CreatedAt).getTime() -
            new Date(b.booking_CreatedAt).getTime()
        );
      case "price-high":
        return [...transactions].sort(
          (a, b) => b.booking_Price - a.booking_Price
        );
      case "price-low":
        return [...transactions].sort(
          (a, b) => a.booking_Price - b.booking_Price
        );
      case "newest":
      default:
        return [...transactions].sort(
          (a, b) =>
            new Date(b.booking_CreatedAt).getTime() -
            new Date(a.booking_CreatedAt).getTime()
        );
    }
  };

  const filterBySearch = (tx: Transaction) => {
    if (!searchQuery.trim()) return true;
    return tx.workspace_Name.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const filterByDate = (tx: Transaction) => {
    if (!dateRange[0] || !dateRange[1]) return true;

    const startDate = dateRange[0].startOf("day");
    const endDate = dateRange[1].endOf("day");

    const txDate = dayjs(tx.booking_CreatedAt);
    return txDate.isAfter(startDate) && txDate.isBefore(endDate);
  };

  const filteredTransactions = transactions
    .filter((tx) => tx.booking_Status?.toLowerCase() === activeTab)
    .filter(filterBySearch)
    .filter(filterByDate);

  const sortedTransactions = sortTransactions(filteredTransactions);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    setDateRange(dates || [null, null]);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value as "newest" | "oldest" | "price-high" | "price-low");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setDateRange([null, null]);
    setSearchQuery("");
    setSortOrder("newest");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-[#8B5E3C] mb-6">
        Lịch sử thanh toán
      </h2>

      {/* Improved tab navigation */}
      <div className="flex space-x-6 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key.toLowerCase());
              setCurrentPage(1);
            }}
            className={cn(
              "py-2 px-4 font-medium text-gray-600 border-b-2 border-transparent transition-all duration-200",
              activeTab === tab.key.toLowerCase() &&
                "border-[#8B5E3C] text-[#8B5E3C] font-semibold"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters and search */}
      <div className="bg-white p-4 rounded-lg mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên không gian làm việc"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <DatePicker.RangePicker
              style={{ width: "100%", height: "40px" }}
              value={dateRange as any}
              onChange={handleDateRangeChange}
              placeholder={["Từ ngày", "Đến ngày"]}
              format="DD/MM/YYYY"
              className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent"
            />
          </div>

          <div className="w-full md:w-1/3 flex gap-2">
            <Select
              style={{ width: "100%", height: "40px" }}
              value={sortOrder}
              onChange={handleSortChange}
              options={[
                { value: "newest", label: "Mới nhất" },
                { value: "oldest", label: "Cũ nhất" },
                { value: "price-high", label: "Giá cao - thấp" },
                { value: "price-low", label: "Giá thấp - cao" },
              ]}
              className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent"
            />

            <Button
              onClick={clearFilters}
              className="bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100"
            >
              Đặt lại
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Tìm thấy {filteredTransactions.length} kết quả
          </p>
          <div className="flex items-center">
            <FilterOutlined className="mr-2" />
            <SortAscendingOutlined />
          </div>
        </div>
      </div>

      {/* Transaction list */}
      <div className="mt-4 space-y-4">
        {currentTransactions.length > 0 ? (
          currentTransactions.map((tx, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div
                className="flex flex-col md:flex-row md:items-center p-4 cursor-pointer"
                onClick={() => showModal(tx)}
              >
                <div className="flex items-center space-x-4 flex-grow mb-4 md:mb-0">
                  {tx.bookingHistoryWorkspaceImages.length > 0 ? (
                    <img
                      src={tx.bookingHistoryWorkspaceImages[0].imageUrl}
                      alt="Workspace Image"
                      className="w-20 h-20 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <h3 className="font-semibold text-lg">
                        {tx.workspace_Name}
                      </h3>
                    </div>

                    <div className="text-sm text-gray-500 space-y-1">
                      <Tooltip title="Ngày đặt chỗ">
                        <p className="flex items-center gap-1">
                          <CalendarOutlined />
                          {dayjs(tx.booking_CreatedAt).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </p>
                      </Tooltip>

                      <p className="flex items-center gap-1">
                        <span>Phương thức:</span>
                        <span className="font-medium">
                          {tx.payment_Method === "WorkHive Wallet"
                            ? "Ví WorkHive"
                            : "Chuyển khoản ngân hàng"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center md:space-x-4">
                  <p className="font-bold text-lg mb-4 md:mb-0 text-[#8B5E3C]">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(tx.booking_Price)}
                  </p>

                  <div
                    className="flex items-center space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {tx.booking_Status === "Success" && (
                      <>
                        {tx.isReview === 1 ? (
                          <Button
                            className="bg-[#8B5E3C] text-white px-4 py-2 text-sm font-medium rounded-md min-w-[100px] hover:bg-[#7D533A]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRebook(tx);
                            }}
                          >
                            Đặt lại
                          </Button>
                        ) : dayjs().unix() -
                            dayjs(tx.booking_StartDate).unix() >=
                          0 ? (
                          <Button
                            className="bg-[#8B5E3C] text-white px-4 py-2 text-sm font-medium rounded-md min-w-[100px] hover:bg-[#7D533A]"
                            onClick={(e) => {
                              e.stopPropagation();
                              showReviewModal(tx);
                            }}
                          >
                            Đánh giá
                          </Button>
                        ) : (
                          <Button
                            className="bg-[#8B5E3C] text-white px-4 py-2 text-sm font-medium rounded-md min-w-[100px] hover:bg-[#7D533A]"
                            onClick={(e) => {
                              e.stopPropagation();
                              showModal(tx);
                            }}
                          >
                            Chi tiết
                          </Button>
                        )}

                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: "rebook",
                                label: "Đặt lại",
                                onClick: (e) => {
                                  e.domEvent.stopPropagation();
                                  handleRebook(tx);
                                },
                              },
                              {
                                key: "contact",
                                label: "Liên hệ",
                                onClick: (e) => {
                                  e.domEvent.stopPropagation();
                                  handleContact(tx);
                                },
                              },
                              ...(dayjs(tx.booking_StartDate).diff(
                                dayjs(),
                                "hour"
                              ) >= 8
                                ? [
                                    {
                                      key: "cancel",
                                      label: (
                                        <span className="text-red-500">
                                          Hủy giao dịch
                                        </span>
                                      ),
                                      onClick: (e: {
                                        domEvent: {
                                          stopPropagation: () => void;
                                        };
                                      }) => {
                                        e.domEvent.stopPropagation();
                                        handleCancelBookingModal(tx);
                                      },
                                    },
                                  ]
                                : []),
                            ],
                          }}
                          trigger={["click"]}
                        >
                          <Button className="text-black hover:text-white bg-white border border-gray-300">
                            <DownOutlined />
                          </Button>
                        </Dropdown>
                      </>
                    )}

                    {tx.booking_Status === "Cancelled" && (
                      <Button
                        className="bg-[#8B5E3C] text-white hover:bg-[#7D533A]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRebook(tx);
                        }}
                      >
                        Đặt lại
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking period and quick actions */}
              <div className="bg-gray-50 px-4 py-2 border-t flex flex-col md:flex-row justify-between items-center text-sm">
                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Thời gian sử dụng:</span>
                  <span className="font-medium">
                    {dayjs(tx.booking_StartDate).format("DD/MM/YYYY HH:mm")}
                    {" - "}
                    {dayjs(tx.booking_EndDate).format("DD/MM/YYYY HH:mm")}
                  </span>
                </div>

                {/* <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showModal(tx);
                  }}
                  className="text-[#8B5E3C] hover:underline font-medium"
                >
                  Xem chi tiết
                </button> */}
              </div>
            </div>
          ))
        ) : (
          <Empty
            description={
              <span className="text-gray-500">Không có giao dịch nào</span>
            }
            className="my-8 bg-white p-8 rounded-lg border border-gray-200"
          />
        )}
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(
            filteredTransactions.length / transactionsPerPage
          )}
          onPageChange={(pageNumber: number) => setCurrentPage(pageNumber)}
        />
      </div>

      <TransactionDetailsModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        selectedTransaction={selectedTransaction}
        renderStatus={renderStatus}
      />

      {selectedTransaction && (
        <ReviewForm
          isReviewModalOpen={isReviewModalOpen}
          handleReviewCancel={handleReviewCancel}
          handleReviewSubmit={handleReviewSubmit}
          workspaceName={selectedTransaction.workspace_Name}
          workspaceCategory={selectedTransaction.workspace_Category}
          workspaceCapacity={selectedTransaction.workspace_Capacity}
          workspaceArea={selectedTransaction.workspace_Area}
          licenseName={selectedTransaction.license_Name}
          workspaceImageUrl={
            selectedTransaction.bookingHistoryWorkspaceImages[0]?.imageUrl || ""
          }
          booking_Id={selectedTransaction.booking_Id}
        />
      )}

      <Modal
        title={
          <p className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="text-yellow-400">
              <TriangleAlert />
            </span>{" "}
            <span>Lưu ý</span>
          </p>
        }
        open={isCancelBookingModal}
        onCancel={handleCancelBookingCancel}
        footer={[
          <button
            key="accept"
            disabled={isLoading}
            onClick={() => handleCancelTransaction(selectedTransaction)}
            className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300"
          >
            {isLoading ? (
              <LoadingOutlined style={{ color: "red" }} />
            ) : (
              <span>Xác nhận</span>
            )}
          </button>,
        ]}
      >
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Chính sách hủy đặt chỗ
          </h3>

          <h4 className="text-md font-medium text-gray-800 mt-3">
            1. Điều kiện hủy và hoàn tiền
          </h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              <span className="font-medium">Hủy trước ít nhất 8 giờ</span> so
              với thời gian đặt chỗ bắt đầu: Hoàn 80% giá trị đặt chỗ.
            </li>
            <li>
              <span className="font-medium">Hủy sau thời hạn 8 giờ:</span> Không
              hỗ trợ hoàn tiền.
            </li>
            <li>
              <span className="font-medium">
                Lưu ý: trong thời gian yêu cầu rút tiền
              </span>{" "}
              không thể thực hiện hủy đơn đặt chỗ.
            </li>
          </ul>

          <h4 className="text-md font-medium text-gray-800 mt-4">
            2. Quy trình hoàn tiền
          </h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              Tiền hoàn trả sẽ được chuyển về{" "}
              <span className="font-medium">Ví WorkHive</span> trong vòng{" "}
              <span className="font-medium">7 ngày làm việc</span>.
            </li>
          </ul>

          <h4 className="text-md font-medium text-gray-800 mt-4">
            3. Lưu ý quan trọng
          </h4>
          <p className="text-gray-700">
            Thời gian hủy được tính dựa trên thời điểm bắt đầu sử dụng dịch vụ,
            không phải thời điểm đặt chỗ.
          </p>
        </div>

        <p className="text-gray-700 dark:text-gray-300 py-2 font-medium">
          Bạn có xác nhận hủy đơn đặt chỗ này không?
        </p>
      </Modal>
    </div>
  );
}
