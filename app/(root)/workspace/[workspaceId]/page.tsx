/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Share2,
  ShieldEllipsis,
  Boxes,
  Archive,
  HandPlatter,
} from "lucide-react";
import Loader from "@/components/loader/Loader";
import { useParams, useRouter } from "next/navigation";
// import HighRatingSpace from "@/components/high-rating-space/high-rating-space";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Modal } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import TimeSelect from "@/components/selection/time-select";
import DateSelect from "@/components/selection/date-select";
import GoogleMap from "@/components/google-map/google-map";
import DetailsList from "@/components/details-list/details-list";
import FacilitiesList from "@/components/facilities-list/facilities-list";
import ReviewList from "@/components/review-list/review-list";
import PoliciesList from "@/components/policies-list/policies-list";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ImageList from "@/components/images-list/images-list";
import AmenitiesList from "@/components/amenities-list/amenities-list";
import BeveragesList from "@/components/beverages-list/beverages-list";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores";
import {
  clearBeverageAndAmenity,
  clearWorkspaceTime,
  setWorkspaceId,
} from "@/stores/slices/cartSlice";
import Amenity from "@/components/amenities-list/amenity";
import Beverage from "@/components/beverages-list/beverage";
import TimeList from "@/components/selection/time-list";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";

interface Image {
  id: string;
  imgUrl: string;
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  shortTermPrice: string;
  longTermPrice: string;
  images: Image[];
  capacity: number;
  category: string;
  area: number;
  address: string;
}

