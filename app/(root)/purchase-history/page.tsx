"use client";

import { useState } from "react";
import { Modal } from "antd";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const transactions = [
  {
    id: 1,
    title: "Giao dịch 1",
    date: "12 Tháng 3 2021 lúc 2:00 PM",
    amount: "1000 USD",
    status: "completed",
    details: "Thông tin chi tiết về giao dịch 1.",
  },
  {
    id: 2,
    title: "Giao dịch 2",
    date: "15 Tháng 3 2021 lúc 3:00 PM",
    amount: "2000 USD",
    status: "pending",
    details: "Thông tin chi tiết về giao dịch 2.",
  },
  {
    id: 3,
    title: "Giao dịch 3",
    date: "18 Tháng 3 2021 lúc 4:00 PM",
    amount: "1500 USD",
    status: "canceled",
    details: "Thông tin chi tiết về giao dịch 3.",
  },
  {
    id: 4,
    title: "Giao dịch 4",
    date: "20 Tháng 3 2021 lúc 5:00 PM",
    amount: "2500 USD",
    status: "completed",
    details: "Thông tin chi tiết về giao dịch 4.",
  },
  {
    id: 5,
    title: "Giao dịch 5",
    date: "22 Tháng 3 2021 lúc 6:00 PM",
    amount: "3000 USD",
    status: "pending",
    details: "Thông tin chi tiết về giao dịch 5.",
  },
];

const tabs = [
  { key: "completed", label: "Hoàn thành" },
  { key: "pending", label: "Chờ thanh toán" },
  { key: "canceled", label: "Đã hủy" },
];

export default function PurchaseHistoryPage() {
  const [activeTab, setActiveTab] = useState("completed");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    null | (typeof transactions)[0]
  >(null);

  const showModal = (transaction: (typeof transactions)[0]) => {
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
    (tx) => tx.status === activeTab
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-36">
      <h2 className="text-2xl font-bold text-[#8B5E3C] mb-4">
        Lịch sử thanh toán
      </h2>

      <div className="flex space-x-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "py-2 font-medium text-gray-600",
              activeTab === tab.key && "border-b-2 border-black text-black"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{tx.title}</h3>
                <p className="text-gray-500 text-sm">{tx.date}</p>
              </div>
              <div className="flex items-center space-x-4">
                <p className="font-bold">{tx.amount}</p>
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
            <h3 className="font-semibold">{selectedTransaction.title}</h3>
            <p className="text-gray-500 text-sm">{selectedTransaction.date}</p>
            <p className="font-bold">{selectedTransaction.amount}</p>
            <p className="mt-4">{selectedTransaction.details}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
