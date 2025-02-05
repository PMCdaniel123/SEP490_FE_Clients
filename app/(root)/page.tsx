"use client";

import SearchBanner from "@/components/search-banner/search-banner";
import SpaceList from "@/components/space-list/space-list";
import NearSpaceList from "@/components/near-space-list/near-space-list";
import HighRatingSpace from "@/components/high-rating-space/high-rating-space";
import SectionTitle from "@/components/ui/section-tilte";

function HomePage() {
  return (
    <div>
      <SearchBanner />
      <div className="max-w-6xl mx-auto p-6">
        <SectionTitle>
          WorkHive cung cấp đa dạng <br /> giải pháp không gian làm việc
        </SectionTitle>
        <SpaceList />
        <SectionTitle>Nơi làm việc gần bạn</SectionTitle>
        <NearSpaceList />
        <SectionTitle>
          Không gian làm việc <br /> được đánh giá cao
        </SectionTitle>
        <HighRatingSpace />
      </div>
    </div>
  );
}

export default HomePage;
