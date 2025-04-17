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
import { Dropdown, Modal } from "antd";
import { DownOutlined, LoadingOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "@/constants/environments";
import { notificationEvents } from "@/components/ui/notification";
import { TriangleAlert } from "lucide-react";

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
          },
        }
      );

      if (response.status !== 200) {
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
        },
        body: JSON.stringify({
          bookingId: transaction.booking_Id,
        }),
      });
      if (!response.ok) throw new Error("Có lỗi xảy ra khi hủy đơn đặt chỗ.");
      const data = await response.json();
      console.log(data);
      toast.success("Hủy đơn đặt chỗ thành công!", {
        position: "top-right",
        autoClose: 1500,
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
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions
    .filter((tx) => tx.booking_Status?.toLowerCase() === activeTab)
    .sort(
      (a, b) =>
        new Date(b.booking_CreatedAt).getTime() -
        new Date(a.booking_CreatedAt).getTime()
    );

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
      <h2 className="text-2xl font-bold text-[#8B5E3C] mb-4">
        Lịch sử thanh toán
      </h2>

      <div className="flex space-x-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key.toLowerCase())}
            className={cn(
              "py-2 font-medium text-gray-600",
              activeTab === tab.key.toLowerCase() &&
                "border-b-2 border-black text-black"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {currentTransactions.length > 0 ? (
          currentTransactions.map((tx, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-200"
              onClick={() => showModal(tx)}
            >
              <div className="flex items-center space-x-4">
                {tx.bookingHistoryWorkspaceImages.length > 0 && (
                  <img
                    src={tx.bookingHistoryWorkspaceImages[0].imageUrl}
                    alt="Workspace Image"
                    className="w-16 h-16 object-cover rounded-lg shadow-md"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{tx.workspace_Name}</h3>
                  <p className="text-gray-500 text-sm">
                    {dayjs(tx.booking_CreatedAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="font-bold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(tx.booking_Price)}
                </p>
                {tx.booking_Status === "Success" && (
                  <>
                    {tx.isReview === 1 ? (
                      <Button
                        className="text-white px-4 py-2 text-sm font-medium rounded-md min-w-[100px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRebook(tx);
                        }}
                      >
                        Đặt lại
                      </Button>
                    ) : (
                      <Button
                        className="text-white px-4 py-2 text-sm font-medium rounded-md min-w-[100px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          showReviewModal(tx);
                        }}
                      >
                        Đánh giá
                      </Button>
                    )}
                    <div onClick={(e) => e.stopPropagation()}>
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
                            ) > 0
                              ? [
                                  {
                                    key: "cancel",
                                    label: (
                                      <span className="text-red-500">
                                        Hủy giao dịch
                                      </span>
                                    ),
                                    onClick: (e: {
                                      domEvent: { stopPropagation: () => void };
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
                        <Button
                          className="text-black hover:text-white bg-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DownOutlined />
                        </Button>
                      </Dropdown>
                    </div>
                  </>
                )}
                {tx.booking_Status === "Fail" && (
                  <Button
                    className="text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      showModal(tx);
                    }}
                  >
                    Xem chi tiết
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Không có dữ liệu</p>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(
          filteredTransactions.length / transactionsPerPage
        )}
        onPageChange={paginate}
      />

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
              với thời gian đặt chỗ bắt đầu: Hoàn 100% giá trị đặt chỗ.
            </li>
            <li>
              <span className="font-medium">Hủy sau thời hạn 8 giờ:</span> Không
              hỗ trợ hoàn tiền.
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
            <li>
              Thời gian hoàn tiền có thể thay đổi tùy theo quy trình xử lý nhà
              cung cấp dịch vụ thanh toán.
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
