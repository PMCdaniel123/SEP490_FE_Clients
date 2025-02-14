import {
  CustomerProps,
  MenuItemProps,
  NewCustomerItemProps,
  ReviewItemProps,
  TopWorkspace,
} from "@/types";

export const menuItems: MenuItemProps[] = [
  { name: "Trang chủ", path: "/" },
  { name: "Giới thiệu", path: "/about" },
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
