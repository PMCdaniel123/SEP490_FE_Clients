"use client";

import { CustomerProps, TopWorkspace } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Ban, Eye, MoreHorizontal, UserRoundPen } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";

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
      const payment = row.original;

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
              onClick={() => console.log(payment.id)}
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
