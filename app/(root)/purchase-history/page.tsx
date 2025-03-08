"use client";

import { useState, useEffect } from "react";
import { Modal } from "antd";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import Loader from "@/components/loader/Loader";
import { CheckCircle, Clock, XCircle, MapPin, Coffee } from "lucide-react";
import Pagination from "@/components/pagination/pagination";

interface Transaction {
  booking_StartDate: string;
  booking_EndDate: string;
  booking_Price: number;
  booking_Status?: string;
  booking_CreatedAt: string;
  payment_Method: string;
  workspace_Name: string;
  workspace_Capacity: number;
  workspace_Category: string;
  workspace_Description: string;
  workspace_Area: number;
  workspace_CleanTime: number;
  promotion_Code: string;
  discount: number;
  bookingHistoryAmenities: { name: string; quantity: number }[];
  bookingHistoryBeverages: { name: string; quantity: number }[];
  bookingHistoryWorkspaceImages: { imageUrl: string }[];
}

const tabs = [
  { key: "Success", label: "Hoàn thành" },
  { key: "Handling", label: "Chờ thanh toán" },
  { key: "Fail", label: "Đã hủy" },
];

export default function PurchaseHistoryPage() {
  const [activeTab, setActiveTab] = useState("success");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<null | Transaction>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5); // Number of transactions per page
  const { customer } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (customer) {
      fetch(`https://localhost:5050/users/booking/historybookings?UserId=${customer.id}`)
        .then((response) => response.json())
        .then((data) => {
          setTransactions(data.bookingHistories);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, [customer]);

  const showModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "Success":
        return "Hoàn thành";
      case "Handling":
        return "Chờ thanh toán";
      case "Fail":
        return "Đã hủy";
      default:
        return status;
    }
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
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{tx.workspace_Name}</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(tx.booking_CreatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <p className="font-bold">{new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(tx.booking_Price)}</p>
                <Button className="text-white" onClick={() => showModal(tx)}>
                  Xem chi tiết
                </Button>
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

      <Modal
        title="Chi tiết giao dịch"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        {selectedTransaction && (
          <div className="p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600 text-sm">
                {new Date(selectedTransaction.booking_CreatedAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <p className="flex items-center">
                <strong className="mr-2">Trạng thái:</strong>
                {selectedTransaction.booking_Status === "Success" && (
                  <CheckCircle className="text-green-500" />
                )}
                {selectedTransaction.booking_Status === "Handling" && (
                  <Clock className="text-yellow-500" />
                )}
                {selectedTransaction.booking_Status === "Fail" && (
                  <XCircle className="text-red-500" />
                )}
                <span className="ml-2">{renderStatus(selectedTransaction.booking_Status || "Không có")}</span>
              </p>
              <p className="flex items-center">
                <strong className="mr-2">Phương thức thanh toán:</strong> {selectedTransaction.payment_Method}
              </p>
              <p className="flex items-center">
                <strong className="mr-2">Mã khuyến mãi:</strong> {selectedTransaction.promotion_Code || "Không có"}
              </p>
              <p className="flex items-center">
                <strong className="mr-2">Giảm giá:</strong> {selectedTransaction.discount}%
              </p>
              <p className="flex items-center">
                <strong className="mr-2">Thời gian bắt đầu:</strong> {new Date(selectedTransaction.booking_StartDate).toLocaleString()}
              </p>
              <p className="flex items-center">
                <strong className="mr-2">Thời gian kết thúc:</strong> {new Date(selectedTransaction.booking_EndDate).toLocaleString()}
              </p>
            </div>

            <hr className="my-4" />

            <div className="space-y-2 text-sm">
              <h3 className="font-semibold text-lg flex items-center">
                <MapPin className="mr-2" /> Thông tin không gian
              </h3>
              <p><strong>Tên:</strong> {selectedTransaction.workspace_Name}</p>
              <p><strong>Loại:</strong> {selectedTransaction.workspace_Category}</p>
              <p><strong>Sức chứa:</strong> {selectedTransaction.workspace_Capacity} người</p>
              <p><strong>Diện tích:</strong> {selectedTransaction.workspace_Area} m²</p>
              <p><strong>Thời gian dọn dẹp:</strong> {selectedTransaction.workspace_CleanTime} phút</p>
              <p><strong>Mô tả:</strong> {selectedTransaction.workspace_Description}</p>
              {selectedTransaction.bookingHistoryWorkspaceImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {selectedTransaction.bookingHistoryWorkspaceImages.map((image, index) => (
                    <img key={index} src={image.imageUrl} alt={`Workspace Image ${index + 1}`} className="w-full h-auto rounded-lg" />
                  ))}
                </div>
              )}
            </div>

            <hr className="my-4" />

            <div className="space-y-2 text-sm">
              <h3 className="font-semibold text-lg flex items-center">
                <Coffee className="mr-2" /> Dịch vụ kèm theo
              </h3>
              {selectedTransaction.bookingHistoryAmenities.length > 0 ? (
                <>
                  <p><strong>Tiện ích:</strong></p>
                  <ul className="list-disc pl-6">
                    {selectedTransaction.bookingHistoryAmenities.map((item, index) => (
                      <li key={index}>{item.name} (x{item.quantity})</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Không có dữ liệu</p>
              )}
              {selectedTransaction.bookingHistoryBeverages.length > 0 ? (
                <>
                  <p><strong>Đồ uống:</strong></p>
                  <ul className="list-disc pl-6">
                    {selectedTransaction.bookingHistoryBeverages.map((item, index) => (
                      <li key={index}>{item.name} (x{item.quantity})</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Không có dữ liệu</p>
              )}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Tổng tiền:</span>
              <span>{new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(selectedTransaction.booking_Price)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}