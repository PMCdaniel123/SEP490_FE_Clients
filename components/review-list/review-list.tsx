import { useState } from "react";
import ReviewItem from "./review-item";

const reviews = [
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn A",
    date: "14/02/2025",
    rating: 5,
    review:
      "Không gian làm việc rất chuyên nghiệp và yên tĩnh, phù hợp để tập trung hoàn toàn vào công việc",
  },
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn B",
    date: "14/02/2025",
    rating: 4,
    review:
      "Không gian làm việc rất chuyên nghiệp và yên tĩnh, phù hợp để tập trung hoàn toàn vào công việc",
  },
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn C",
    date: "14/02/2025",
    rating: 3,
    review:
      "Không gian làm việc rất chuyên nghiệp và yên tĩnh, phù hợp để tập trung hoàn toàn vào công việc",
  },
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn D",
    date: "14/02/2025",
    rating: 5,
    review:
      "Không gian làm việc rất chuyên nghiệp và yên tĩnh, phù hợp để tập trung hoàn toàn vào công việc",
  },
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn E",
    date: "14/02/2025",
    rating: 4,
    review: "Một nơi làm việc đáng trải nghiệm với môi trường chuyên nghiệp",
  },
  {
    avatar: "/logo.png",
    name: "Nguyễn Văn F",
    date: "14/02/2025",
    rating: 5,
    review: "Tuyệt vời! Không gian thoải mái và tiện ích đầy đủ",
  },
];

function ReviewList() {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4">
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
