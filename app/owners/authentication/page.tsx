"use client";

import { IdCard, FileText, Phone, Waypoints } from "lucide-react";

interface VerificationItemProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

const VerificationItem: React.FC<VerificationItemProps> = ({
  icon,
  title,
  onClick,
}) => (
  <div className="flex items-center justify-between bg-seventh p-4 rounded-md mb-4">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-base font-medium">{title}</span>
    </div>
    <button
      onClick={onClick}
      className="bg-primary text-white font-medium text-base px-8 py-3 rounded-full hover:bg-secondary transition"
    >
      Nộp
    </button>
  </div>
);

function AuthenticationManagement() {
  const handleSubmit = (type: string) => {
    console.log(`${type} submitted`);
  };
  return (
    <div className="p-4 bg-white rounded-xl">
      <h1 className="text-xl font-bold text-center text-primary mt-10">
        Xác thực tài khoản
      </h1>
      <p className="text-center text-fifth mt-2 text-sm max-w-xl mx-auto">
        Để được xác minh, bạn phải gửi tất cả các thông tin bắt buộc sau. Nên
        bắt đầu bằng cách xác minh danh tính hoặc Địa chỉ.
      </p>

      <div className="mt-10">
        <VerificationItem
          icon={<IdCard className="w-6 h-6 text-gray-600" />}
          title="Căn cước công dân"
          onClick={() => handleSubmit("Căn cước công dân")}
        />

        <VerificationItem
          icon={<Waypoints className="w-6 h-6 text-gray-600" />}
          title="Tài khoản mạng xã hội"
          onClick={() => handleSubmit("Tài khoản mạng xã hội")}
        />

        <VerificationItem
          icon={<FileText className="w-6 h-6 text-gray-600" />}
          title="Giấy phép kinh doanh"
          onClick={() => handleSubmit("Giấy phép kinh doanh")}
        />

        <VerificationItem
          icon={<Phone className="w-6 h-6 text-gray-600" />}
          title="Xác thực số điện thoại"
          onClick={() => handleSubmit("Xác thực số điện thoại")}
        />
      </div>
    </div>
  );
}

export default AuthenticationManagement;
