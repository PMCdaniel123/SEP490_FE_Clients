import { LucideIcon } from "lucide-react";

export interface SignInFormProps {
  className?: string;
  onClose: () => void;
}

export interface ValidatePayload {
  input: string;
}

export interface MenuItemProps {
  name: string;
  path: string;
}

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export interface TopWorkspace {
  id: string;
  title: string;
  booking: string;
  price: string;
  image: string;
  amount: number;
  roomType: string;
}

export interface NewCustomerItemProps {
  avatar: string;
  name: string;
  location: string;
}

export interface ReviewItemProps {
  avatar: string;
  name: string;
  date: string;
  rating: number;
  review: string;
}

export interface LabelIconProps {
  icon: LucideIcon;
  label: string;
}

export interface DetailsListProps {
  roomCapacity: number;
  roomSize: number;
  roomType: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface CustomerProps {
  id: string;
  avatar: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  gender: string;
  dateOfBirth: string;
}

export interface WorkspaceProps {
  id: string;
  name: string;
  address: string;
  googleMapUrl: string;
  capacity: string;
  category: string;
  area: string;
  cleanTime: string;
  description: string;
  shortTermPrice: string;
  longTermPrice: string;
  facilities: string[];
  policies: string[];
  images: string[];
  rating: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AmenityProps {
  id: string;
  name: string;
  description: string;
  price: string;
  imgUrl: string;
  quantity: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BeverageProps {
  id: string;
  name: string;
  description: string;
  price: string;
  imgUrl: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionProps {
  id: string;
  code: string;
  description: string;
  discount: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalProps {
  id: string;
  number: string;
  bank: string;
  money: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IdentifyProps {
  id: string;
  name: string;
  number: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  placeOfOrigin: string;
  placeOfResidence: string;
  dateOfExpiry: string;
  dateOfCreation: string;
  file: string;
}

export interface SocialProps {
  id: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  other: string;
}

export interface LicenseProps {
  id: string;
  name: string;
  number: string;
  address: string;
  charterCapital: string;
  file: string;
}

export interface PhoneProps {
  id: string;
  phone: string;
}

export interface TimeItemProps {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface Image {
  id: string;
  imgUrl: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  shortTermPrice: string;
  longTermPrice: string;
  images: Image[];
  capacity: number;
  category: string;
  area: number;
  address: string;
  googleMapUrl: string;
}
