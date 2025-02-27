import {
  AmenityProps,
  BeverageProps,
  CustomerProps,
  MenuItemProps,
  NewCustomerItemProps,
  PromotionProps,
  ReviewItemProps,
  TopWorkspace,
  WithdrawalProps,
  WorkspaceProps,
} from "@/types";

export const menuItems: MenuItemProps[] = [
  { name: "Trang chủ", path: "/" },
  { name: "Liên hệ", path: "/contact" },
  { name: "Không gian", path: "/workspace" },
  { name: "Tải WorkHive", path: "/download" },
];

export const topWorkspace: TopWorkspace[] = [
  {
    id: "1",
    title: "Workspace 1",
    booking: "20",
    price: "$100",
    image: "/logo.png",
    amount: 100,
    roomType: "Bàn cá nhân",
  },
  {
    id: "2",
    title: "Workspace 2",
    booking: "22",
    price: "$100",
    image: "/logo.png",
    amount: 100,
    roomType: "Văn phòng",
  },
  {
    id: "3",
    title: "Workspace 3",
    booking: "12",
    price: "$100",
    image: "/logo.png",
    amount: 100,
    roomType: "Phòng hội thảo",
  },
  {
    id: "4",
    title: "Workspace 4",
    booking: "20",
    price: "$100",
    image: "/logo.png",
    amount: 100,
    roomType: "Bàn cá nhân",
  },
  {
    id: "5",
    title: "Workspace 5",
    booking: "22",
    price: "$100",
    image: "/logo.png",
    amount: 100,
    roomType: "Văn phòng",
  },
  {
    id: "6",
    title: "Workspace 6",
    booking: "12",
    price: "$100",
    image: "/logo.png",
    amount: 100,
    roomType: "Phòng hội thảo",
  },
  {
    id: "7",
    title: "Workspace 7",
    booking: "20",
    price: "$100",
    image: "/logo.png",
    amount: 100,
    roomType: "Bàn cá nhân",
  },
  {
    id: "8",
    title: "Workspace 8",
    booking: "22",
    price: "$100",
    image: "/logo.png",
    amount: 100,
    roomType: "Văn phòng",
  },
  {
    id: "9",
    title: "Workspace 9",
    booking: "12",
    price: "$100",
    image: "/logo.png",
    amount: 100,
    roomType: "Phòng hội thảo",
  },
  {
    id: "10",
    title: "Workspace 10",
    booking: "12",
    price: "$100",
    image: "/logo.png",
    amount: 100,
    roomType: "Phòng hội thảo",
  },
];

export const newCustomers: NewCustomerItemProps[] = [
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn A",
    location: "Hà Nội, Việt Nam",
  },
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn B",
    location: "Hà Nội, Việt Nam",
  },
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn C",
    location: "Hà Nội, Việt Nam",
  },
];

export const reviews: ReviewItemProps[] = [
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn A",
    date: "14/02/2025",
    rating: 5,
    review:
      "Không gian làm việc rất chuyên nghiệp và yên tĩnh, phù hợp để tập trung hoàn toàn vào công việc",
  },
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn B",
    date: "14/02/2025",
    rating: 4,
    review:
      "Không gian làm việc rất chuyên nghiệp và yên tĩnh, phù hợp để tập trung hoàn toàn vào công việc",
  },
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn C",
    date: "14/02/2025",
    rating: 3,
    review:
      "Không gian làm việc rất chuyên nghiệp và yên tĩnh, phù hợp để tập trung hoàn toàn vào công việc",
  },
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn D",
    date: "14/02/2025",
    rating: 5,
    review:
      "Không gian làm việc rất chuyên nghiệp và yên tĩnh, phù hợp để tập trung hoàn toàn vào công việc",
  },
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn E",
    date: "14/02/2025",
    rating: 4,
    review: "Một nơi làm việc đáng trải nghiệm với môi trường chuyên nghiệp",
  },
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn F",
    date: "14/02/2025",
    rating: 5,
    review: "Tuyệt vời! Không gian thoải mái và tiện ích đầy đủ",
  },
];

export const policies = [
  "Không mang đồ ăn thức uống từ bên ngoài vào",
  "Không mang theo động vật",
  "Không gây ồn ào xung quanh",
  "Không khói thuốc",
];

