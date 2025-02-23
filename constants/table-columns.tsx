"use client";

import {
  AmenityProps,
  BeverageProps,
  CustomerProps,
  PromotionProps,
  TopWorkspace,
  WorkspaceProps,
} from "@/types";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Ban, Dot, Eye, MoreHorizontal, UserRoundPen } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};

export const topWorkspaceTableColumns: ColumnDef<TopWorkspace>[] = [
  {
    accessorKey: "name",
    header: () => (
      <div className="text-black font-semibold text-base text-center">
        Tên không gian
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.image}
            alt=""
            width={50}
            height={50}
            className="border rounded-full"
          />
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-base">{row.original.title}</p>
            <p className="text-sm text-gray-600">{row.original.roomType}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "booking",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-black font-semibold text-base text-center items-center flex justify-center gap-2 cursor-pointer"
        >
          <p>Tổng lượt đặt</p>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">{row.getValue("booking")}</p>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-black font-semibold text-base text-center items-center flex justify-center gap-2 cursor-pointer"
        >
          <p>Đơn giá</p>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center font-medium">{row.getValue("price")}</p>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-black font-semibold text-base text-center items-center flex justify-center gap-2 cursor-pointer"
        >
          <p>Doanh thu</p>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">{row.getValue("amount")}</p>
      );
    },
  },
];

