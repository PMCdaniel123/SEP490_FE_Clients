import { useState, useEffect } from "react";
import dayjs from "dayjs";
import ReviewItem from "./review-item";
import Loader from "../loader/Loader";

interface Review {
  rate: number;
  comment: string;
  created_At: string;
  workspace_Name: string;
  owner_Name: string;
  user_Name: string;
  user_Avatar: string;
  images: { url: string }[];
}

interface ReviewListProps {
  workspaceId: string;
}

function ReviewList({ workspaceId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hasImages, setHasImages] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://localhost:5050/users/rating/getallratingbyworkspaceid/${workspaceId}`);
        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi tải đánh giá.");
        }
        const data = await response.json();
        setReviews(data.ratingByWorkspaceIdDTOs);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [workspaceId]);

  const filterReviews = () => {
    let filtered = reviews;

    if (selectedRating) {
      filtered = filtered.filter((review) => review.rate === selectedRating);
    }

    if (hasImages) {
      filtered = filtered.filter((review) => review.images.length > 0);
    }

    return filtered;
  };

  const filteredReviews = filterReviews();
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rate, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex items-center mb-4 space-x-4">
            <div className="text-lg font-semibold text-primary flex items-center">
              <span className="text-2xl">{averageRating}</span>
              <span className="ml-1">trên 5</span>
            </div>
            <div className="text-yellow-500 flex">
              {"★".repeat(Math.round(parseFloat(averageRating)))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              className={`px-4 py-2 rounded-lg border ${selectedRating === null ? "bg-primary text-white" : "border-gray-300"}`}
              onClick={() => setSelectedRating(null)}
            >
              Tất Cả
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                className={`px-4 py-2 rounded-lg border ${selectedRating === star ? "bg-primary text-white" : "border-gray-300"}`}
                onClick={() => setSelectedRating(star)}
              >
                {star} Sao ({reviews.filter((r) => r.rate === star).length})
              </button>
            ))}
            <button
              className={`px-4 py-2 rounded-lg border ${hasImages ? "bg-gray-500 text-white" : "border-gray-300"}`}
              onClick={() => setHasImages(!hasImages)}
            >
              Có Hình Ảnh ({reviews.filter((r) => r.images.length > 0).length})
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {(showAll ? filteredReviews : filteredReviews.slice(0, 4)).map((review, index) => (
              <ReviewItem
                key={index}
                avatar={review.user_Avatar}
                name={review.user_Name}
                date={dayjs(review.created_At).format("DD/MM/YYYY HH:mm")}
                rating={review.rate}
                review={review.comment}
                images={review.images}
              />
            ))}
          </div>

          <button
            className="text-primary border border-primary rounded-xl p-4 font-semibold md:max-w-[250px] hover:bg-primary hover:text-white transition-colors duration-300"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Rút gọn các đánh giá" : "Hiển thị thêm đánh giá"}
          </button>
        </>
      )}
    </div>
  );
}

export default ReviewList;