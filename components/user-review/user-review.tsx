/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { Modal, Rate } from "antd";
import { Button } from "../ui/button";

interface Review {
  id: number;
  content: string;
  rating: number;
  created_At: string;
  workspace_Name: string;
  owner_Name: string;
  images: { url: string }[];
}

interface ReviewListProps {
  reviews: Review[];
}

const UserReview: React.FC<ReviewListProps> = ({ reviews }) => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">⭐ {reviews.length} Đánh giá của bạn</h2>
      <div className="text-gray-600">
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200 ease-in-out"
                onClick={() => handleReviewClick(review)}
              >
                <div className="flex items-center space-x-2">
                  <Rate disabled defaultValue={review.rating} />
                  <span className="text-gray-700 font-medium">{review.rating}/5</span>
                </div>
                <p className="mt-2 text-gray-800">{review.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Bạn chưa có đánh giá nào</p>
        )}
      </div>

      {selectedReview && (
        <Modal
          width={600}
          title={<h3 className="text-lg font-bold">Đánh giá của bạn</h3>}
          open={!!selectedReview}
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" className="text-white" onClick={handleCloseModal}>
              Đóng
            </Button>,
          ]}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg">
              {selectedReview.rating}/5 <Rate disabled defaultValue={selectedReview.rating} />
            </div>
            <p className="text-gray-600 text-sm">{new Date(selectedReview.created_At).toLocaleString()}</p>
            <hr />
            <div>
              <span className="font-semibold">Không gian làm việc:</span>
              <p className="text-gray-800">{selectedReview.workspace_Name}</p>
            </div>
            <div>
              <span className="font-semibold">Chủ sở hữu:</span>
              <p className="text-gray-800">{selectedReview.owner_Name}</p>
            </div>
            <div>
              <span className="font-semibold">Nội dung:</span>
              <p className="mt-1 text-gray-700">{selectedReview.content}</p>
            </div>
            <div>
              <span className="font-semibold">Hình ảnh:</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {selectedReview.images.length > 0 ? (
                  selectedReview.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Review Image ${index + 1}`}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Không có hình ảnh</p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserReview;