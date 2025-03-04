"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { CardContent } from "../ui/card-content";
import { Button } from "../ui/button";
import Loader from "../loader/Loader";

interface Workspace {
  title: string;
  address: string;
  image: string;
}

export default function WorkshopList() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://67271c49302d03037e6f6a3b.mockapi.io/spaceList")
      .then((response) => response.json())
      .then((data) => {
        setWorkspaces(data);
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {workspaces.map((workspace, index) => (
          <Card
            key={index}
            className="relative overflow-hidden rounded-lg shadow-md"
          >
            <div className="relative">
              <img
                src={workspace.image}
                alt={workspace.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mt-2">{workspace.title}</h3>
              <p className="text-gray-600 text-sm">{workspace.address}</p>
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
