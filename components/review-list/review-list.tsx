import { useState } from "react";
import ReviewItem from "./review-item";
import { reviews } from "@/constants/constant";

function ReviewList() {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {(showAll ? reviews : reviews.slice(0, 4)).map((review, index) => (
          <ReviewItem
            key={index}
            avatar={review.avatar}
            name={review.name}
            date={review.date}
            rating={review.rating}
            review={review.review}
          />
        ))}
      </div>
      <button
        className="text-fourth border border-1 border-primary rounded-xl p-4 font-semibold md:max-w-[250px] hover:bg-primary hover:text-white transition-colors duration-300"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? "Rút gọn các đánh giá" : "Hiển thị thêm đánh giá"}
      </button>
    </div>
  );
}

export default ReviewList;
