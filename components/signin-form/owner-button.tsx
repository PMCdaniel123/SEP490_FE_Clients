"use client";

import { useState } from "react";
import { Modal } from "antd";
import { User } from "lucide-react";
import OwnerForm from "./owner-form";
import { Button } from "../ui/button";

export function OwnerButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-center w-full pt-2">
      <Button
        className="text-white py-6 font-semibold w-3/5 ml-2"
        onClick={() => setOpen(true)}
      >
        <User className="mr-2" />
        Đăng nhập với doanh nghiệp
      </Button>
      <Modal
        width={920}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <OwnerForm onClose={() => setOpen(false)} />
      </Modal>
    </div>
  );
}