export const CustomerTableColumns: ColumnDef<CustomerProps>[] = [
  {
    accessorKey: "name",
    header: () => (
      <div className="text-black font-semibold text-base text-center">
        Họ và tên
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Image
            src={row.original.avatar}
            alt=""
            width={50}
            height={50}
            className="border rounded-full"
          />
          <div>
            <p className="font-semibold text-base">{row.original.name}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Số điện thoại
        </p>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center font-medium">{row.getValue("phone")}</p>;
    },
  },
  {
    accessorKey: "email",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">Email</p>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center font-medium">{row.getValue("email")}</p>;
    },
  },
  {
    accessorKey: "location",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Địa chỉ
        </p>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">{row.getValue("location")}</p>
      );
    },
  },
  {
    accessorKey: "dateOfBirth",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Ngày sinh
        </p>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">{row.getValue("dateOfBirth")}</p>
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-black font-semibold text-base text-center items-center flex justify-center gap-2 cursor-pointer"
        >
          <p>Giới tính</p>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">{row.getValue("gender")}</p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="py-2">
            <li
              className="px-4 rounded-sm flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
              onClick={() => console.log(customer.id)}
            >
              <Eye size={16} /> <span>Xem thông tin</span>
            </li>
            <li className="px-4 rounded-sm flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer">
              <Ban size={16} /> <span>Chặn</span>
            </li>
            <li className="px-4 rounded-sm flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer">
              <UserRoundPen size={16} /> <span>Khiếu nại</span>
            </li>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const workspaceCategory: Record<string, string> = {
  "1": "Bàn cá nhân",
  "2": "Văn phòng",
  "3": "Phòng họp",
  "4": "Phòng hội thảo",
};

export const WorkspaceTableColumns: ColumnDef<WorkspaceProps>[] = [
  {
    accessorKey: "name",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Tên không gian
        </p>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center font-medium">{row.getValue("name")}</p>;
    },
  },
  {
    accessorKey: "image",
    header: () => (
      <div className="text-black font-semibold text-base text-center">
        Hình ảnh
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <Image
            src={row.original.images[0]}
            alt={row.original.name}
            width={200}
            height={200}
            className="object-cover rounded-md"
          />
        </div>
      );
    },
  },
  { accessorKey: "longTermPrice", header: () => <p></p>, cell: () => <p></p> },
  {
    accessorKey: "shortTermPrice",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Đơn giá
        </p>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">
          {row.getValue("shortTermPrice")} - {row.getValue("longTermPrice")}
        </p>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Loại không gian
        </p>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">
          {workspaceCategory[String(row.getValue("category"))] ||
            "Không xác định"}
        </p>
      );
    },
  },
  {
    accessorKey: "rating",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Đánh giá
        </p>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">{row.getValue("rating")}</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-black font-semibold text-base text-center items-center flex justify-center gap-2 cursor-pointer"
        >
          <p>Trạng thái</p>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      return row.getValue("status") === "1" ? (
        <p className="text-center font-medium flex items-center justify-center text-green-500">
          <Dot size={60} />
          <span>Hoạt động</span>
        </p>
      ) : (
        <p className="text-center font-medium flex items-center justify-center text-red-500">
          <Dot size={60} />
          <span>Ngừng hoạt động</span>
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const workspace = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="py-2">
            <Link
              className="px-4 rounded-sm flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
              href={`workspaces/${workspace.id}`}
            >
              <Eye size={16} /> <span>Xem thông tin chi tiết</span>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const AmenityTableColumns: ColumnDef<AmenityProps>[] = [
  {
    accessorKey: "name",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Tên tiện ích
        </p>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center font-medium">{row.getValue("name")}</p>;
    },
  },
  {
    accessorKey: "image",
    header: () => (
      <div className="text-black font-semibold text-base text-center">
        Hình ảnh
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <Image
            src={row.original.image}
            alt={row.original.name}
            width={200}
            height={200}
            className="object-cover rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Đơn giá
        </p>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center font-medium">{row.getValue("price")}</p>;
    },
  },
  {
    accessorKey: "quantity",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Số lượng
        </p>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">{row.getValue("quantity")}</p>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Phân loại
        </p>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">{row.getValue("category")}</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-black font-semibold text-base text-center items-center flex justify-center gap-2 cursor-pointer"
        >
          <p>Trạng thái</p>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      return row.getValue("status") === "1" ? (
        <p className="text-center font-medium flex items-center justify-center text-green-500">
          <Dot size={60} />
          <span>Hoạt động</span>
        </p>
      ) : (
        <p className="text-center font-medium flex items-center justify-center text-red-500">
          <Dot size={60} />
          <span>Ngừng hoạt động</span>
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const amenity = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="py-2">
            <Link
              className="px-4 rounded-sm flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
              href={`amenities/${amenity.id}`}
            >
              <Eye size={16} /> <span>Xem thông tin chi tiết</span>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const beverageCategory: Record<string, string> = {
  "1": "Thức uống",
  "2": "Đồ ăn",
};
export const BeverageTableColumns: ColumnDef<BeverageProps>[] = [
  {
    accessorKey: "name",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Tên món
        </p>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center font-medium">{row.getValue("name")}</p>;
    },
  },
  {
    accessorKey: "image",
    header: () => (
      <div className="text-black font-semibold text-base text-center">
        Hình ảnh
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <Image
            src={row.original.image}
            alt={row.original.name}
            width={200}
            height={200}
            className="object-cover rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Đơn giá
        </p>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center font-medium">{row.getValue("price")}</p>;
    },
  },
  {
    accessorKey: "category",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Phân loại
        </p>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">
          {beverageCategory[String(row.getValue("category"))] ||
            "Không xác định"}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-black font-semibold text-base text-center items-center flex justify-center gap-2 cursor-pointer"
        >
          <p>Trạng thái</p>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      return row.getValue("status") === "1" ? (
        <p className="text-center font-medium flex items-center justify-center text-green-500">
          <Dot size={60} />
          <span>Hoạt động</span>
        </p>
      ) : (
        <p className="text-center font-medium flex items-center justify-center text-red-500">
          <Dot size={60} />
          <span>Ngừng hoạt động</span>
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const beverage = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="py-2">
            <Link
              className="px-4 rounded-sm flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
              href={`beverages/${beverage.id}`}
            >
              <Eye size={16} /> <span>Xem thông tin chi tiết</span>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const PromotionTableColumns: ColumnDef<PromotionProps>[] = [
  {
    accessorKey: "code",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Mã khuyến mại
        </p>
      );
    },
    cell: ({ row }) => {
      return <p className="text-center font-medium">{row.getValue("code")}</p>;
    },
  },
  {
    accessorKey: "discount",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Giảm giá
        </p>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">{row.getValue("discount")}%</p>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Ngày bắt đầu
        </p>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">
          {formatDate(row.getValue("startDate"))}
        </p>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: () => {
      return (
        <p className="text-black font-semibold text-base text-center">
          Ngày kết thúc
        </p>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center font-medium">
          {formatDate(row.getValue("endDate"))}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-black font-semibold text-base text-center items-center flex justify-center gap-2 cursor-pointer"
        >
          <p>Trạng thái</p>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      return row.getValue("status") === "1" ? (
        <p className="text-center font-medium flex items-center justify-center text-green-500">
          <Dot size={60} />
          <span>Hoạt động</span>
        </p>
      ) : (
        <p className="text-center font-medium flex items-center justify-center text-red-500">
          <Dot size={60} />
          <span>Ngừng hoạt động</span>
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const promotion = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="py-2">
            <Link
              className="px-4 rounded-sm flex items-center gap-2 hover:bg-primary hover:text-white py-1 transition-colors duration-200 cursor-pointer"
              href={`promotions/${promotion.id}`}
            >
              <Eye size={16} /> <span>Xem thông tin chi tiết</span>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
