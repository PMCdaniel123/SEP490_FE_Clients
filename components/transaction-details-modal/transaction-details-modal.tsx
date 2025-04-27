/* eslint-disable @next/next/no-img-element */
import { Modal } from "antd";
import {
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Coffee,
  Calendar,
  Users,
  Ruler,
  Building,
  Home,
  CreditCard,
  Tag,
  Percent,
  Receipt,
} from "lucide-react";
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
  return (
    <Modal
      title={
        <div className="text-xl font-medium text-gray-800">
          Chi tiết giao dịch
        </div>
      }
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={700}
      className="transaction-details-modal"
      style={{
        top: 20,
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {selectedTransaction && (
        <div>
          <div className="p-6 bg-white">
            {/* Header with timestamp */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Receipt className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-primary">
                  {dayjs(selectedTransaction.booking_CreatedAt).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </p>
              </div>

              <div className="flex items-center">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedTransaction.booking_Status === "Success"
                      ? "bg-green-100 text-green-600"
                      : selectedTransaction.booking_Status === "Handling"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {selectedTransaction.booking_Status === "Success" && (
                    <CheckCircle className="inline-block mr-1 h-3 w-3" />
                  )}
                  {selectedTransaction.booking_Status === "Handling" && (
                    <Clock className="inline-block mr-1 h-3 w-3" />
                  )}
                  {selectedTransaction.booking_Status === "Fail" && (
                    <XCircle className="inline-block mr-1 h-3 w-3" />
                  )}
                  {renderStatus(
                    selectedTransaction.booking_Status || "Không có"
                  )}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-4 mb-6 bg-gray-50 p-4 rounded-xl">
              <h3 className="font-medium text-base flex items-center text-gray-700">
                <CreditCard className="mr-2 h-5 w-5 text-primary" /> Thông tin
                thanh toán
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p className="flex items-center">
                  <span className="text-gray-500 mr-2">Phương thức:</span>
                  <span className="font-medium">
                    {selectedTransaction.payment_Method === "WorkHive Wallet"
                      ? "Ví WorkHive"
                      : "Chuyển khoản"}
                  </span>
                </p>

                <p className="flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-gray-500 mr-2">Mã khuyến mãi:</span>
                  <span className="font-medium">
                    {selectedTransaction.promotion_Code
                      ? selectedTransaction.promotion_Code
                      : "Không có"}
                  </span>
                </p>

                {selectedTransaction.promotion_Code && (
                  <p className="flex items-center">
                    <Percent className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-gray-500 mr-2">Giảm giá:</span>
                    <span className="font-medium">
                      {selectedTransaction.discount}%
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Booking Time */}
            <div className="space-y-4 mb-6">
              <div className="bg-third p-4 rounded-xl border border-third">
                <h3 className="font-medium text-base flex items-center text-primary mb-3">
                  <Calendar className="mr-2 h-5 w-5" /> Thời gian sử dụng
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Bắt đầu</p>
                    <p className="font-medium">
                      {dayjs(selectedTransaction.booking_StartDate).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Kết thúc</p>
                    <p className="font-medium">
                      {dayjs(selectedTransaction.booking_EndDate).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Workspace Info */}
            <div className="space-y-4 mb-6">
              <h3 className="font-medium text-base flex items-center text-gray-700">
                <MapPin className="mr-2 h-5 w-5 text-primary" /> Thông tin không
                gian
              </h3>

              {selectedTransaction.bookingHistoryWorkspaceImages.length > 0 && (
                <div className="mb-4">
                  <img
                    src={
                      selectedTransaction.bookingHistoryWorkspaceImages[0]
                        .imageUrl
                    }
                    alt="Workspace Image"
                    className="w-full h-56 object-cover rounded-xl shadow-sm"
                  />
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-base font-medium mb-3 text-primary">
                  {selectedTransaction.license_Name}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <p className="flex items-center col-span-1 md:col-span-2">
                    <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-gray-500 mr-1">Địa chỉ:</span>
                    <span className="font-medium">
                      {selectedTransaction.license_Address}
                    </span>
                  </p>

                  <p className="flex items-center">
                    <Home className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-gray-500 mr-1">Tên:</span>
                    <span className="font-medium">
                      {selectedTransaction.workspace_Name}
                    </span>
                  </p>

                  <p className="flex items-center">
                    <Building className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-gray-500 mr-1">Loại:</span>
                    <span className="font-medium">
                      {selectedTransaction.workspace_Category}
                    </span>
                  </p>

                  <p className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-gray-500 mr-1">Sức chứa:</span>
                    <span className="font-medium">
                      {selectedTransaction.workspace_Capacity} người
                    </span>
                  </p>

                  <p className="flex items-center">
                    <Ruler className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-gray-500 mr-1">Diện tích:</span>
                    <span className="font-medium">
                      {selectedTransaction.workspace_Area} m²
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Services */}
            <div className="space-y-4 mb-6">
              <h3 className="font-medium text-base flex items-center text-gray-700">
                <Coffee className="mr-2 h-5 w-5 text-primary" /> Dịch vụ kèm
                theo
              </h3>

              <div className="bg-gray-50 rounded-xl p-4">
                {selectedTransaction.bookingHistoryAmenities.length === 0 &&
                selectedTransaction.bookingHistoryBeverages.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Không có dịch vụ kèm theo
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedTransaction.bookingHistoryAmenities.length > 0 && (
                      <div>
                        <p className="font-medium text-sm mb-2 text-gray-700">
                          Tiện ích
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedTransaction.bookingHistoryAmenities.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-white p-2 rounded-lg shadow-sm"
                              >
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-md object-cover mr-3"
                                />
                                <div>
                                  <p className="font-medium text-sm">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {item.quantity} x{" "}
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(item.unitPrice)}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {selectedTransaction.bookingHistoryBeverages.length > 0 && (
                      <div>
                        <p className="font-medium text-sm mb-2 text-gray-700">
                          Đồ uống
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedTransaction.bookingHistoryBeverages.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-white p-2 rounded-lg shadow-sm"
                              >
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-md object-cover mr-3"
                                />
                                <div>
                                  <p className="font-medium text-sm">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {item.quantity} x{" "}
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(item.unitPrice)}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Total Price */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">
                  Tổng tiền:
                </span>
                <span className="text-xl font-bold text-primary">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(selectedTransaction.booking_Price)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TransactionDetailsModal;