const WorkspaceDetail = () => {
  const { workspaceId } = useParams() as { workspaceId: string };
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isBeverageOpen, setIsBeverageOpen] = useState(false);
  const [isTimeListOpen, setIsTimeListOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [shortTerm, setShortTerm] = useState("1");
  const router = useRouter();
  const dispatch = useDispatch();
  const { beverageList, amenityList, total, startTime, endTime } = useSelector(
    (state: RootState) => state.cart
  );

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
          address: "HCM",
          shortTermPrice: data.prices[0].price,
          longTermPrice: data.prices[1].price,
        });
        dispatch(
          setWorkspaceId({
            id: workspaceId,
            price:
              shortTerm === "1"
                ? Number(data.prices[0].price)
                : Number(data.prices[1].price),
            priceType: shortTerm,
          })
        );
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
  }, [dispatch, workspaceId, shortTerm]);

  const handleClearBeverageAndAmenity = () => {
    dispatch(clearBeverageAndAmenity());
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleCopyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        alert("Sao chép liên kết thành công!");
      },
      (error) => {
        console.error("Error copying URL", error);
      }
    );
  };

  const handleSelectedDateValidte = async () => {
    if (startTime === "" || endTime === "") {
      toast.error("Vui lòng chọn thời gian!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "dark",
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
              workspaceId,
              startDate: startTime,
              endDate: endTime,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Thời gian không khả dụng.");
        }
        setIsButtonLoading(false);
        router.push("/checkout");
      } catch {
        toast.error("Không thể đặt thời gian sau 23h.", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "dark",
        });
        setIsButtonLoading(false);
      }
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

  if (!workspace) {
    return <div className="text-center">Workspace not found</div>;
  }

  return (
    <div className="flex flex-col container mx-auto px-10 py-8 gap-20">
      <ImageList workspace={workspace} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-primary">
                {workspace.name}
              </h1>
              <p className="text-fifth max-w-xl">{workspace.address}</p>
            </div>
            <div className="flex items-center justify-center gap-8 text-primary">
              <Heart size={32} />
              <Share2
                size={32}
                onClick={handleShare}
                className="cursor-pointer"
              />
            </div>
          </div>

          <DetailsList
            roomCapacity={workspace.capacity}
            roomSize={workspace.area}
            roomType={workspace.category}
          />

          <div>
            <h2 className="text-xl font-bold text-primary mb-6">
              Mô tả chi tiết
            </h2>
            <p className="text-fifth">{workspace.description}</p>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary flex gap-4">
              <Archive size={28} /> <span>Cơ sở vật chất</span>
            </h2>
            <FacilitiesList />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-6 flex gap-4">
              <ShieldEllipsis size={28} /> <span>Quy định chung</span>
            </h2>
            <PoliciesList />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-6 flex gap-4">
              <Boxes size={28} /> <span>Tiện ích</span>
            </h2>
            <AmenitiesList workspaceId={workspaceId} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-6 flex gap-4">
              <HandPlatter size={28} /> <span>Thực đơn</span>
            </h2>
            <button
              className="text-fourth border border-1 border-primary rounded-xl p-4 font-semibold md:max-w-[250px] hover:bg-primary hover:text-white transition-colors duration-300"
              onClick={() => setIsBeverageOpen(true)}
            >
              Hiển thị Menu dịch vụ
            </button>
          </div>

          <GoogleMap />

          {/* <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary">
              Các không gian tương tự
            </h2>
            <div>
              <HighRatingSpace />
            </div>
          </div> */}

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary">
              Đánh giá từ khách hàng
            </h2>
            <ReviewList />
          </div>
        </div>

        <div className="flex flex-col p-4 bg-white border rounded-xl shadow-xl w-full max-w-full h-fit lg:sticky lg:top-4 lg:max-h-[90vh] overflow-auto">
          <div>
            <div className="flex justify-between items-center mt-4">
              <h2 className="text-2xl font-bold text-fourth">
                {formatCurrency(Number(workspace.shortTermPrice))} -{" "}
                {formatCurrency(Number(workspace.longTermPrice))}
              </h2>
            </div>
            <Separator className="my-6" />
            <p className="text-fifth text-sm">
              Thuê theo giờ: {Number(workspace.shortTermPrice)} <br />
              Thuê theo ngày: {formatCurrency(Number(workspace.longTermPrice))}
            </p>
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
                    id: workspaceId,
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
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="short-term" />
                <Label htmlFor="short-term">Thuê theo giờ</Label>
              </div>
              {shortTerm === "1" && <TimeSelect />}
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
              disabled={startTime === "" || endTime === ""}
            >
              {isButtonLoading ? (
                <LoadingOutlined style={{ color: "white" }} />
              ) : (
                "Đặt ngay"
              )}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title={
          <p className="text-xl font-bold text-primary">Chia sẻ liên kết</p>
        }
        open={isShareModalOpen}
        onCancel={() => setIsShareModalOpen(false)}
        footer={null}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-full p-4 border rounded-lg shadow-md">
            <img
              src={workspace.images[0].imgUrl}
              alt={workspace.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-bold">{workspace.name}</h3>
            <p className="text-sm text-gray-500">{workspace.address}</p>
            <p className="text-sm text-gray-500">
              {formatCurrency(Number(workspace.shortTermPrice))} -{" "}
              {formatCurrency(Number(workspace.longTermPrice))}
            </p>
          </div>
          <Button
            onClick={handleCopyUrl}
            className=" text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Share2 size={20} />
            Sao chép liên kết
          </Button>
          <div className="flex items-center gap-2">
            <Separator className="w-10" />
            <span className="text-gray-500">HOẶC</span>
            <Separator className="w-10" />
          </div>
          <div className="flex gap-4">
            <FacebookShareButton url={window.location.href}>
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            <TwitterShareButton url={window.location.href}>
              <TwitterIcon size={40} round />
            </TwitterShareButton>
            <LinkedinShareButton url={window.location.href}>
              <LinkedinIcon size={40} round />
            </LinkedinShareButton>
          </div>
        </div>
      </Modal>

      <Modal
        title={<p className="text-xl font-bold text-primary">Thực đơn</p>}
        open={isBeverageOpen}
        onCancel={() => setIsBeverageOpen(false)}
        footer={null}
      >
        <BeveragesList workspaceId={workspaceId} />
      </Modal>

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
        <TimeList workspaceId={workspaceId} />
      </Modal>
    </div>
  );
};

export default WorkspaceDetail;
