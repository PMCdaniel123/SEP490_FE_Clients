/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Share2,
  Eye,
  X,
  ShieldEllipsis,
  Boxes,
  Archive,
  HandPlatter,
} from "lucide-react";
import Loader from "@/components/loader/Loader";
import { useParams } from "next/navigation";
import HighRatingSpace from "@/components/high-rating-space/high-rating-space";
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

interface Workspace {
  id: string;
  title: string;
  address: string;
  price: string;
  image: string;
  roomCapacity: number;
  roomType: string;
  roomSize: number;
  description: string;
}

const WorkspaceDetail = () => {
  const { workspaceId } = useParams() as { workspaceId: string };
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shortTerm, setShortTerm] = useState("1");

  useEffect(() => {
    if (!workspaceId) return;

    fetch(
      `https://67271c49302d03037e6f6a3b.mockapi.io/spaceList/${workspaceId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setWorkspace(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [workspaceId]);

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
                {workspace.title}
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
            roomCapacity={workspace.roomCapacity}
            roomSize={workspace.roomSize}
            roomType={workspace.roomType}
          />

          <div>
            <h2 className="text-xl font-bold text-primary mb-6">
              Mô tả chi tiết
            </h2>
            <p className="text-fifth">
              Tạo không gian làm việc riêng biệt với Dedicated Desk – chỗ ngồi
              cố định dành riêng cho bạn hoặc nhóm nhỏ trong không gian
              coworking chuyên nghiệp. Với Dedicated Desk, bạn sẽ có một môi
              trường làm việc yên tĩnh, riêng tư và đầy đủ tiện nghi, giúp bạn
              tập trung hoàn toàn vào công việc của mình.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary flex gap-4">
              <Archive size={28} /> <span>Cơ sở vật chất</span>
            </h2>
            <FacilitiesList />
            {/* <button className="text-fourth border border-1 border-primary rounded-xl py-4 font-semibold md:max-w-[250px] hover:bg-primary hover:text-white transition-colors duration-300">
              Hiển thị Menu dịch vụ
            </button> */}
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-6 flex gap-4">
              <ShieldEllipsis size={28} /> <span>Quy định chung</span>
            </h2>
            <PoliciesList />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-6 flex gap-4">
              <Boxes size={28} /> <span>Các tiện ích đi kèm</span>
            </h2>
            <AmenitiesList />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-6 flex gap-4">
              <HandPlatter size={28} /> <span>Thực đơn</span>
            </h2>
            <BeveragesList />
          </div>

          <GoogleMap />

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary">
              Các không gian tương tự
            </h2>
            <div>
              <HighRatingSpace />
            </div>
            {/* <button className="text-fourth border border-1 border-primary rounded-xl py-4 font-semibold md:max-w-[250px] hover:bg-primary hover:text-white transition-colors duration-300">
              Hiển thị trên bản đồ
            </button> */}
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary">
              Đánh giá từ khách hàng
            </h2>
            <ReviewList />
          </div>
        </div>

        {!isOpen && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="fixed right-4 bottom-4 bg-primary text-white p-4 rounded-full shadow-lg z-50 transition-transform hover:scale-110"
          >
            <Eye size={24} />
          </button>
        )}

        <div
          className={`fixed md:min-w-[400px] right-0 top-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl border transition-all duration-300 transform z-50 ${
            isOpen ? "translate-x-0 right-8" : "translate-x-full"
          } flex flex-col`}
        >
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-fourth">$1 - $20</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={24} />
              </button>
            </div>
            <Separator className="my-6" />
            <p className="text-fifth text-sm">
              Thuê theo giờ: $1 <br />
              Thuê theo ngày: $20
            </p>
            <Separator className="my-6" />
            <div>
              <RadioGroup
                defaultValue={shortTerm}
                onValueChange={(value) => setShortTerm(value)}
                className="flex flex-col gap-2 my-2"
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

              <Button className="w-full py-6 bg-primary text-white font-semibold rounded-lg text-base mt-4">
                Đặt Ngay
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        title="Chia sẻ liên kết"
        open={isShareModalOpen}
        onCancel={() => setIsShareModalOpen(false)}
        footer={null}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-full p-4 border rounded-lg shadow-md">
            <img
              src={workspace.image}
              alt={workspace.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-bold">{workspace.title}</h3>
            <p className="text-sm text-gray-500">{workspace.address}</p>
            <p className="text-sm text-gray-500">{workspace.price}</p>
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
    </div>
  );
};

export default WorkspaceDetail;
