/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { Modal, Rate, Input, Upload, Image } from "antd";
import { Button } from "../ui/button";
import Pagination from "../pagination/pagination";
import { BASE_URL } from "@/constants/environments";
import { toast } from "react-toastify";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  CloseOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import type {
  UploadFile,
  UploadProps,
  UploadFileStatus,
} from "antd/es/upload/interface";
import dayjs from "dayjs";
import { Star } from "lucide-react";

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
  userId: number;
  onReviewUpdated: () => void;
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UserReview: React.FC<ReviewListProps> = ({
  reviews,
  userId,
  onReviewUpdated,
}) => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState<{
    rating: number;
    content: string;
    images: { url: string }[];
  }>({
    rating: 0,
    content: "",
    images: [],
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const reviewsPerPage = 3;
  const { TextArea } = Input;

  const handleReviewClick = (review: Review) => {
    const reviewCopy = JSON.parse(JSON.stringify(review));
    setSelectedReview(reviewCopy);

    setTimeout(() => {
      const event = new Event("resize");
      window.dispatchEvent(event);
    }, 0);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
    setIsEditing(false);
    setFileList([]);
    setPreviewImage("");
  };

  const handleEditClick = () => {
    if (selectedReview) {
      setEditedReview({
        rating: selectedReview.rating,
        content: selectedReview.content,
        images: selectedReview.images,
      });
      const initialFileList = selectedReview.images.map((image, index) => ({
        uid: `-${index}`,
        name: `image-${index}.png`,
        status: "done" as UploadFileStatus,
        url: image.url,
        type: "image/jpeg",
        size: 0,
      })) as UploadFile[];

      setFileList(initialFileList);
      setIsEditing(true);
    }
  };

  const handleEditChange = (field: string, value: string | number) => {
    if (field === "rating") {
      setEditedReview((prev) => ({
        ...prev,
        [field]: value as number,
      }));
    } else {
      setEditedReview((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "workspace_images");

    try {
      setUploading(true);

      const response = await fetch(`${BASE_URL}/images/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi tải lên ảnh.");
      }

      const data = await response.json();
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        return data.data[0];
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedReview) return;

    try {
      setUploading(true);

      const imageUrls = [];
      for (const file of fileList) {
        if (file.url) {
          console.log("Adding existing image:", file.url);
          imageUrls.push({ url: file.url });
        } else if (file.originFileObj) {
          try {
            console.log("Uploading new image...");
            const url = await uploadImage(file.originFileObj as File);
            console.log("Successfully uploaded image, got URL:", url);
            imageUrls.push({ url });
          } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Có lỗi xảy ra khi tải lên ảnh.");
            setUploading(false);
            return;
          }
        }
      }

      console.log("Final imageUrls to be sent to server:", imageUrls);

      const response = await fetch(`${BASE_URL}/users/updaterating`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          ratingId: selectedReview.id,
          rate: editedReview.rating,
          comment: editedReview.content,
          images: imageUrls,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Update failed with response:",
          response.status,
          errorData
        );
        throw new Error(
          errorData.message || "Có lỗi xảy ra khi cập nhật đánh giá."
        );
      }

      const responseData = await response.json();
      console.log("Update success response:", responseData);

      toast.success("Cập nhật đánh giá thành công!", {
        position: "top-right",
        autoClose: 1500,
      });

      setIsEditing(false);
      setSelectedReview(null);
      setFileList([]);
      onReviewUpdated();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedReview) return;

    try {
      const response = await fetch(`${BASE_URL}/users/deleterating`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          ratingId: selectedReview.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi xóa đánh giá.");
      }

      toast.success("Xóa đánh giá thành công!", {
        position: "top-right",
        autoClose: 1500,
      });

      setIsDeleteModalOpen(false);
      setSelectedReview(null);
      onReviewUpdated();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };

  const sortedReviews = [...reviews].sort(
    (a, b) =>
      new Date(b.created_At).getTime() - new Date(a.created_At).getTime()
  );

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Star size={20} stroke={"0"} fill="#FFC107" /> {reviews.length} Đánh giá
        của bạn
      </h2>
      <div className="text-gray-600">
        {reviews.length > 0 ? (
          <>
            <ul className="space-y-4">
              {currentReviews.map((review) => (
                <li
                  key={review.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200 ease-in-out"
                  onClick={() => handleReviewClick(review)}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {review.workspace_Name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Rate disabled defaultValue={review.rating} />
                      <span className="text-gray-700 font-medium">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-800">{review.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      {dayjs(review.created_At).format("HH:mm:ss, DD/MM/YYYY")}
                    </p>
                  </div>
                  {review.images.length > 0 && (
                    <div className="mt-2 flex space-x-2 overflow-x-auto">
                      {review.images.slice(0, 2).map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`Review Image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ))}
                      {review.images.length > 2 && (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                          +{review.images.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(reviews.length / reviewsPerPage)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        ) : (
          <p className="text-center text-gray-500">Bạn chưa có đánh giá nào</p>
        )}
      </div>

      {selectedReview && !isEditing && (
        <Modal
          width={600}
          title={<h3 className="text-lg font-bold">Đánh giá của bạn</h3>}
          open={!!selectedReview && !isEditing && !isDeleteModalOpen}
          onCancel={handleCloseModal}
          zIndex={1000}
          maskClosable={true}
          className="review-detail-modal"
          footer={
            <div className="flex justify-end space-x-3">
              <Button
                key="edit"
                className="bg-primary hover:bg-secondary text-white px-4 py-2 flex items-center"
                onClick={handleEditClick}
              >
                <EditOutlined className="mr-1" /> Chỉnh sửa
              </Button>
              <Button
                key="delete"
                className="bg-red-400 hover:bg-red-600 text-white px-4 py-2 flex items-center"
                onClick={handleDeleteClick}
              >
                <DeleteOutlined className="mr-1" /> Xóa
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg gap-2">
              {selectedReview.rating}/5
              <Rate disabled defaultValue={selectedReview.rating} />
            </div>
            <p className="text-gray-600 text-sm">
              {dayjs(selectedReview.created_At).format("HH:mm:ss, DD/MM/YYYY")}
            </p>
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

      {selectedReview && isEditing && (
        <Modal
          width={600}
          title={<h3 className="text-lg font-bold">Chỉnh sửa đánh giá</h3>}
          open={!!selectedReview && isEditing}
          onCancel={handleCloseModal}
          footer={
            <div className="flex justify-end space-x-3">
              <Button
                key="cancel"
                className="bg-white hover:text-white text-black mr-2 flex items-center"
                onClick={() => setIsEditing(false)}
              >
                <CloseOutlined className="mr-1" /> Hủy
              </Button>
              <Button
                key="save"
                className="bg-primary hover:bg-secondary text-white flex items-center"
                onClick={handleSaveEdit}
                disabled={uploading}
              >
                <SaveOutlined className="mr-1" />
                {uploading ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Đánh giá:</span>
              <Rate
                value={editedReview.rating}
                onChange={(value) => handleEditChange("rating", value)}
                className="ml-2"
              />
            </div>
            <div>
              <span className="font-semibold">Nội dung:</span>
              <TextArea
                rows={4}
                value={editedReview.content}
                onChange={(e) => handleEditChange("content", e.target.value)}
                className="mt-2 w-full"
                placeholder="Nhập nội dung đánh giá của bạn"
              />
            </div>
            <div>
              <span className="font-semibold">Hình ảnh:</span>
              <div className="mt-2">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith("image/");
                    if (!isImage) {
                      toast.error("Chỉ có thể tải lên tệp hình ảnh!");
                      return Upload.LIST_IGNORE;
                    }
                    return false;
                  }}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <p className="text-xs text-gray-500 mt-1">Tối đa 8 hình ảnh</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
          alt="Preview"
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <h3 className="text-lg font-bold text-red-500 flex items-center">
            <DeleteOutlined className="mr-2" /> Xác nhận xóa
          </h3>
        }
        open={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        zIndex={1051}
        maskClosable={false}
        className="delete-confirmation-modal"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              className="bg-white hover:text-white text-black"
              key="cancel"
              onClick={handleCancelDelete}
            >
              Hủy
            </Button>
            <Button
              key="delete"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 flex items-center"
              onClick={handleConfirmDelete}
            >
              <DeleteOutlined className="mr-1" /> Xóa
            </Button>
          </div>
        }
      >
        <div className="py-4">
          <p className="text-gray-700">
            Bạn có chắc chắn muốn xóa đánh giá này không?
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Hành động này không thể hoàn tác.
          </p>

          {selectedReview && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-2">
                <Rate disabled defaultValue={selectedReview.rating} />
                <span className="text-sm">{selectedReview.rating}/5</span>
              </div>
              <p className="mt-1 text-sm text-gray-700 line-clamp-2">
                {selectedReview.content}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default UserReview;
