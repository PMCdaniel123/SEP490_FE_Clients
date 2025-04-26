/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores";
import Beverage from "@/components/beverages-list/beverage";
import Amenity from "@/components/amenities-list/amenity";
import { Label } from "@/components/ui/label";
import Loader from "@/components/loader/Loader";
import { useRouter } from "next/navigation";
import { Price, Promotion, Workspace } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { paymentMethods } from "@/constants/constant";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { clearBeverageAndAmenity, clearCart } from "@/stores/slices/cartSlice";
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { LoadingOutlined } from "@ant-design/icons";
import { BASE_URL } from "@/constants/environments";
import { notificationEvents } from "@/components/ui/notification";
import SectionTitle from "@/components/ui/section-tilte";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "dayjs/locale/vi";
import Cookies from "js-cookie";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("vi");

interface CheckoutDiscount {
  code: string;
  discount: number;
}

export default function Checkout() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const {
    beverageList,
    amenityList,
    total,
    startTime,
    endTime,
    workspaceId,
    category,
  } = useSelector((state: RootState) => state.cart);
  const { customer } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [voucherCode, setVoucherCode] = useState<CheckoutDiscount | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const cart =
    typeof window !== "undefined" ? localStorage.getItem("cart") : null;
  const token = typeof window !== "undefined" ? Cookies.get("token") : null;
  const google_token =
    typeof window !== "undefined" ? Cookies.get("google_token") : null;

  const fetchPromotions = async ({ workspaceId }: { workspaceId: string }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/workspaces/${workspaceId}/promotions`
      );
      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi tải thông tin mã giảm giá.");
      }
      const data = await response.json();
      const now = dayjs();
      const formattedDate = (
        Array.isArray(data.promotions) ? data.promotions : []
      ).filter((item: Promotion) => {
        const startDate = dayjs(item.startDate);
        const endDate = dayjs(item.endDate);

        const isValidTime =
          startDate.isValid() &&
          endDate.isValid() &&
          startDate.isSameOrBefore(now, "date") &&
          endDate.isSameOrAfter(now, "date") &&
          item.status === "Active";

        return isValidTime;
      });
      setPromotions(formattedDate);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (!workspaceId) return;

    const fetchWorkspace = async () => {
      try {
        const response = await fetch(`${BASE_URL}/workspaces/${workspaceId}`);

        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải thông tin không gian.");
        }

        const data = await response.json();
        setWorkspace({
          ...data.getWorkSpaceByIdResult,
          shortTermPrice:
            data.getWorkSpaceByIdResult.prices.find(
              (price: Price) => price.category === "Giờ"
            )?.price || 0,
          longTermPrice:
            data.getWorkSpaceByIdResult.prices.find(
              (price: Price) => price.category === "Ngày"
            )?.price || 0,
        });
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Đã xảy ra lỗi!";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
      }
    };

    fetchWorkspace();
    fetchPromotions({ workspaceId });
  }, [dispatch, workspaceId]);

  useEffect(() => {
    if (!customer) {
      router.push(`/workspace/${workspaceId}`);
    }
    if (cart === null) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [customer, cart, router, workspaceId]);

  const onCheckout = async () => {
    if (paymentMethod === "2") {
      setIsConfirmationOpen(true);
      return;
    }

    setIsProcessing(true);
    await proceedCheckout();
  };

  const checkOverlapTime = async () => {
    setIsProcessing(true);
    const response = await fetch(
      `${BASE_URL}/users/booking/checktimesoverlap`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || google_token}`,
        },
        body: JSON.stringify({
          workspaceId: workspaceId,
          startDate: startTime,
          endDate: endTime,
        }),
      }
    );

    if (response.status === 401) {
      router.push("/unauthorized");
      throw new Error("Bạn không được phép truy cập!");
    } else if (!response.ok) {
      throw new Error("Khoảng thời gian đã được sử dụng");
    }

    const data = await response.json();
    if (data === "Khoảng thời gian đã được sử dụng") {
      throw new Error("Khoảng thời gian đã được sử dụng");
    }

    if (
      data ===
      "Thời gian đặt phải trong cùng một ngày và trong giờ mở cửa của workspace"
    ) {
      throw new Error(
        "Thời gian đặt phải trong cùng một ngày và trong giờ mở cửa của workspace"
      );
    }
    setIsProcessing(false);
    return true;
  };

  const proceedCheckout = async () => {
    setIsProcessing(true);
    const amenitiesRequest = amenityList.map((amenity) => ({
      id: amenity.id,
      quantity: amenity.quantity,
    }));
    const beveragesRequest = beverageList.map((beverage) => ({
      id: beverage.id,
      quantity: beverage.quantity,
    }));
    const request = {
      userId: Number(customer?.id),
      workspaceId: workspaceId,
      startDate: startTime,
      endDate: endTime,
      amenities: amenitiesRequest,
      beverages: beveragesRequest,
      promotionCode: voucherCode?.code,
      price: total,
      workspaceTimeCategory: category,
    };

    try {
      await checkOverlapTime();
      const apiUrl =
        paymentMethod === "2"
          ? `${BASE_URL}/users/bookingbyworkhivewallet`
          : `${BASE_URL}/users/booking`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || google_token}`,
        },
        body: JSON.stringify(request),
      });

      if (response.status === 401) {
        router.push("/unauthorized");
        throw new Error("Bạn không được phép truy cập!");
      }

      const data = await response.json();

      // Check for wallet lock error in the successful response
      if (
        data &&
        data.notification === "Ví của bạn đã bị khóa" &&
        data.isLock === 1
      ) {
        throw new Error(
          "Ví của bạn hiện đang bị khóa do thực hiện yêu cầu rút tiền"
        );
      }
      if (paymentMethod === "2") {
        toast.success("Thanh toán thành công bằng WorkHive Wallet!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        const event = new CustomEvent(notificationEvents.BOOKING_SUCCESS);
        window.dispatchEvent(event);
        router.push("/success");
        dispatch(clearCart());
      } else {
        const bookingData = {
          bookingId: data.bookingId,
          orderCode: data.orderCode,
        };
        localStorage.setItem("order", JSON.stringify(bookingData));
        router.push(data.checkoutUrl);
        dispatch(clearCart());
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearBeverageAndAmenity = () => {
    dispatch(clearBeverageAndAmenity());
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  if (
    customer &&
    (customer.phone === null ||
      customer.phone === "" ||
      customer.phone === undefined)
  ) {
    toast.error("Vui lọng cập nhật sđt trước khi tiến hành thanh toán", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      theme: "light",
    });
    window.location.href = "/profile";
  }

  return (
    <div className="mx-auto pt-10 pb-20 grid grid-cols-1 md:grid-cols-5 gap-12 w-full md:w-[90%] px-6">
      <div className="md:col-span-3 flex flex-col gap-8">
        <div>
          <SectionTitle>Thanh toán</SectionTitle>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border flex flex-col gap-8">
          <h3 className="text-lg font-semibold">Thông tin người đặt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col w-full border rounded-md h-full justify-center px-6 py-3 relative">
              <p className="text-xs font-medium text-sixth absolute -top-2 left-5 bg-white px-4">
                Họ và tên
              </p>
              <input
                type="text"
                className="py-2 focus:outline-none text-sm"
                placeholder="Nhập họ và tên"
                value={customer?.fullName ? customer?.fullName : ""}
                disabled
              />
            </div>
            <div className="flex flex-col w-full border rounded-md h-full justify-center px-6 py-3 relative">
              <p className="text-xs font-medium text-sixth absolute -top-2 left-5 bg-white px-4">
                Email
              </p>
              <input
                type="email"
                className="py-2 focus:outline-none text-sm"
                placeholder="Nhập email"
                value={customer?.email ? customer?.email : ""}
                disabled
              />
            </div>
            <div className="flex flex-col w-full border rounded-md h-full justify-center px-6 py-3 relative">
              <p className="text-xs font-medium text-sixth absolute -top-2 left-5 bg-white px-4">
                Số điện thoại
              </p>
              <input
                type="text"
                className="py-2 focus:outline-none text-sm"
                placeholder="Nhập số điện thoại"
                value={customer?.phone ? customer?.phone : ""}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Mã khuyến mãi</h3>
          </div>
          <Select
            onValueChange={(value) =>
              setVoucherCode({
                code: value.split(" - ")[0],
                discount: Number(value.split(" - ")[1]),
              })
            }
          >
            <SelectTrigger className="py-6 px-4 rounded-md">
              <SelectValue placeholder="Chọn mã khuyến mãi" />
            </SelectTrigger>
            <SelectContent>
              {promotions?.length > 0 ? (
                promotions?.map((promotion) => (
                  <SelectItem
                    key={promotion.id}
                    className="rounded-sm flex flex-row items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                    value={promotion.code + " - " + promotion.discount}
                  >
                    <span>
                      {promotion.code} - (Giảm giá {promotion.discount}%)
                    </span>
                    <span className="text-xs ml-2 hidden md:inline">
                      ({dayjs(promotion.startDate).format("HH:mm DD/MM/YYYY")} -{" "}
                      {dayjs(promotion.endDate).format("HH:mm DD/MM/YYYY")})
                    </span>
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-gray-500 text-sm text-center">
                  Không có mã khuyến mãi nào
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border flex flex-col gap-8">
          <h3 className="text-lg font-semibold">Phương thức thanh toán</h3>
          <RadioGroup
            defaultValue={paymentMethod}
            onValueChange={(value) => {
              setPaymentMethod(value);
            }}
            className="flex flex-col gap-4 my-2"
          >
            {paymentMethods.map((method, index) => (
              <div className="flex items-center space-x-2 gap-2" key={index}>
                <RadioGroupItem
                  value={method.value}
                  id={`payment-method-${index}`}
                />
                <Image
                  src={method.image}
                  width={80}
                  height={80}
                  alt={method.label}
                />
                <Label htmlFor={`payment-method-${index}`}>
                  {method.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="bg-white border p-4 rounded-lg h-fit sticky top-6 shadow-lg flex flex-col gap-4 col-span-1 md:col-span-2">
        <div className="flex flex-col mt-4">
          <h3 className="text-lg font-semibold text-primary">
            {workspace?.name}
          </h3>
          <p className="text-fifth text-xs">{workspace?.address}</p>
        </div>
        <div className="my-2 flex items-center gap-4 border p-4 rounded-lg shadow-md">
          <img
            src={workspace?.images[0].imgUrl}
            alt="Table"
            className="rounded-lg object-cover w-24 h-24 border"
          />
          <div>
            <p className="text-fourth text-sm">Loại: {workspace?.category}</p>
            <p className="text-fourth text-sm">
              Diện tích: {workspace?.area} m²
            </p>
            <p className="text-fourth text-sm">
              Sức chứa: {workspace?.capacity} người
            </p>
          </div>
        </div>
        <div className="flex flex-col text-fourth text-sm font-medium gap-2">
          <p>
            Thời gian bắt đầu:{" "}
            <span className="text-primary font-semibold">{startTime}</span>
          </p>
          <p>
            Thời gian kết thúc:{" "}
            <span className="text-primary font-semibold">{endTime}</span>
          </p>
        </div>
        <div className="border mt-8 text-fourth gap-2 flex flex-col p-4 rounded-lg">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Giảm giá:</span>
            {voucherCode && (
              <span className="font-semibold">
                - {formatCurrency(total * ((voucherCode?.discount || 0) / 100))}
              </span>
            )}
          </div>
          <div className="flex justify-between text-lg font-bold text-primary">
            <span>Tổng cộng:</span>
            <span>
              {formatCurrency(total * (1 - (voucherCode?.discount || 0) / 100))}
            </span>
          </div>
        </div>
        {beverageList.length + amenityList.length > 0 && (
          <div className="flex flex-col gap-2 my-8">
            {beverageList.length + amenityList.length > 1 && (
              <p
                className="text-red-500 flex justify-end cursor-pointer hover:text-red-300"
                onClick={handleClearBeverageAndAmenity}
              >
                Xóa tất cả
              </p>
            )}
            {beverageList.length > 0 && (
              <div>
                <Label className="mb-2">Thực đơn:</Label>
                {beverageList.map((item) => (
                  <Beverage key={item.id} item={item} />
                ))}
              </div>
            )}
            {amenityList.length > 0 && (
              <div>
                <Label className="mb-2">Các tiện ích:</Label>
                {amenityList.map((item) => (
                  <Amenity key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
        <Button
          onClick={onCheckout}
          className="w-full bg-primary hover:bg-secondary text-white py-5 mt-5 rounded-lg font-semibold"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <LoadingOutlined style={{ color: "white" }} />
          ) : (
            "THANH TOÁN"
          )}
        </Button>
        <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">
                Xác nhận thanh toán
              </DialogTitle>
            </DialogHeader>
            <div className="my-6">
              <p className="text-center mb-4 font-medium">
                Bạn có chắc chắn muốn thanh toán bằng{" "}
                <span className="text-primary font-bold">WorkHive Wallet</span>?
              </p>
              <p className="text-center text-sm text-gray-500">
                Số tiền thanh toán:{" "}
                <span className="text-primary font-bold">
                  {formatCurrency(
                    total * (1 - (voucherCode?.discount || 0) / 100)
                  )}
                </span>
              </p>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                className="flex-1 text-white"
                onClick={async () => {
                  setIsConfirmationOpen(false);
                  await proceedCheckout();
                }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <LoadingOutlined style={{ color: "white" }} />
                ) : (
                  "Xác nhận"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsConfirmationOpen(false)}
                className="flex-1"
              >
                Hủy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ToastContainer />
    </div>
  );
}
