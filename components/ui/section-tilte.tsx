import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="text-2xl font-bold text-brown-700 text-[#835101] pb-5 relative inline-block">
      {children}
      <span className="absolute bottom-0 left-0 transform w-1/3 border-b-4 border-black rounded-sm"></span>
    </h2>
  );
}
