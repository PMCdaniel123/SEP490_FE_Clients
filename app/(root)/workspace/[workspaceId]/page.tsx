/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import {
  Share2,
  ShieldEllipsis,
  Boxes,
  Archive,
  HandPlatter,
  Delete,
  Phone,
  Globe,
  Facebook,
  Instagram,
  AlertTriangle,
  Home,
} from "lucide-react";
import Loader from "@/components/loader/Loader";
import { useParams, useRouter } from "next/navigation";
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
import { TikTokOutlined } from "@ant-design/icons";
import ImageList from "@/components/images-list/images-list";
import AmenitiesList from "@/components/amenities-list/amenities-list";
import BeveragesList from "@/components/beverages-list/beverages-list";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import WorkspaceDetailSidebar from "@/components/layout/workspace-detail-sidebar";
import { OwnerProps, Price, Workspace } from "@/types";
import SimilarSpace from "@/components/similar-space/similar-space";
import { clearCart } from "@/stores/slices/cartSlice";
import { BASE_URL } from "@/constants/environments";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import MoreDetailList from "@/components/details-list/more-detail-list";
import { motion } from "framer-motion";

const WorkspaceDetail = () => {
  const { workspaceId } = useParams() as { workspaceId: string };
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isBeverageOpen, setIsBeverageOpen] = useState(false);
  const dispatch = useDispatch();
  const [ownerData, setOwnerData] = useState<OwnerProps | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!workspaceId) return;
    dispatch(clearCart());
    localStorage.removeItem("cart");
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
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [dispatch, workspaceId]);

  useEffect(() => {
    if (!workspace) return;

    setLoading(true);
    const fetchOwner = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/workspace-owners/${workspace.ownerId}`
        );

        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải thông tin chủ doanh nghiệp.");
        }

        const data = await response.json();
        setOwnerData(data.owner);
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
        setLoading(false);
      }
    };

    fetchOwner();
  }, [workspace]);

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

  if (workspace.status === "Inactive") {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8 flex flex-col items-center text-center">
            <div className="rounded-full bg-red-100 p-4 mb-6">
              <AlertTriangle size={50} className="text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Không gian tạm ngưng hoạt động
            </h1>
            <p className="text-gray-600 mb-6">
              Không gian &quot;{workspace.name}&quot; hiện không khả dụng. Có
              thể không gian đang được bảo trì hoặc tạm dừng hoạt động.
            </p>

            <img
              src={workspace.images[0]?.imgUrl || "/space.jpg"}
              alt={workspace.name}
              className="w-full h-60 object-cover rounded-lg mb-6 opacity-70"
            />

            <div className="bg-gray-50 p-4 rounded-lg mb-8 w-full">
              <p className="text-sm text-gray-500">
                Địa chỉ:{" "}
                <span className="font-medium text-gray-700">
                  {workspace.address}
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button
                onClick={() => router.push("/")}
                className="bg-primary hover:bg-primary/90 text-white flex-1 gap-2 py-6"
              >
                <Home size={18} />
                <span>Trở về trang chủ</span>
              </Button>

              <Button
                onClick={() =>
                  router.push(`/workspace-owner/${workspace.ownerId}`)
                }
                className="bg-secondary hover:bg-secondary/90 text-white flex-1 gap-2 py-6"
              >
                <span>Xem không gian khác</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto pt-10 pb-20 gap-10 w-full md:w-[90%] px-6">
      <ImageList workspace={workspace} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 flex flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-primary flex flex-col gap-2">
                <span>{workspace.name}</span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 120, delay: 0.5 }}
                  className="relative w-fit my-2"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur-sm opacity-75 animate-pulse"></div>
                  <div className="relative flex items-center bg-white dark:bg-gray-950 py-1.5 px-3 rounded-lg border border-secondary/30 shadow-sm overflow-hidden">
                    <div className="mr-2 h-3 w-3 rounded-full bg-secondary"></div>
                    <span className="text-xs font-semibold text-gray-800">
                      MÃ KHÔNG GIAN
                    </span>
                    <div className="mx-2 h-4 w-[1px] bg-gray-300"></div>
                    <span className="text-sm font-bold text-secondary tracking-wider">
                      {workspace.code}
                    </span>
                  </div>
                </motion.div>
              </h1>
              <p className="text-fifth">{workspace.address}</p>
            </div>
            <div className="flex items-center justify-center gap-8 text-primary">
              <Share2
                size={32}
                onClick={handleShare}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div
              className="flex items-center gap-4 cursor-pointer relative group overflow-hidden rounded-xl p-2 border hover:border-primary hover:bg-secondary/20 transition-all duration-300"
              onClick={() => router.push(`/workspace-owner/${ownerData?.id}`)}
            >
              <div className="absolute -left-20 top-0 h-full w-12 rotate-[30deg] scale-y-150 bg-primary/10 transition-all duration-700 group-hover:left-[calc(100%+1rem)]"></div>
              <Image
                width={50}
                height={50}
                src={ownerData?.avatar || "/owner_icon.png"}
                alt={ownerData?.licenseName || ""}
                className="rounded-full border"
              />
              <div className="flex flex-col gap-1">
                <p className="font-bold text-sm">{ownerData?.licenseName}</p>
                <p className="text-sm">Chủ doanh nghiệp</p>
              </div>
              <div className="ml-auto flex items-center text-primary opacity-70 group-hover:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex items-center gap-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 px-4 py-2 rounded-lg shadow-md">
                      <Phone className="w-5 h-5" />
                      <span className="font-semibold">Liên hệ ngay</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="font-medium py-2 px-3 text-base"
                  >
                    <span className="text-white">
                      {ownerData?.phone
                        ? ownerData.phone
                        : "Không có số điện thoại"}
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <DetailsList
            roomCapacity={workspace.capacity}
            roomSize={workspace.area}
            roomType={workspace.category}
          />

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary">
              Thông tin chỗ ngồi
            </h2>
            <MoreDetailList details={workspace.details} />
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary">Mô tả chi tiết</h2>
            <div className="flex flex-col gap-2">
              {workspace.description.split("\n").map((line, index) => (
                <p key={index} className="text-fifth">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary flex gap-4">
              <Globe size={28} /> Mạng xã hội
            </h2>
            <div className="flex gap-8 items-center">
              <Link
                href={ownerData?.facebook || "https://www.facebook.com/"}
                className="border border-primary rounded-lg p-2"
              >
                <Facebook size={30} />
              </Link>
              <Link
                href={ownerData?.instagram || "https://www.instagram.com/"}
                className="border border-primary rounded-lg p-2"
              >
                <Instagram size={30} />
              </Link>
              <Link
                href={ownerData?.tiktok || "https://www.tiktok.com/vi-VN"}
                className="border border-primary rounded-lg p-2"
              >
                <TikTokOutlined style={{ fontSize: "28px" }} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary flex gap-4">
              <Archive size={28} /> <span>Cơ sở vật chất</span>
            </h2>
            <FacilitiesList facilities={workspace.facilities} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-6 flex gap-4">
              <ShieldEllipsis size={28} /> <span>Quy định chung</span>
            </h2>
            <PoliciesList policies={workspace.policies} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-6 flex gap-4">
              <Boxes size={28} /> <span>Tiện ích</span>
            </h2>
            <AmenitiesList ownerId={workspace.ownerId} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-6 flex gap-4">
              <HandPlatter size={28} /> <span>Thực đơn</span>
            </h2>
            <button
              className="text-sm border border-1 border-primary rounded-lg py-2 px-4 font-medium bg-primary text-white hover:bg-secondary transition-colors duration-300"
              onClick={() => setIsBeverageOpen(true)}
            >
              Hiển thị thực đơn
            </button>
          </div>

          {workspace.googleMapUrl && <GoogleMap url={workspace.googleMapUrl} />}

          <div className="flex flex-col">
            <SimilarSpace category={workspace.category} />
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-primary">
              Đánh giá từ khách hàng
            </h2>
            <ReviewList workspaceId={workspaceId} />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 flex flex-col p-6 bg-white border rounded-xl shadow-xl w-full max-w-full h-fit lg:sticky lg:top-24 lg:max-h-[85vh] overflow-auto">
          <WorkspaceDetailSidebar workspace={workspace} />
        </div>
      </div>

      <Modal
        title={null}
        open={isShareModalOpen}
        onCancel={() => setIsShareModalOpen(false)}
        footer={null}
        width={500}
        centered
        closeIcon={
          <Delete className="text-gray-500 hover:text-primary transition-colors" />
        }
        className="share-modal-custom"
      >
        <div className="flex flex-col items-center gap-6 py-2">
          <h3 className="text-xl font-bold text-primary self-start">
            Chia sẻ liên kết
          </h3>

          <div className="w-full p-4 border rounded-lg bg-gray-50 shadow-sm">
            <img
              src={workspace.images[0].imgUrl}
              alt={workspace.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {workspace.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1 mb-2">
              {workspace.address}
            </p>
            <p className="text-sm font-medium text-primary">
              {formatCurrency(Number(workspace.shortTermPrice))} -{" "}
              {formatCurrency(Number(workspace.longTermPrice))}
            </p>
          </div>

          <div className="w-full">
            <p className="text-sm font-medium text-gray-600 mb-2">
              Chia sẻ qua
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <FacebookShareButton
                url={window.location.href}
                className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FacebookIcon size={40} round />
                <span className="text-xs text-gray-600">Facebook</span>
              </FacebookShareButton>

              <TwitterShareButton
                url={window.location.href}
                className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <TwitterIcon size={40} round />
                <span className="text-xs text-gray-600">Twitter</span>
              </TwitterShareButton>

              <LinkedinShareButton
                url={window.location.href}
                className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LinkedinIcon size={40} round />
                <span className="text-xs text-gray-600">LinkedIn</span>
              </LinkedinShareButton>
            </div>

            <p className="text-sm font-medium text-gray-600 mb-2">
              Hoặc sao chép liên kết
            </p>
            <div className="flex items-center gap-2 p-2 border rounded-lg bg-white focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-50">
              <Share2 size={16} className="text-gray-400" />
              <input
                type="text"
                readOnly
                value={
                  typeof window !== "undefined" ? window.location.href : ""
                }
                className="flex-1 text-sm border-none outline-none bg-transparent"
              />
              <Button
                onClick={handleCopyUrl}
                className="bg-primary hover:bg-primary/90 text-white text-xs px-3 py-1 h-8 rounded-md"
              >
                Sao chép
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .share-modal-custom .ant-modal-content {
          padding: 20px;
          border-radius: 12px;
        }
        .share-modal-custom .ant-modal-close {
          top: 16px;
          right: 16px;
        }
      `}</style>

      <style jsx global>{`
        .share-modal-custom .ant-modal-content {
          padding: 20px;
          border-radius: 12px;
        }
        .share-modal-custom .ant-modal-close {
          top: 16px;
          right: 16px;
        }
      `}</style>

      <Modal
        title={<p className="text-xl font-bold text-primary">Thực đơn</p>}
        open={isBeverageOpen}
        onCancel={() => setIsBeverageOpen(false)}
        footer={null}
        width={800}
      >
        <BeveragesList ownerId={workspace.ownerId} />
      </Modal>
    </div>
  );
};

export default WorkspaceDetail;
