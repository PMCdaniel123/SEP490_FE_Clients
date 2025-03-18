"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader/Loader";
import Pagination from "@/components/pagination/pagination";
import dayjs from "dayjs";
import TransactionDetailsModal from "@/components/transaction-details-modal/transaction-details-modal";
import ReviewForm from "@/components/review-list/review-form";
import { Dropdown, Menu, Modal } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactChat from "@/components/user-feedback/user-feedback";
import axios from "axios";

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
  bookingHistoryAmenities: { name: string; quantity: number; unitPrice: number; imageUrl: string }[];
  bookingHistoryBeverages: { name: string; quantity: number; unitPrice: number; imageUrl: string }[];
  bookingHistoryWorkspaceImages: { imageUrl: string }[];
  license_Name: string;
  license_Address: string;
  isReview: number;
}

const tabs = [
  { key: "Success", label: "Hoàn thành" },
  { key: "Fail", label: "Đã hủy" },
];

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("success");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<null | Transaction>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  const { customer } = useSelector((state: RootState) => state.auth);

  const fetchTransactionHistory = async () => {
    if (!customer) return;

    try {
      const response = await axios.get("https://localhost:5050/users/booking/historybookings", {
        params: { UserId: customer.id },
      });
      setTransactions(response.data.bookingHistories);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleContactModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsContactModalOpen(true);
  };

  const handleContactCancel = () => {
    setIsContactModalOpen(false);
  };

  const handleReviewSubmit = async (review: { rating: number; comment: string; images: string[] }) => {
    if (!selectedTransaction) return;

    const reviewData = {
      bookingId: selectedTransaction.booking_Id,
      rate: review.rating,
      comment: review.comment,
      images: review.images.map((url) => ({ url })),
    };

    try {
      const response = await axios.post("https://localhost:5050/users/booking/rating", reviewData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error(response.data.notification || "Có lỗi xảy ra khi gửi đánh giá.");
      }

      setIsReviewModalOpen(false);
      toast.success(response.data.notification || "Đánh giá đã được gửi thành công!");
      await fetchTransactionHistory();
    } catch (error: any) {
      toast.error(error.response?.data?.notification || "Có lỗi xảy ra khi gửi đánh giá.");
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "Success":
        return "Hoàn thành";
      case "Fail":
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
    handleContactModal(transaction);
  };

  const handleCancelTransaction = (transaction: Transaction) => {
    console.log("Transaction cancellation requested for:", transaction.booking_CreatedAt);
    alert("Giao dịch đã được hủy thành công.");
  };

  const filteredTransactions = transactions
    .filter((tx) => tx.booking_Status?.toLowerCase() === activeTab)
    .sort((a, b) => new Date(b.booking_CreatedAt).getTime() - new Date(a.booking_CreatedAt).getTime());

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-36">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-[#8B5E3C] mb-4">Lịch sử thanh toán</h2>

      <div className="flex space-x-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key.toLowerCase())}
            className={cn(
              "py-2 font-medium text-gray-600",
              activeTab === tab.key.toLowerCase() && "border-b-2 border-black text-black"
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
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "rebook",
                            label: "Đặt lại",
                            onClick: () => handleRebook(tx),
                          },
                          {
                            key: "contact",
                            label: "Liên hệ",
                            onClick: () => handleContact(tx),
                          },
                          {
                            key: "cancel",
                            label: "Hủy giao dịch",
                            onClick: () => handleCancelTransaction(tx),
                          },
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
        totalPages={Math.ceil(filteredTransactions.length / transactionsPerPage)}
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
          workspaceImageUrl={selectedTransaction.bookingHistoryWorkspaceImages[0]?.imageUrl || ""}
          booking_Id={selectedTransaction.booking_Id}
        />
      )}

      <Modal
        title="Liên hệ"
        open={isContactModalOpen}
        onCancel={handleContactCancel}
        footer={null}
        width={600}
      >
        {selectedTransaction && customer && customer.id && (
          <ContactChat userId={customer.id.toString()} ownerId={selectedTransaction.workspace_Id} />
        )}
      </Modal>
    </div>
  );
}