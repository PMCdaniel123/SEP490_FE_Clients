import { useState, useEffect } from "react";
import { Modal, Rate, Input, Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Users, Ruler, Bed } from "lucide-react";
import type { UploadFile, UploadProps } from "antd";
import { Button } from "../ui/button";

interface ReviewFormProps {
  isReviewModalOpen: boolean;
  handleReviewCancel: () => void;
  handleReviewSubmit: (review: { rating: number; comment: string; images: string[] }) => void;
  workspaceName: string;
  workspaceCategory: string;
  workspaceCapacity: number;
  workspaceImageUrl: string;
  workspaceArea: number;
  licenseName: string;
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const uploadImage = async (image: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch("https://localhost:5050/images/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Có lỗi xảy ra khi tải lên ảnh.");
  }

  const result = await response.json();
  return result.data[0];
};

const ReviewForm: React.FC<ReviewFormProps> = ({
  isReviewModalOpen,
  handleReviewCancel,
  handleReviewSubmit,
  workspaceName,
  workspaceCategory,
  workspaceCapacity,
  workspaceImageUrl,
  workspaceArea,
  licenseName,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!isReviewModalOpen) {
      setRating(0);
      setComment("");
      setFileList([]);
      setPreviewImage("");
    }
  }, [isReviewModalOpen]);

  const onSubmit = async () => {
    const imageUrls = [];
    for (const file of fileList) {
      try {
        const imageUrl = await uploadImage(file.originFileObj as File);
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error("Image upload failed:", error);
        return;
      }
    }

    const reviewData = { rating, comment, images: imageUrls };
    handleReviewSubmit(reviewData);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title="Đánh giá không gian làm việc"
      open={isReviewModalOpen}
      onCancel={handleReviewCancel}
      footer={null}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <img src={workspaceImageUrl} alt="Workspace Image" className="w-16 h-16 object-cover rounded-lg shadow-md" />
          <div>
            <h3 className="font-semibold">{workspaceName}</h3>
            <p className="text-gray-600 text-sm mt-2">{licenseName}</p>
            <div className="flex items-center text-gray-600 text-sm mt-2">
              <span className="flex items-center mr-2">
                <Users className="mr-1" size={16} /> {workspaceCapacity}
              </span>
              <span className="flex items-center mr-2">
                <Ruler className="mr-1" size={16} /> {workspaceArea}
              </span>
              <span className="flex items-center">
                <Bed className="mr-1" size={16} /> {workspaceCategory}
              </span>
            </div>
          </div>
        </div>
        <h5 className="font-semibold text-sm">Chất lượng không gian</h5>
        <Rate onChange={setRating} value={rating} />
        <Input.TextArea
          rows={4}
          placeholder="Hãy chia sẻ những điều bạn thích và không thích về không gian làm việc này với những người dùng khác nhé."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="text-sm text-gray-500">Hình ảnh minh họa</div>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
        <div className="flex justify-end">
          <Button className="text-white" onClick={onSubmit}>
            Gửi đánh giá
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewForm;