import React from "react";

interface Review {
  id: number;
  content: string;
  rating: number;
}

interface ReviewListProps {
  reviews: Review[];
}

const UserReview: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div>
      <p className="mt-6 font-semibold">⭐ {reviews.length} Đánh giá của bạn</p>
      <div className="mt-2 text-gray-600">
        {reviews.length > 0 ? (
          <ul className="space-y-2">
            {reviews.map((review) => (
              <li key={review.id} className="border-b pb-2">
                <p className="font-semibold">Rating: {review.rating} ⭐</p>
                <p>{review.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Reviewed Bởi Bạn</p>
        )}
      </div>
    </div>
  );
};

export default UserReview;