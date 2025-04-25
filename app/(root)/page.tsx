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
import NearSpaceList from "@/components/near-space-list/near-space-list";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AnimateInView from "@/components/animate-ui/animate-section";

function HomePage() {
  const [km, setKm] = useState("5");

  return (
    <div>
      <SearchBanner />
      <div className="w-full md:w-[90%] mx-auto p-6 mt-8">
        <AnimateInView>
          <div>
            <SectionTitle>
              WorkHive cung cấp đa dạng <br /> giải pháp không gian làm việc
            </SectionTitle>

            <SpaceList />
          </div>
        </AnimateInView>

        <AnimateInView delay={0.2}>
          <div>
            <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-0">
              <SectionTitle>Nơi làm việc gần bạn</SectionTitle>
              <div className="flex items-center gap-2 text-sm">
                <p>Khoảng cách mong muốn</p>
                <Select value={km} onValueChange={(value) => setKm(value)}>
                  <SelectTrigger className="py-4 px-2 rounded-md w-full">
                    <SelectValue placeholder="Chọn khoảng cách mong muốn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                      value="5"
                    >
                      5 km
                    </SelectItem>
                    <SelectItem
                      className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                      value="10"
                    >
                      10 km
                    </SelectItem>
                    <SelectItem
                      className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                      value="15"
                    >
                      15 km
                    </SelectItem>
                    <SelectItem
                      className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                      value="20"
                    >
                      20 km
                    </SelectItem>
                    <SelectItem
                      className="rounded-sm flex items-center gap-2 focus:bg-primary focus:text-white p-2 transition-colors duration-200"
                      value="All"
                    >
                      Trên 20 km
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <NearSpaceList km={km} />
          </div>
        </AnimateInView>

        <AnimateInView delay={0.4}>
          <div>
            <div className="mt-12">
              <SectionTitle>
                Không gian làm việc <br /> được đánh giá cao
              </SectionTitle>
            </div>

            <HighRatingSpace />
          </div>
        </AnimateInView>

        <AnimateInView delay={0.6}>
          <div>
            <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-0">
              <SectionTitle>
                Các thương hiệu hàng đầu <br /> mà bạn không thể bỏ lỡ!
              </SectionTitle>
              <Link
                href={"/workspace-owner"}
                className="flex items-center gap-2 font-semibold md:text-sm text-primary cursor-pointer hover:underline hover:text-secondary transition-colors duration-300"
              >
                <Search />
                <span>Xem tất cả</span>
              </Link>
            </div>

            <HotWorkspaceOwner />
          </div>
        </AnimateInView>

        <div className="mt-12">
          <AnimatedGradientSection
            gradient="warm"
            className="p-6 rounded-lg"
            height="auto"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <AnimatedText
                  text="Đăng ký dịch vụ của WorkHive ngay"
                  animation="fade"
                  tag="h3"
                  className="text-xl font-bold text-white mb-4"
                />
                <p className="text-white/90 mb-6 text-sm">
                  Tăng thêm thu nhập từ không gian của bạn. Chúng tôi giúp bạn
                  kết nối với khách hàng tiềm năng và quản lý không gian một
                  cách hiệu quả.
                </p>
                <motion.a
                  href="/become-owner"
                  whileHover={{ scale: 1.005 }}
                  className="inline-block bg-white text-primary text-sm px-4 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Trở thành doanh nghiệp ngay
                </motion.a>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/banner1.png"
                  alt="WorkHive Services"
                  className="rounded-lg shadow-2xl w-full object-cover max-h-[300px]"
                />
              </div>
            </div>
          </AnimatedGradientSection>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <h3 className="text-lg font-bold mb-2">Dễ dàng kết nối</h3>
            <p className="text-gray-600 text-sm">
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
            <h3 className="text-lg font-semibold mb-2">Giá cả linh hoạt</h3>
            <p className="text-gray-600 text-sm">
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
            <h3 className="text-lg font-semibold mb-2">Dịch vụ chất lượng</h3>
            <p className="text-gray-600 text-sm">
              Cam kết mang đến trải nghiệm làm việc tốt nhất với không gian và
              tiện ích hiện đại.
            </p>
          </FloatingCard>
        </div>

        <FeatureSection
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
        rounded="none"
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
