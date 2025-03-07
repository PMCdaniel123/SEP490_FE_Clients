"use client";

import { useState, useEffect } from "react";
import { Modal } from "antd";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import Loader from "@/components/loader/Loader";

interface Transaction {
  startDate: string;
  endDate: string;
  price: number;
  status: string;
  createdAt: string;
}

const tabs = [
  { key: "completed", label: "Hoàn thành" },
  { key: "Handling", label: "Chờ thanh toán" },
  { key: "canceled", label: "Đã hủy" },
];

export default function PurchaseHistoryPage() {
  const [activeTab, setActiveTab] = useState("completed");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<null | Transaction>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const filteredTransactions = transactions.filter(
    (tx) => tx.status.toLowerCase() === activeTab
  );

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
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
            >
              <div>
                <h3 className="font-semibold">Giao dịch {index + 1}</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(tx.startDate).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <p className="font-bold">{new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(tx.price)}</p>
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

      <Modal
        title="Chi tiết giao dịch"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: "#8B5E3C", borderColor: "#8B5E3C" },
        }}
        cancelButtonProps={{
          style: { backgroundColor: "#f0f0f0", borderColor: "#d9d9d9" },
        }}
      >
        {selectedTransaction && (
          <div>
            
            <p className="text-gray-500 text-sm">
              {new Date(selectedTransaction.startDate).toLocaleString()}
            </p>
            <p className="font-bold">{new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(selectedTransaction.price)}</p>
            <p className="mt-4">Trạng thái: {selectedTransaction.status}</p>
            <p className="mt-4">Ngày tạo: {new Date(selectedTransaction.createdAt).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}