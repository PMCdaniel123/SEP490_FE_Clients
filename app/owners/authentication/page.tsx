"use client";

import AuthItem from "@/components/owner-form/authentication-form/auth-item";
import IdentifyForm from "@/components/owner-form/authentication-form/IdentifyForm";
import LicenseForm from "@/components/owner-form/authentication-form/LicenseForm";
import PhoneForm from "@/components/owner-form/authentication-form/PhoneForm";
import SocialForm from "@/components/owner-form/authentication-form/SocialForm";
import { IdCard, FileText, Phone, Waypoints } from "lucide-react";

function AuthenticationManagement() {
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
        <AuthItem
          icon={IdCard}
          title="Căn cước công dân"
          form={<IdentifyForm onSubmit={() => {}} />}
        />

        <AuthItem
          icon={Waypoints}
          title="Tài khoản mạng xã hội"
          form={<SocialForm onSubmit={() => {}} />}
        />

        <AuthItem
          icon={FileText}
          title="Giấy phép kinh doanh"
          form={<LicenseForm onSubmit={() => {}} />}
        />

        <AuthItem
          icon={Phone}
          title="Xác thực số điện thoại"
          form={<PhoneForm onSubmit={() => {}} />}
        />
      </div>
    </div>
  );
}

export default AuthenticationManagement;
