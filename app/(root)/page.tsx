"use client";

import SearchBanner from "@/components/search-banner/search-banner";
import SpaceList from "@/components/space-list/space-list";
// import NearSpaceList from "@/components/near-space-list/near-space-list";
import HighRatingSpace from "@/components/high-rating-space/high-rating-space";
import SectionTitle from "@/components/ui/section-tilte";
import Banner from "@/components/ui/banner";
import FeatureSection from "@/components/ui/feauture-section";
import { Send } from "lucide-react";

function HomePage() {
  return (
    <div>
      <SearchBanner />
      <div className="max-w-7xl mx-auto p-6 mt-8">
        <SectionTitle>
          WorkHive cung cấp đa dạng <br /> giải pháp không gian làm việc
        </SectionTitle>
        <SpaceList />
        {/* <div className="flex items-center justify-between mb-4 mt-12">
          <SectionTitle>Nơi làm việc gần bạn</SectionTitle>
          <div className="flex items-center text-[#835101] cursor-pointer">
            <MapPin className="mr-2 text-black" size={24} />
            <span>
              Hiển thị <br />
              trên bản đồ
            </span>
          </div>
        </div> */}
        {/* <NearSpaceList /> */}
        <div className="mb-8 mt-16">
          <SectionTitle>
            Không gian làm việc <br /> được đánh giá cao
          </SectionTitle>
        </div>
        <HighRatingSpace />
        <div className="mt-12">
          <Banner
            imageUrl="/banner1.png"
            title="Đăng ký dịch vụ của WorkHive ngay"
            subtitle="Tăng thêm thu nhập từ không gian của bạn..."
            buttonText="Trở thành doanh nghiệp ngay"
            buttonLink="/become-owner"
          />
        </div>
        <FeatureSection
          title="Khám phá thêm về việc trở thành chủ không gian làm việc"
          description="Tận dụng tối đa tiềm năng không gian của bạn với nền tảng của chúng tôi..."
          buttonText="Đăng ký ngay"
          buttonLink="/become-owner"
          secondaryLinks={[
            { text: "Tư vấn Hotline", href: "#" },
            { text: "Nhắn tin Fanpage", href: "#" },
          ]}
          imageUrl="/feauture-section.jpg"
        />
      </div>
      <div className="bg-[#7B4A02] py-6 px-6 flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="text-white text-center md:text-left">
          <h3 className="text-lg font-bold">Liên hệ ngay</h3>
          <p className="text-sm opacity-80">Phản hồi nhanh chóng</p>
        </div>
        <div className="relative w-full max-w-lg">
          <input
            type="email"
            placeholder="Nhập email..."
            className="w-full py-3 pl-6 pr-14 rounded-full text-gray-700 placeholder-gray-400 shadow-md focus:outline-none"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-400 hover:bg-gray-500 text-white p-3 rounded-full transition">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
