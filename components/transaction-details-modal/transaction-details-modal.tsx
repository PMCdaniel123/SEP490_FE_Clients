import { Modal, Button } from "antd";
import { CheckCircle, Clock, XCircle, MapPin, Coffee } from "lucide-react";
import dayjs from "dayjs";

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
  bookingHistoryAmenities: { name: string; quantity: number; unitPrice: number; imageUrl: string }[];
  bookingHistoryBeverages: { name: string; quantity: number; unitPrice: number; imageUrl: string }[];
  bookingHistoryWorkspaceImages: { imageUrl: string }[];
  license_Name: string;
  license_Address: string;
}

interface TransactionDetailsModalProps {
  isModalOpen: boolean;
  handleCancel: () => void;
  selectedTransaction: Transaction | null;
  renderStatus: (status: string) => string;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isModalOpen,
  handleCancel,
  selectedTransaction,
  renderStatus,
}) => {
  const handleCancelTransaction = () => {
    if (!selectedTransaction) return;

    console.log("Transaction cancellation requested for:", selectedTransaction.booking_CreatedAt);
    alert("Giao dịch đã được hủy thành công.");
    handleCancel();
  };

  return (
    <Modal
      title="Chi tiết giao dịch"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      {selectedTransaction && (
        <div>
        <div className="p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600 text-sm">
              {dayjs(selectedTransaction.booking_CreatedAt).format("DD/MM/YYYY HH:mm")}
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
              <strong className="mr-2">Phương thức thanh toán:</strong> {selectedTransaction.payment_Method === "payOs" ? "Chuyển khoản ngân hàng" : selectedTransaction.payment_Method}
            </p>
            <p className="flex items-center">
              <strong className="mr-2">Mã khuyến mãi:</strong> {selectedTransaction.promotion_Code === "No Promotion" ? "Không" : selectedTransaction.promotion_Code}
            </p>
            <p className="flex items-center">
              <strong className="mr-2">Giảm giá:</strong> {selectedTransaction.discount}%
            </p>
            <p className="flex items-center">
              <strong className="mr-2">Thời gian bắt đầu:</strong> {dayjs(selectedTransaction.booking_StartDate).format("DD/MM/YYYY HH:mm")}
            </p>
            <p className="flex items-center">
              <strong className="mr-2">Thời gian kết thúc:</strong> {dayjs(selectedTransaction.booking_EndDate).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>

          <hr className="my-4" />

          <div className="space-y-2 text-sm">
            <h3 className="font-semibold text-lg flex items-center">
              <MapPin className="mr-2" /> Thông tin không gian
            </h3>
            <p>{selectedTransaction.license_Name}</p>
            <p><strong>Địa chỉ:</strong> {selectedTransaction.license_Address}</p>
            <p><strong>Tên:</strong> {selectedTransaction.workspace_Name}</p>
            <p><strong>Loại:</strong> {selectedTransaction.workspace_Category}</p>
            <p><strong>Sức chứa:</strong> {selectedTransaction.workspace_Capacity} người</p>
            <p><strong>Diện tích:</strong> {selectedTransaction.workspace_Area} m²</p>
            {selectedTransaction.bookingHistoryWorkspaceImages.length > 0 && (
              <div className="mt-4 flex justify-center">
                <img src={selectedTransaction.bookingHistoryWorkspaceImages[0].imageUrl} alt="Workspace Image" className="w-full h-48 object-cover rounded-lg shadow-md" />
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
                    <li key={index}>
                      <img src={item.imageUrl} alt={item.name} className="inline-block w-10 h-10 mr-2" />
                      {item.name} (x{item.quantity}) - {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.unitPrice)}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>Không</p>
            )}
            {selectedTransaction.bookingHistoryBeverages.length > 0 ? (
              <>
                <p><strong>Đồ uống:</strong></p>
                <ul className="list-disc pl-6">
                  {selectedTransaction.bookingHistoryBeverages.map((item, index) => (
                    <li key={index}>
                      <img src={item.imageUrl} alt={item.name} className="inline-block w-10 h-10 mr-2" />
                      {item.name} (x{item.quantity}) - {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.unitPrice)}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>Không</p>
            )}
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-center text-lg font-bold text-primary">
            <span>Tổng tiền:</span>
            <span>{new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(selectedTransaction.booking_Price)}</span>
          </div>


        </div>
        {selectedTransaction.booking_Status !== "Fail" && (
            <div className="flex justify-end mt-4">
              <Button type="primary" danger onClick={handleCancelTransaction}>
                Hủy giao dịch
              </Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default TransactionDetailsModal;