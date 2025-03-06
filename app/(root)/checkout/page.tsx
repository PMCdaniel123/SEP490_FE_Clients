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
import { Workspace } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { paymentMethods, promotionList } from "@/constants/constant";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";

export default function Checkout() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const { beverageList, amenityList, total, startTime, endTime, workspaceId } =
    useSelector((state: RootState) => state.cart);
  const { customer } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [voucherCode, setVoucherCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");

  useEffect(() => {
    if (!workspaceId) return;

    const fetchWorkspace = async () => {
      try {
        const response = await fetch(
          `https://localhost:5050/workspaces/${workspaceId}`
        );

        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải thông tin không gian.");
        }

        const data = await response.json();
        setWorkspace({
          ...data,
          shortTermPrice: data.prices[0].price,
          longTermPrice: data.prices[1].price,
        });
        setLoading(false);
      } catch {
        toast.error("Có lỗi xảy ra khi tải thông tin không gian.", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "dark",
        });
      }
    };

    fetchWorkspace();
  }, [dispatch, workspaceId]);

  useEffect(() => {
    if (!customer) {
      router.push("/");
    }
    if (!startTime || !endTime || startTime === "" || endTime === "") {
      router.push("/workspace");
    }
  }, [customer, endTime, router, startTime]);

  const onCheckout = async () => {
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
      promotionCode: "",
      price: total,
    };

    try {
      const response = await fetch("https://localhost:5050/users/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      const data = await response.json();
      console.log(data);
      router.push(data.checkoutUrl);
    } catch {
      toast.error("Có lỗi xảy ra khi thanh toán.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "dark",
      });
    }
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

  return (
    <div className="mx-auto px-10 py-8 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl">
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-primary">Thanh toán</h2>

        <div className="bg-white p-6 rounded-lg shadow-lg border flex flex-col gap-8">
          <h3 className="text-lg font-semibold">Thông tin người đặt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col w-full border rounded-md h-full justify-center px-6 py-3 relative">
              <p className="text-xs font-medium text-sixth absolute -top-2 left-5 bg-white px-4">
                Họ và tên
              </p>
              <input
                type="text"
                className="py-2 focus:outline-none"
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
                className="py-2 focus:outline-none"
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
                className="py-2 focus:outline-none"
                placeholder="Nhập số điện thoại"
                value={customer?.phone ? customer?.phone : ""}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border flex flex-col gap-8">
          <h3 className="text-lg font-semibold">Mã khuyến mãi</h3>
          <Select onValueChange={(value) => setVoucherCode(value)}>
            <SelectTrigger className="py-6 px-4 rounded-md">
              <SelectValue placeholder="Chọn mã khuyến mãi" />
            </SelectTrigger>
            <SelectContent>
              {promotionList.map((promotion) => (
                <SelectItem
                  key={promotion.id}
                  className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                  value={promotion.code}
                >
                  {promotion.code} - (Giảm giá {promotion.discount}%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg shadow-lg border flex flex-col gap-8">
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
                <RadioGroupItem value={method.value} id="long-term" />
                <Image
                  src={method.image}
                  width={100}
                  height={100}
                  alt={method.label}
                />
                <Label htmlFor="long-term">{method.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="bg-white border p-4 rounded-lg h-fit sticky top-6 shadow-lg flex flex-col gap-4">
        <div className="flex flex-col mt-4">
          <h3 className="text-lg font-semibold">{workspace?.name}</h3>
          <p className="text-fifth italic text-sm">{workspace?.address}</p>
        </div>
        <div className="my-2 flex items-center gap-2">
          <img
            src={workspace?.images[0].imgUrl}
            alt="Table"
            className="rounded-lg object-cover w-24 h-24 border"
          />
          <div>
            <p className="text-fifth text-sm">Loại: {workspace?.category}</p>
            <p className="text-fifth text-sm">Diện tích: {workspace?.area}</p>
          </div>
        </div>
        <div className="flex flex-col text-fifth text-sm">
          <p>Thời gian bắt đầu: {startTime}</p>
          <p>Thời gian kết thúc: {endTime}</p>
        </div>
        <div className="border mt-8 text-fourth gap-2 flex flex-col p-4 rounded-lg">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Mã giảm giá:</span>
            <span className="font-semibold">{voucherCode}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-primary">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 my-8">
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
        <Button
          onClick={onCheckout}
          className="w-full bg-primary hover:bg-secondary text-white py-5 mt-5 rounded-lg font-semibold"
        >
          THANH TOÁN
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
}
