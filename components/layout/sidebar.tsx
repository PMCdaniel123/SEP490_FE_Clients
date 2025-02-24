"use client";

import SidebarItem from "@/components/layout/sidebar-item";
import {
  Bell,
  Boxes,
  DiamondPercent,
  Home,
  KeyRound,
  Sofa,
  UsersRound,
  UtensilsCrossed,
} from "lucide-react";

function sidebar() {
  return (
    <aside className="w-72 bg-white p-4 rounded-xl">
      <h1 className="text-2xl font-extrabold my-4 text-primary text-center">
        WorkHive
      </h1>
      <nav className="flex flex-col gap-2 mt-10">
        <SidebarItem icon={Home} label="Trang chủ" href="/owners" />
        <SidebarItem
          icon={UsersRound}
          label="Quản lý khách hàng"
          href="/owners/customers"
        />
        <SidebarItem
          icon={Sofa}
          label="Quản lý không gian"
          href="/owners/workspaces"
        />
        <SidebarItem
          icon={Boxes}
          label="Quản lý tiện ích"
          href="/owners/amenities"
        />
        <SidebarItem
          icon={UtensilsCrossed}
          label="Quản lý thực đơn"
          href="/owners/beverages"
        />
        <SidebarItem
          icon={DiamondPercent}
          label="Khuyến mãi"
          href="/owners/promotions"
        />
        <SidebarItem
          icon={KeyRound}
          label="Xác thực doanh nghiệp"
          href="/owners/authentication"
        />
        <SidebarItem
          icon={Bell}
          label="Thông báo"
          href="/owners/notifications"
        />
      </nav>
    </aside>
  );
}

export default sidebar;
