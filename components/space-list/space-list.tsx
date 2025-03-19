/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Heart, Users, Ruler, Clock, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import { CardContent } from "../ui/card-content";
import Loader from "../loader/Loader";
import { Workspace } from "@/types";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";

export default function SpaceList() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("https://localhost:5050/workspaces")
      .then((response) => response.json())
      .then((data: { workspaces: Workspace[] }) => {
        const formattedWorkspaces = data.workspaces.map((workspace) => ({
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
          <Card
            key={workspace.id}
            className="relative overflow-hidden rounded-lg shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
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

              <div className="absolute top-3 left-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 hover:bg-white rounded-full h-8 w-8 shadow-md"
                >
                  <Heart className="text-gray-500" size={18} />
                </Button>
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

              <div className="border-t border-gray-100 pt-3">
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
                        <Calendar className="mr-1 text-purple-500" size={16} />
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
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Button className="px-6 py-2 bg-black text-white rounded">
          Xem tất cả
        </Button>
      </div>
    </div>
  );
}