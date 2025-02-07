"use client";

import { cn } from "@/lib/utils";
import { ReactNode, MouseEventHandler } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn("rounded-lg shadow-md overflow-hidden bg-white", className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
