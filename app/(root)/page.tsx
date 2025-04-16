/* eslint-disable @next/next/no-img-element */
"use client";

import SearchBanner from "@/components/search-banner/search-banner";
import SpaceList from "@/components/space-list/space-list";
import HighRatingSpace from "@/components/high-rating-space/high-rating-space";
import SectionTitle from "@/components/ui/section-tilte";
// import Banner from "@/components/ui/banner";
import FeatureSection from "@/components/ui/feauture-section";
import { Search, Send } from "lucide-react";
import AnimatedText from "@/components/animate-ui/animated-text";
import AnimatedGradientSection from "@/components/animate-ui/animated-gradient-section";
import FloatingCard from "@/components/animate-ui/floating-card";
import { motion } from "framer-motion";
import Link from "next/link";
import HotWorkspaceOwner from "@/components/hot-workspace-owner/hot-workspace-owner";

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

        <div className="mb-8 mt-16 flex items-center justify-between">
          <SectionTitle>
            Các thương hiệu hàng đầu <br /> mà bạn không thể bỏ lỡ!
          </SectionTitle>
          <Link
            href={"/workspace-owner"}
            className="flex items-center gap-2 font-semibold md:text-base text-primary cursor-pointer hover:underline hover:text-secondary transition-colors duration-300"
          >
            <Search />
            <span>Xem tất cả</span>
          </Link>
        </div>

        <HotWorkspaceOwner />

        <div className="mt-20 mb-16">
          <AnimatedGradientSection
            gradient="warm"
            className="p-8 rounded-2xl"
            height="auto"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <AnimatedText
                  text="Đăng ký dịch vụ của WorkHive ngay"
                  animation="fade"
                  tag="h3"
                  className="text-2xl md:text-3xl font-bold text-white mb-4"
                />
                <p className="text-white/90 mb-6">
                  Tăng thêm thu nhập từ không gian của bạn. Chúng tôi giúp bạn
                  kết nối với khách hàng tiềm năng và quản lý không gian một
                  cách hiệu quả.
                </p>
                <motion.a
                  href="/become-owner"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block bg-white text-primary px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Trở thành doanh nghiệp ngay
                </motion.a>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/banner1.png"
                  alt="WorkHive Services"
                  className="rounded-xl shadow-2xl w-full object-cover max-h-[300px]"
                />
              </div>
            </div>
          </AnimatedGradientSection>
        </div>

        <div className="mt-20 mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FloatingCard className="p-6 bg-white border border-gray-100 h-full">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#835101"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 7h-9"></path>
                <path d="M14 17H5"></path>
                <circle cx="17" cy="17" r="3"></circle>
                <circle cx="7" cy="7" r="3"></circle>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Dễ dàng kết nối</h3>
            <p className="text-gray-600">
              Kết nối khách hàng với không gian làm việc phù hợp một cách nhanh
              chóng và hiệu quả.
            </p>
          </FloatingCard>

          <FloatingCard className="p-6 bg-white border border-gray-100 h-full">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#835101"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20"></path>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Giá cả linh hoạt</h3>
            <p className="text-gray-600">
              Đa dạng các mức giá phù hợp với nhu cầu và ngân sách của từng
              khách hàng.
            </p>
          </FloatingCard>

          <FloatingCard className="p-6 bg-white border border-gray-100 h-full">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#835101"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Dịch vụ chất lượng</h3>
            <p className="text-gray-600">
              Cam kết mang đến trải nghiệm làm việc tốt nhất với không gian và
              tiện ích hiện đại.
            </p>
          </FloatingCard>
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

      <AnimatedGradientSection
        gradient="warm"
        className="py-8 px-6"
        interactive={false}
        animationSpeed="slow"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-7xl mx-auto">
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
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-400 hover:bg-primary text-white p-3 rounded-full transition">
              <Send size={18} />
            </button>
          </div>
        </div>
      </AnimatedGradientSection>
    </div>
  );
}

export default HomePage;
