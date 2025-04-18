import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import dayjs from "dayjs";
import { useState } from "react";
import Pagination from "@/components/pagination/pagination";

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

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="bg-gray-100 p-4 rounded-lg">
        {transactions.length > 0 ? (
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

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(transactions.length / transactionsPerPage)}
              onPageChange={paginate}
            />
          </>
        ) : (
          <p className="text-gray-500">Chưa có giao dịch nào.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
