"use client";

/* eslint-disable @next/next/no-img-element */
import ShinyCard from "@/components/animate-ui/shiny-card";
import Loader from "@/components/loader/Loader";
import Pagination from "@/components/pagination/pagination";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card-content";
import { Separator } from "@/components/ui/separator";
import { BASE_URL } from "@/constants/environments";
import { OwnerProps } from "@/types";
import { Calendar, Clock, Ruler, Users } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Workspace {
  id: string;
  name: string;
  address: string;
  shortTermPrice: number;
  longTermPrice: number;
  images: { imgUrl: string }[];
  prices: { category: string; price: number }[];
  capacity: number;
  category: string;
  area: number;
  status: string;
}

function WorkspaceOwnerDetail() {
  const { ownerId } = useParams() as { ownerId: string };
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [ownerData, setOwnerData] = useState<OwnerProps | null>(null);

  useEffect(() => {
    if (!ownerId) return;

    setLoading(true);
    const fetchOwner = async () => {
      try {
        const response = await fetch(`${BASE_URL}/workspace-owners/${ownerId}`);

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
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
        setLoading(false);
      }
    };

    fetchOwner();
  }, [ownerId]);

  useEffect(() => {
    if (!ownerId) return;
    setLoading(true);
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch(`${BASE_URL}/workspaces/owner/${ownerId}`);

        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải danh sách không gian!");
        }

        const data = await response.json();
        const formatted =
          data.workspaces === null || data.workspaces === undefined
            ? []
            : data.workspaces
                .filter((workspace: Workspace) => workspace.status === "Active")
                .map((workspace: Workspace) => ({
                  ...workspace,
                  shortTermPrice:
                    workspace.prices.find((price) => price.category === "Giờ")
                      ?.price || 0,
                  longTermPrice:
                    workspace.prices.find((price) => price.category === "Ngày")
                      ?.price || 0,
                }));
        setWorkspaces(formatted);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Đã xảy ra lỗi!";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
        });
        setWorkspaces([]);
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [ownerId]);

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  const totalPages = Math.ceil(workspaces.length / 9);

  const paginatedWorkspaces = workspaces.slice(
    (currentPage - 1) * 9,
    currentPage * 9
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (workspaces.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <img src="/404.png" alt="No data" className="w-96 mx-auto mt-6" />
        <p className="text-gray-600 text-lg">Không có dữ liệu để hiển thị.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="relative w-full max-w-7xl mx-auto bg-white rounded-md overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-80 w-full">
          <Image src="/banner.png" alt="Cover" fill className="object-cover" />
        </div>

        {/* Avatar + Info */}
        <div className="relative px-4 pb-4">
          {/* Avatar */}
          <div className="absolute -top-12 left-6">
            <div className="relative h-32 w-32 rounded-full ring-4 ring-white overflow-hidden">
              <Image
                src={ownerData?.avatar || "/logo.png"}
                alt="Avatar"
                fill
                className="object-cover bg-primary/40"
              />
            </div>
          </div>

          {/* Name & Info */}
          <div className="ml-40 pt-4">
            <h1 className="text-2xl font-bold">
              {ownerData?.licenseName || "Doanh nghiệp"}
            </h1>
            <p className="text-sm text-gray-600">Chủ doanh nghiệp</p>
          </div>
        </div>
      </div>

      <Separator className="my-10" />

      <div>
        <p className="text-gray-500 mb-4">
          {workspaces.length} kết quả được tìm thấy
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedWorkspaces.map((workspace) => (
            <ShinyCard key={workspace.id}>
              <div
                className="relative overflow-hidden rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/workspace/${workspace.id}`)}
              >
                <div className="relative group">
                  <div className="overflow-hidden h-56">
                    <img
                      src={workspace.images[0]?.imgUrl || "/placeholder.png"}
                      alt={workspace.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex justify-between items-end">
                      <Badge className="bg-primary hover:bg-secondary text-white">
                        {workspace.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardContent className="p-5">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                    {workspace.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 flex items-center">
                    <span className="truncate">{workspace.address}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center text-gray-700 text-sm">
                      <Users className="mr-1 text-blue-500" size={16} />
                      <span>{workspace.capacity} người</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm justify-end">
                      <Ruler className="mr-1 text-green-500" size={16} />
                      <span>{workspace.area} m²</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex flex-col gap-1">
                      {workspace.shortTermPrice > 0 && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-700 text-sm">
                            <Clock className="mr-1 text-orange-500" size={16} />
                            <span>Theo giờ</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(workspace.shortTermPrice)}
                          </span>
                        </div>
                      )}

                      {workspace.longTermPrice > 0 && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-700 text-sm">
                            <Calendar
                              className="mr-1 text-purple-500"
                              size={16}
                            />
                            <span>Theo ngày</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(workspace.longTermPrice)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </ShinyCard>
          ))}
        </div>
      </div>
      {workspaces.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default WorkspaceOwnerDetail;
