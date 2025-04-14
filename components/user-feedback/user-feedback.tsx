import { useState, useEffect } from "react";
import {
  Button,
  Input,
  message as antdMessage,
  Upload,
  Form,
  Card,
  Typography,
  Space,
  Spin,
  Divider,
  Timeline,
} from "antd";
import {
  PlusOutlined,
  SendOutlined,
  InfoCircleOutlined,
  CommentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { BASE_URL } from "@/constants/environments";
import { toast } from "react-toastify";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import Loader from "../loader/Loader";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

interface UserFeedbackDetailProps {
  userId: string;
  bookingId: number;
  feedbackId?: number;
}

interface FeedbackResponse {
  id: number;
  title?: string;
  description: string;
  status: string;
  userId: number;
  ownerId: number;
  bookingId: number;
  workspaceId: number;
  workspaceName: string;
  createdAt: string;
  imageUrls: string[];
}

interface OwnerResponse {
  id: number;
  description: string;
  status: string;
  userId: number;
  ownerId: number;
  feedbackId: number;
  createdAt: string;
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

  const response = await fetch(`${BASE_URL}/images/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Có lỗi xảy ra khi tải lên ảnh.");
  }

  const result = await response.json();
  return result.data[0];
};

const UserFeedbackDetail: React.FC<UserFeedbackDetailProps> = ({
  userId,
  bookingId,
  feedbackId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [existingFeedback, setExistingFeedback] =
    useState<FeedbackResponse | null>(null);
  const [ownerResponse, setOwnerResponse] = useState<OwnerResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loadingResponse, setLoadingResponse] = useState(false);

  useEffect(() => {
    const fetchExistingFeedback = async () => {
      try {
        setLoading(true);

        if (feedbackId) {
          const response = await fetch(`${BASE_URL}/feedbacks/${feedbackId}`);
          if (response.ok) {
            const data = await response.json();
            setExistingFeedback(data);
            if (data && data.id) {
              await fetchOwnerResponse(data.id);
            }
          }
        } else {
          const response = await fetch(
            `${BASE_URL}/feedbacks/booking/${bookingId}`
          );

          if (response.ok) {
            const data = await response.json();
            setExistingFeedback(data);
            if (data && data.id) {
              await fetchOwnerResponse(data.id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingFeedback();
  }, [bookingId, feedbackId]);

  const fetchOwnerResponse = async (feedbackId: number) => {
    try {
      setLoadingResponse(true);
      const response = await fetch(
        `${BASE_URL}/response-feedbacks/feedback/${feedbackId}`
      );

      if (response.ok) {
        const data = await response.json();
        setOwnerResponse(data);
      }
    } catch (error) {
      console.error("Error fetching owner response:", error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      await form.validateFields();

      if (description.trim() === "" || title.trim() === "") {
        toast.error("Vui lòng nhập tiêu đề và nội dung phản hồi.");
        return;
      }

      setSubmitting(true);

      const message: Message = {
        sender: "User",
        content: description,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages([...messages, message]);

      const imageUrls = [];
      for (const file of fileList) {
        try {
          const imageUrl = await uploadImage(file.originFileObj as File);
          imageUrls.push(imageUrl);
        } catch {
          setSubmitting(false);
          antdMessage.error("Tải ảnh lên thất bại.");
          return;
        }
      }

      const feedbackData = {
        title: title,
        description: description,
        userId: parseInt(userId),
        bookingId: bookingId,
        images: imageUrls.map((imgUrl) => ({ imgUrl })),
      };

      const response = await fetch(`${BASE_URL}/feedbacks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) throw new Error();

      const newFeedbackResponse = await response.json();
      setExistingFeedback(newFeedbackResponse);

      toast.success("Phản hồi đã được gửi thành công!");
      setFileList([]);
      setTitle("");
      setDescription("");
      form.resetFields();
      setSubmitting(false);
    } catch {
      setSubmitting(false);
      toast.error("Có lỗi xảy ra khi gửi phản hồi.");
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList }) =>
    setFileList(fileList);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader />
      </div>
    );
  }

  if (existingFeedback) {
    return (
      <Card className="border-0 overflow-hidden shadow-md bg-gradient-to-b from-white to-gray-50">
        <div className="mb-6">
          <Space direction="vertical" size="small" className="w-full">
            <Title level={4} className="text-gray-800 mb-0">
              Phản hồi của bạn
            </Title>
            <Paragraph className="text-gray-500">
              Bạn đã gửi phản hồi cho đặt chỗ này
            </Paragraph>
          </Space>
        </div>

        <Timeline
          items={[
            {
              color: "blue",
              dot: <CommentOutlined style={{ fontSize: "16px" }} />,
              children: (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="mb-2">
                    <Text strong>Ngày gửi:</Text>
                    <Text className="ml-2">
                      {dayjs(existingFeedback.createdAt)
                        .locale("vi")
                        .format("DD/MM/YYYY HH:mm")}
                    </Text>
                  </div>
                  <div className="mb-4">
                    <Text strong>Không gian làm việc:</Text>
                    <Text className="ml-2">
                      {existingFeedback.workspaceName}
                    </Text>
                  </div>
                  <Divider className="my-3" />
                  <div className="mb-4">
                    <Text strong>Nội dung phản hồi:</Text>
                    <Paragraph className="mt-2 whitespace-pre-line">
                      {existingFeedback.description}
                    </Paragraph>
                  </div>

                  {existingFeedback.imageUrls &&
                    existingFeedback.imageUrls.length > 0 && (
                      <div>
                        <Text strong className="block mb-2">
                          Hình ảnh đính kèm:
                        </Text>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {existingFeedback.imageUrls.map((url, index) => (
                            <div
                              key={index}
                              className="aspect-square overflow-hidden rounded-md"
                            >
                              <Image
                                src={url}
                                alt={`Feedback image ${index + 1}`}
                                width={100}
                                height={100}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ),
            },
            ...(ownerResponse
              ? [
                  {
                    color: "green",
                    dot: <CheckCircleOutlined style={{ fontSize: "16px" }} />,
                    children: (
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <Text strong>Phản hồi từ chủ không gian</Text>
                          <Text className="text-gray-500 text-sm">
                            {dayjs(ownerResponse.createdAt)
                              .locale("vi")
                              .format("DD/MM/YYYY HH:mm")}
                          </Text>
                        </div>
                        <Divider className="my-3" />
                        <Paragraph className="whitespace-pre-line">
                          {ownerResponse.description}
                        </Paragraph>
                      </div>
                    ),
                  },
                ]
              : loadingResponse
              ? [
                  {
                    color: "gray",
                    children: (
                      <div className="flex justify-center items-center p-4">
                        <Spin size="small" />
                        <Text className="ml-2">Đang tải phản hồi...</Text>
                      </div>
                    ),
                  },
                ]
              : [
                  {
                    color: "orange",
                    children: (
                      <div className="bg-orange-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <Text strong>Trạng thái phản hồi</Text>
                        </div>
                        <Divider className="my-3" />
                        <Paragraph className="whitespace-pre-line">
                          Chưa phản hồi
                        </Paragraph>
                      </div>
                    ),
                  },
                ]),
          ]}
        />

        {!ownerResponse && !loadingResponse && (
          <div className="bg-amber-50/80 backdrop-blur-sm p-4 rounded-lg flex items-start gap-3 mt-4 border border-amber-100">
            <InfoCircleOutlined className="text-amber-500 mt-1" />
            <div>
              <Text strong className="text-amber-700">
                Lưu ý:
              </Text>
              <Paragraph className="text-amber-700 text-sm mb-0">
                Phản hồi của bạn đang được xem xét. Chúng tôi sẽ trả lời trong
                vòng 24 giờ. Vui lòng kiểm tra email hoặc trung tâm hỗ trợ để
                cập nhật thông tin mới nhất.
              </Paragraph>
            </div>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="mb-6">
        <Space direction="vertical" size="small" className="w-full">
          <Title level={4} className="text-gray-800 mb-0">
            Gửi phản hồi của bạn
          </Title>
          <Paragraph className="text-gray-500">
            Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện dịch vụ
          </Paragraph>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        className="space-y-4"
      >
        <Form.Item
          name="title"
          label={<Text strong>Tiêu đề</Text>}
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input
            size="large"
            placeholder="Nhập tiêu đề phản hồi..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-md"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={<Text strong>Nội dung phản hồi</Text>}
          rules={[
            { required: true, message: "Vui lòng nhập nội dung phản hồi!" },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Mô tả chi tiết trải nghiệm của bạn..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-md"
          />
        </Form.Item>

        <Form.Item
          label={<Text strong>Hình ảnh đính kèm</Text>}
          extra={<Text type="secondary">Tối đa 8 ảnh</Text>}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            accept="image/*"
            className="upload-list-inline"
          >
            {fileList.length >= 8 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <div className="bg-amber-50 p-4 rounded-lg flex items-start gap-3 mb-4">
          <InfoCircleOutlined className="text-amber-500 mt-1" />
          <div>
            <Text strong className="text-amber-700">
              Lưu ý:
            </Text>
            <Paragraph className="text-amber-700 text-sm mb-0">
              Phản hồi của bạn sẽ được xem xét và phản hồi trong thời gian sớm
              nhất. Vui lòng cung cấp thông tin chi tiết để chúng tôi có thể hỗ
              trợ bạn tốt hơn.
            </Paragraph>
          </div>
        </div>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            loading={submitting}
            style={{
              width: "100%",
              backgroundColor: "#8B5E3C",
              borderColor: "#8B5E3C",
              borderRadius: "0.375rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#5A3921";
              e.currentTarget.style.borderColor = "#5A3921";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#8B5E3C";
              e.currentTarget.style.borderColor = "#8B5E3C";
            }}
          >
            Gửi phản hồi
          </Button>
        </Form.Item>
      </Form>

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-lg">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-lg font-medium">Xem trước</h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 relative w-full h-[70vh]">
              <Image
                alt="Preview"
                src={previewImage}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default UserFeedbackDetail;
