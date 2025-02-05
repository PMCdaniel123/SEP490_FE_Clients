"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// CardContent Component
interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