export const customerList: CustomerProps[] = [
  {
    id: "1",
    avatar: "/logo.png",
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "RyYKd@example.com",
    location: "Hà Nội, Việt Nam",
    gender: "Nam",
    dateOfBirth: "14/02/2005",
  },
  {
    id: "2",
    avatar: "/logo.png",
    name: "Nguyễn Văn B",
    phone: "0123456789",
    email: "RyYKd@example.com",
    location: "Hà Nội, Việt Nam",
    gender: "Nữ",
    dateOfBirth: "14/02/2005",
  },
  {
    id: "3",
    avatar: "/logo.png",
    name: "Nguyễn Văn C",
    phone: "0123456789",
    email: "RyYKd@example.com",
    location: "Hà Nội, Việt Nam",
    gender: "Nam",
    dateOfBirth: "14/02/2005",
  },
  {
    id: "4",
    avatar: "/logo.png",
    name: "Nguyễn Văn D",
    phone: "0123456789",
    email: "RyYKd@example.com",
    location: "Hà Nội, Việt Nam",
    gender: "Nữ",
    dateOfBirth: "14/02/2005",
  },
  {
    id: "5",
    avatar: "/logo.png",
    name: "Nguyễn Văn E",
    phone: "0123456789",
    email: "RyYKd@example.com",
    location: "Hà Nội, Việt Nam",
    gender: "Nam",
    dateOfBirth: "14/02/2005",
  },
  {
    id: "6",
    avatar: "/logo.png",
    name: "Nguyễn Văn F",
    phone: "0123456789",
    email: "RyYKd@example.com",
    location: "Hà Nội, Việt Nam",
    gender: "Nữ",
    dateOfBirth: "14/02/2005",
  },
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

export const amenityList: AmenityProps[] = [
  {
    id: "1",
    name: "Máy chiếu",
    description: "Mô tả 1",
    price: "100000",
    image: "/banner.png",
    quantity: "10",
    category: "Đồ điện",
    status: "1",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
  {
    id: "2",
    name: "Ổ điện",
    description: "Mô tả 2",
    price: "200000",
    image: "/banner1.png",
    quantity: "20",
    category: "Đồ điện",
    status: "1",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
  {
    id: "3",
    name: "Quạt mini",
    description: "Mô tả 3",
    price: "300000",
    image: "/banner2.jpg",
    quantity: "30",
    category: "Đồ điện",
    status: "1",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
];

export const beverageList: BeverageProps[] = [
  {
    id: "1",
    name: "Trà sữa chân châu đường đen",
    description: "Mô tả 1",
    price: "30000",
    image: "/banner.png",
    category: "1",
    status: "1",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
  {
    id: "2",
    name: "Matcha Latte",
    description: "Mô tả 2",
    price: "45000",
    image: "/banner1.png",
    category: "1",
    status: "1",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
  {
    id: "3",
    name: "Cafe muối",
    description: "Mô tả 3",
    price: "25000",
    image: "/banner2.jpg",
    category: "1",
    status: "1",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
  {
    id: "4",
    name: "Coco Matcha",
    description: "Mô tả 4",
    price: "40000",
    image: "/banner2.jpg",
    category: "1",
    status: "1",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
  {
    id: "5",
    name: "Bạc sỉu",
    description: "Mô tả 5",
    price: "20000",
    image: "/banner2.jpg",
    category: "1",
    status: "1",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
];

export const promotionList: PromotionProps[] = [
  {
    id: "1",
    code: "AAAAAA",
    description: "Giảm giá Tết",
    discount: "10",
    status: "1",
    startDate: "2023-01-01",
    endDate: "2023-01-31",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
  {
    id: "2",
    code: "BBBBBB",
    description: "Giảm giá Valentine",
    discount: "20",
    status: "1",
    startDate: "2023-01-01",
    endDate: "2023-01-31",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
  {
    id: "3",
    code: "CCCCCC",
    description: "Giảm giá giỗ tổ Hùng Vương",
    discount: "30",
    status: "1",
    startDate: "2023-01-01",
    endDate: "2023-01-31",
    createdAt: "01/01/2023",
    updatedAt: "01/01/2023",
  },
];

export const withdrawalList: WithdrawalProps[] = [
  {
    id: "1",
    number: "123456789",
    bank: "Vietcombank",
    money: "100000",
    status: "1",
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: "2",
    number: "987654321",
    bank: "Techcombank",
    money: "200000",
    status: "2",
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: "3",
    number: "555555555",
    bank: "Vietinbank",
    money: "150000",
    status: "3",
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
];
