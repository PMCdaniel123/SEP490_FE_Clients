"use client";

import { SidebarItemProps } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex text-base items-center gap-2 px-4 py-4 rounded-lg transition-colors duration-200 ${
        isActive
          ? "bg-primary text-white"
          : "text-fourth hover:bg-primary hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}
