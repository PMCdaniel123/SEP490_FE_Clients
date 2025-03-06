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
import { useParams } from "next/navigation";
// import HighRatingSpace from "@/components/high-rating-space/high-rating-space";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Modal } from "antd";
import "react-datepicker/dist/react-datepicker.css";
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
import ImageList from "@/components/images-list/images-list";
import AmenitiesList from "@/components/amenities-list/amenities-list";
import BeveragesList from "@/components/beverages-list/beverages-list";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import WorkspaceDetailSidebar from "@/components/layout/workspace-detail-sidebar";
import { Workspace } from "@/types";

const WorkspaceDetail = () => {
  const { workspaceId } = useParams() as { workspaceId: string };
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isBeverageOpen, setIsBeverageOpen] = useState(false);
  const dispatch = useDispatch();

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

          <GoogleMap url={workspace.googleMapUrl} />

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
          <WorkspaceDetailSidebar workspace={workspace} />
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
    </div>
  );
};

export default WorkspaceDetail;
