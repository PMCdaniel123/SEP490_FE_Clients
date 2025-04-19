/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Users, Ruler, Clock, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "../ui/card-content";
import Loader from "../loader/Loader";
import { Workspace } from "@/types";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { BASE_URL } from "@/constants/environments";
import Link from "next/link";
import ShinyCard from "../animate-ui/shiny-card";

interface WorkspaceWithStatus extends Workspace {
  status?: string;
}

export default function SpaceList() {
  const [workspaces, setWorkspaces] = useState<WorkspaceWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`${BASE_URL}/workspaces`)
      .then((response) => response.json())
      .then((data: { workspaces: WorkspaceWithStatus[] }) => {
        const activeWorkspaces = data.workspaces.filter(
          (workspace) => workspace.status === "Active"
        );

        const formattedWorkspaces = activeWorkspaces.map((workspace) => ({
          ...workspace,
          shortTermPrice:
            workspace.prices.find((price) => price.category === "Giờ")?.price ||
            0,
          longTermPrice:
            workspace.prices.find((price) => price.category === "Ngày")
              ?.price || 0,
        }));
        setWorkspaces(formattedWorkspaces);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <p className="text-gray-600 text-lg">Không có dữ liệu để hiển thị.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {workspaces.slice(0, 6).map((workspace) => (
          <ShinyCard
            key={workspace.id}
            className="transition-transform transform md:hover:scale-105 cursor-pointer"
          >
            <div
              className="relative overflow-hidden rounded-lg shadow-md"
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
                <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                  {workspace.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <MapPin className="mr-1 text-gray-400" size={14} />
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
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(workspace.shortTermPrice)}
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
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(workspace.longTermPrice)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Button className="w-full mt-4 text-white">Xem chi tiết</Button>
              </CardContent>
            </div>
          </ShinyCard>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Link href="/workspace">
          <Button className="px-6 py-2 bg-black text-white rounded">
            Xem tất cả
          </Button>
        </Link>
      </div>
    </div>
  );
}
