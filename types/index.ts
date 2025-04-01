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

export interface ReviewItemProps {
  avatar: string;
  name: string;
  date: string;
  rating: number;
  review: string;
  images: { url: string }[];
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

export interface Price {
  id: string;
  category: string;
  price: number;
}

export interface Facilities {
  id: string;
  facilityName: string;
}

export interface Policies {
  id: string;
  policyName: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  shortTermPrice: number;
  longTermPrice: number;
  images: Image[];
  capacity: number;
  category: string;
  area: number;
  address: string;
  googleMapUrl: string;
  prices: Price[];
  facilities: Facilities[];
  policies: Policies[];
  is24h: number;
  ownerId: string;
  openTime: string;
  closeTime: string;
}

export interface Promotion {
  id: number;
  code: string;
  description: string;
  discount: number;
  status: string;
  startDate: string;
  endDate: string;
  workspaceID: number;
}

export interface OwnerProps {
  id: number;
  email: string;
  phone: string;
  identityName: string;
  identityNumber: string;
  dateOfBirth: string;
  sex: string;
  nationality: string;
  placeOfOrigin: string;
  placeOfResidence: string;
  identityExpiredDate: string;
  identityCreatedDate: string;
  identityFile: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  licenseName: string;
  licenseNumber: string;
  licenseAddress: string;
  googleMapUrl: string;
  charterCapital: string;
  licenseFile: string;
  status: string;
  updatedAt: string;
  message: string | null;
}
