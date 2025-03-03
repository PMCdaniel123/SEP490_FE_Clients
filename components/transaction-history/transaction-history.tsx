import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  paymentMethod: string;
  description: string;
  status: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  formatCurrency: (value: number) => string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  formatCurrency,
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Lịch sử giao dịch</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex flex-col p-2 border-b last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {tx.type === "Nạp tiền" ? (
                      <ArrowDownCircle className="text-green-500" />
                    ) : (
                      <ArrowUpCircle className="text-red-500" />
                    )}
                    <span>{tx.type}</span>
                  </div>
                  <span>{formatCurrency(tx.amount)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-500 text-sm">{tx.date}</span>
                  <span className="text-gray-500 text-sm">
                    {tx.paymentMethod}
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
                        : "text-red-500"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Chưa có giao dịch nào.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;