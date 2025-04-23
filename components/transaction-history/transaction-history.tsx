import { ArrowDownCircle, ArrowUpCircle, Filter } from "lucide-react";
import dayjs from "dayjs";
import { useState } from "react";
import Pagination from "@/components/pagination/pagination";
import { Button, DatePicker, Select, Space } from "antd";
import type { DatePickerProps } from "antd";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  paymentMethod: string;
  description: string;
  status: string;
  afterTransactionAmount: number;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  formatCurrency: (value: number) => string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  formatCurrency,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const transactionTypes = [...new Set(transactions.map((tx) => tx.type))];
  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filters.type ? tx.type === filters.type : true;

    const txDate = new Date(tx.date).getTime();
    const matchesStartDate = filters.startDate
      ? txDate >= new Date(filters.startDate).getTime()
      : true;
    const matchesEndDate = filters.endDate
      ? txDate <= new Date(filters.endDate).getTime() + 86400000 // Add one day to include the end date
      : true;

    return matchesType && matchesStartDate && matchesEndDate;
  });

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    handleFilterChange({ ...filters, type: value });
  };

  const handleStartDateChange: DatePickerProps["onChange"] = (date) => {
    const dateString = date ? date.format("YYYY-MM-DD") : "";
    handleFilterChange({ ...filters, startDate: dateString });
  };

  const handleEndDateChange: DatePickerProps["onChange"] = (date) => {
    const dateString = date ? date.format("YYYY-MM-DD") : "";
    handleFilterChange({ ...filters, endDate: dateString });
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const startDateValue = filters.startDate ? dayjs(filters.startDate) : null;
  const endDateValue = filters.endDate ? dayjs(filters.endDate) : null;
  const toggleFilters = () => {
    if (showFilters) {
      resetFilters();
    }
    setShowFilters(!showFilters);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold"></h2>
        <Button
          type="default"
          icon={<Filter size={16} />}
          onClick={toggleFilters}
        >
          {showFilters ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
        </Button>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <Space direction="vertical" className="w-full">
            <Space className="w-full" wrap>
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại giao dịch
                </label>
                <Select
                  className="w-full"
                  placeholder="Chọn loại giao dịch"
                  allowClear
                  value={filters.type || undefined}
                  onChange={handleTypeChange}
                  options={[
                    { value: "", label: "Tất cả" },
                    ...transactionTypes.map((type) => ({
                      value: type,
                      label: type,
                    })),
                  ]}
                />
              </div>

              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ ngày
                </label>
                <DatePicker
                  placeholder="Chọn ngày bắt đầu"
                  value={startDateValue}
                  onChange={handleStartDateChange}
                  format="DD/MM/YYYY"
                  className="w-full"
                />
              </div>

              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đến ngày
                </label>
                <DatePicker
                  placeholder="Chọn ngày kết thúc"
                  value={endDateValue}
                  onChange={handleEndDateChange}
                  format="DD/MM/YYYY"
                  className="w-full"
                />
              </div>

              <div className="flex pt-6">
                <Button type="default" onClick={resetFilters}>
                  Xóa bộ lọc
                </Button>
              </div>
            </Space>
          </Space>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg">
        {sortedTransactions.length > 0 ? (
          <>
            <ul>
              {currentTransactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex flex-col p-2 border-b last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {tx.type === "Nạp tiền" ? (
                        <ArrowUpCircle className="text-green-500" />
                      ) : tx.type === "Hoàn tiền" ? (
                        <ArrowUpCircle className="text-yellow-500" />
                      ) : tx.type === "Rút tiền" ? (
                        <ArrowDownCircle className="text-blue-500" />
                      ) : (
                        <ArrowDownCircle className="text-red-500" />
                      )}
                      <span>{tx.type}</span>
                    </div>
                    <span>{formatCurrency(tx.amount)}</span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-500 text-sm">
                      {dayjs(tx.date).format("DD/MM/YYYY - HH:mm")}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Số dư: {formatCurrency(tx.afterTransactionAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-500 text-sm">
                      {tx.description}
                    </span>
                    <span
                      className={`text-sm ${
                        tx.status === "Hoàn thành"
                          ? "text-green-500"
                          : tx.status === "Hoàn tiền"
                          ? "text-yellow-500"
                          : tx.status === "Withdraw Success"
                          ? "text-blue-500"
                          : "text-red-500"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(
                  sortedTransactions.length / transactionsPerPage
                )}
                onPageChange={paginate}
              />
            </div>
          </>
        ) : (
          <p className="text-gray-500">Không tìm thấy giao dịch nào phù hợp.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
