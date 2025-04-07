import { MenuItemProps, WorkspaceProps } from "@/types";

export const menuItems: MenuItemProps[] = [
  { name: "Trang chủ", path: "/" },
  { name: "Giới thiệu", path: "/about-us" },
  { name: "Không gian", path: "/workspace" },
  { name: "Liên hệ", path: "/contact" },
];

export const policies = [
  "Không mang đồ ăn thức uống từ bên ngoài vào",
  "Không mang theo động vật",
  "Không gây ồn ào xung quanh",
  "Không khói thuốc",
];

export const workspaceList: WorkspaceProps[] = [
  {
    id: "1",
    name: "Không gian 1",
    description: "Mô tả 1",
    address: "TP HCM",
    googleMapUrl: "https://www.facebook.com/",
    area: "10",
    cleanTime: "15",
    shortTermPrice: "10000",
    longTermPrice: "200000",
    images: ["/banner.png"],
    facilities: ["cơ sở vật chất"],
    policies: ["quy định chung"],
    capacity: "10",
    category: "1",
    rating: 4.5,
    status: "1",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
  {
    id: "2",
    name: "Không gian 2",
    description: "Mô tả 2",
    address: "TP HCM",
    googleMapUrl: "https://www.facebook.com/",
    area: "10",
    cleanTime: "15",
    shortTermPrice: "10000",
    longTermPrice: "200000",
    images: ["/banner.png"],
    facilities: ["cơ sở vật chất"],
    policies: ["quy định chung"],
    capacity: "20",
    category: "2",
    rating: 4.5,
    status: "1",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
  {
    id: "3",
    name: "Không gian 3",
    description: "Mô tả 3",
    address: "TP HCM",
    googleMapUrl: "https://www.facebook.com/",
    area: "10",
    cleanTime: "15",
    shortTermPrice: "10000",
    longTermPrice: "200000",
    images: ["/banner.png"],
    facilities: ["cơ sở vật chất"],
    policies: ["quy định chung"],
    capacity: "30",
    category: "3",
    rating: 4.5,
    status: "2",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
];

export const paymentMethods = [
  { value: "1", label: "Thanh toán bằng ngân hàng", image: "/vietqr.png" },
  { value: "2", label: "Thanh toán bằng ví WorkHive", image: "/logo.png" },
];

export const searchAddress: string[] = [
  "Quận 1",
  "Quận 2",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 9",
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Phú Nhuận",
  "Bình Thạnh",
  "Gò Vấp",
  "Tân Bình",
  "Bình Tân",
  "Tân Phú",
  "Thủ Đức",
  "Bình Chánh",
  "Hóc Môn",
  "Củ Chi",
  "Cần Giờ",
  "Nhà Bè",
];

export const workspaceCategory: string[] = [
  "Bàn cá nhân",
  "Văn phòng",
  "Phòng họp",
  "Phòng hội thảo",
];
