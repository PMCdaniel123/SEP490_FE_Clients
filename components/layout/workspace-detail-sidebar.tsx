"use client";

import { RootState } from "@/stores";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  clearBeverageAndAmenity,
  clearWorkspaceTime,
  setWorkspaceId,
} from "@/stores/slices/cartSlice";
import { Label } from "../ui/label";
import TimeSelect from "../selection/time-select";
import DateSelect from "../selection/date-select";
import Beverage from "../beverages-list/beverage";
import Amenity from "../amenities-list/amenity";
import { Button } from "../ui/button";
import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import TimeList from "../selection/time-list";
import { Workspace } from "@/types";
import Time24hSelect from "../selection/time-24h-select";
import { Clock, Clock10, Clock5 } from "lucide-react";

function WorkspaceDetailSidebar({ workspace }: { workspace: Workspace }) {
  const { beverageList, amenityList, total, startTime, endTime } = useSelector(
    (state: RootState) => state.cart
  );
  const { customer } = useSelector((state: RootState) => state.auth);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [shortTerm, setShortTerm] = useState("1");
  const [isTimeListOpen, setIsTimeListOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setWorkspaceId({
        id: workspace.id,
        price:
          shortTerm === "1"
            ? Number(workspace.shortTermPrice)
            : Number(workspace.longTermPrice),
        priceType: shortTerm,
      })
    );
  }, [dispatch, workspace, shortTerm]);

  const handleSelectedDateValidte = async () => {
    if (startTime === "" || endTime === "") {
      toast.error("Vui lòng chọn thời gian!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "light",
      });
      return;
    }
    if (startTime !== "" && endTime !== "") {
      setIsButtonLoading(true);
      try {
        const response = await fetch(
          `https://localhost:5050/users/booking/checktimesoverlap`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              workspaceId: workspace.id,
              startDate: startTime,
              endDate: endTime,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Thời gian không khả dụng.");
        }
        const data = await response.json();
        if (data === "Time interval has been used") {
          throw new Error("Thời gian không khả dụng.");
        }
        const cartData = {
          workspaceId: workspace.id,
          beverageList,
          amenityList,
          total,
          startTime,
          endTime,
        };
        localStorage.setItem("cart", JSON.stringify(cartData));
        setIsButtonLoading(false);
        router.push("/checkout");
      } catch {
        toast.error("Thời gian không khả dụng.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
        setIsButtonLoading(false);
      }
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

  return (
    <div>
      <div className="flex justify-between items-center mt-4">
        <h2 className="text-2xl font-bold text-fourth">
          {formatCurrency(Number(workspace.shortTermPrice))} -{" "}
          {formatCurrency(Number(workspace.longTermPrice))}
        </h2>
      </div>
      <Separator className="my-6" />
      <div>
        <p className="text-fifth text-sm">
          Thuê theo giờ: {formatCurrency(Number(workspace.shortTermPrice))}{" "}
          <br />
          Thuê theo ngày: {formatCurrency(Number(workspace.longTermPrice))}
        </p>
        <Separator className="my-6" />
      </div>
      {workspace.is24h !== 1 ? (
        <div className="flex flex-col gap-2">
          <p className="text-primary text-base flex items-center gap-2">
            <Clock5 /> Mở cửa lúc: {workspace.openTime}
          </p>
          <p className="text-primary text-base flex items-center gap-2">
            <Clock10 /> Đóng cửa lúc: {workspace.closeTime}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-primary text-base flex items-center gap-2">
            <Clock /> Mở cửa 24h
          </p>
        </div>
      )}
      <Separator className="my-6" />
      <div
        className="text-primary flex flex-col items-end cursor-pointer hover:text-secondary mb-6 text-sm font-bold"
        onClick={() => setIsTimeListOpen(true)}
      >
        <p className="break-words">Xem danh sách thời gian</p>
        <p className="break-words">không khả dụng</p>
      </div>
      <RadioGroup
        defaultValue={shortTerm}
        onValueChange={(value) => {
          setShortTerm(value);
          dispatch(clearWorkspaceTime());
          dispatch(
            setWorkspaceId({
              id: workspace.id,
              price:
                value === "1"
                  ? Number(workspace.shortTermPrice)
                  : Number(workspace.longTermPrice),
              priceType: value,
            })
          );
        }}
        className="flex flex-col gap-4 my-2"
      >
        {workspace.is24h !== 1 && (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="short-term" />
            <Label htmlFor="short-term">Thuê theo giờ</Label>
          </div>
        )}
        {workspace.is24h !== 1 && shortTerm === "1" && <TimeSelect />}
        {workspace.is24h === 1 && (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="short-term" />
            <Label htmlFor="short-term">Thuê theo 24 giờ</Label>
          </div>
        )}
        {workspace.is24h === 1 && shortTerm === "1" && <Time24hSelect />}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="2" id="long-term" />
          <Label htmlFor="long-term">Thuê theo ngày</Label>
        </div>
        {shortTerm === "2" && <DateSelect />}
      </RadioGroup>
      <div className="flex flex-col gap-2 my-4">
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
            <Separator className="mb-6 mt-2" />
            <Label className="mb-2">Thực đơn:</Label>
          </div>
        )}
        {beverageList.map((item) => (
          <Beverage key={item.id} item={item} />
        ))}
        {amenityList.length > 0 && (
          <div>
            <Separator className="mb-6 mt-2" />
            <Label className="mb-2">Các tiện ích:</Label>
          </div>
        )}
        {amenityList.map((item) => (
          <Amenity key={item.id} item={item} />
        ))}
      </div>
      {startTime !== "" && endTime !== "" && (
        <p className="text-base font-medium">
          Tổng tiền: {formatCurrency(total)}
        </p>
      )}
      <Separator className="my-6" />
      <Button
        className="w-full py-6 bg-primary text-white font-semibold rounded-lg text-base"
        onClick={handleSelectedDateValidte}
        disabled={startTime === "" || endTime === "" || customer === null}
      >
        {isButtonLoading ? (
          <LoadingOutlined style={{ color: "white" }} />
        ) : (
          "Đặt ngay"
        )}
      </Button>
      <Modal
        title={
          <p className="text-xl font-bold text-primary">
            Danh sách thời gian không khả dụng
          </p>
        }
        open={isTimeListOpen}
        onCancel={() => setIsTimeListOpen(false)}
        footer={null}
      >
        <TimeList workspaceId={workspace.id} />
      </Modal>
    </div>
  );
}

export default WorkspaceDetailSidebar;
