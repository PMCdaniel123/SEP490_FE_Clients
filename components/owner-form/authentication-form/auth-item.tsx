"use client";

import { Eye } from "lucide-react";
import React, { MouseEvent, useState } from "react";
import { LucideIcon } from "lucide-react";

interface AuthItemProps {
  icon: LucideIcon;
  title: string;
  form: React.ReactElement<{ onSubmit: () => void }>;
}

function AuthItem({ icon: Icon, title, form }: AuthItemProps) {
  const [open, setOpen] = useState(false);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setOpen(!open);
  };

  const handleFormSubmit = () => {
    setOpen(false);
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-xl mb-4 cursor-pointer ${
        open ? "bg-third p-8" : "bg-seventh hover:bg-third p-4"
      }`}
      onClick={handleClick}
    >
      <div className={`flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          {!open && <Icon size={24} />}
          {open && <Icon size={28} />}
          <span className={`font-semibold ${open ? "text-lg" : "text-base"}`}>
            {title}
          </span>
        </div>
        {!open && (
          <button className="flex gap-2 bg-primary text-white font-medium text-base p-4 rounded-xl hover:bg-secondary transition">
            <Eye />
          </button>
        )}
      </div>
      {open && (
        <div
          className="p-4 bg-white rounded-xl border mt-4"
          onClick={(e) => e.stopPropagation()}
        >
          {React.cloneElement(form, { onSubmit: handleFormSubmit })}
        </div>
      )}
    </div>
  );
}

export default AuthItem;
