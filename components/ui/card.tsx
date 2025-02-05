"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// Card Component
interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn("rounded-lg shadow-md overflow-hidden bg-white", className)}
    >
      {children}
    </div>
  );
}
