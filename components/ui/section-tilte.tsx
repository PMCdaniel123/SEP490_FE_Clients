import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="text-2xl font-bold pb-5 relative inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm hover:drop-shadow-md transition-all duration-300">
      {children}
      <span className="absolute bottom-0 left-0 transform w-1/3 border-b-4 border-black rounded-sm"></span>
    </h2>
  );
}
