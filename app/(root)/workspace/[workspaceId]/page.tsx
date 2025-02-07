"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Users, Ruler, Bed } from "lucide-react";
import Loader from "@/components/loader/Loader";
import { Button } from "@/components/ui/button";

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
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState("06:30 PM");
  const [selectedDate, setSelectedDate] = useState("2025-04-16");

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
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="relative w-full h-96">
          <img
            src={workspace.image}
            alt={workspace.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative w-full h-24">
              <img
                src={workspace.image}
                alt={`Coworking Space ${i + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold">{workspace.title}</h1>
        <p className="text-gray-600">{workspace.address}</p>

        <div className="flex items-center space-x-4 mt-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Users className="mr-1" size={16} /> {workspace.roomCapacity} người
          </div>
          <div className="p-2 bg-gray-100 rounded-lg">
            <Ruler className="mr-1" size={16} /> {workspace.roomSize} m²
          </div>
          <div className="p-2 bg-gray-100 rounded-lg">
            <Bed className="mr-1" size={16} /> {workspace.roomType}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-lg font-semibold">{workspace.price}</p>
          <p className="text-gray-500">Thuê theo giờ: $1</p>
          <p className="text-gray-500">Thuê dài hạn: $20</p>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium">Chọn thời gian</label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full p-2 border rounded-lg mt-1"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Chọn ngày</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded-lg mt-1"
          />
        </div>

        <Button className="w-full mt-6 bg-black text-white py-3 rounded-lg">
          ĐẶT NGAY
        </Button>
      </div>
    </div>
  );
};

export default WorkspaceDetail;
