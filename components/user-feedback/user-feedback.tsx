import { useState } from "react";
import { Button, Input, message as antdMessage, Upload, Image } from "antd";
import { PlusOutlined, SendOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

const { TextArea } = Input;

interface Message {
    sender: string;
    content: string;
    timestamp: string;
}

interface ContactChatProps {
    userId: string;
    ownerId: number;
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

const ContactChat: React.FC<ContactChatProps> = ({ userId, ownerId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;

        const message: Message = {
            sender: "User",
            content: newMessage,
            timestamp: new Date().toLocaleTimeString(),
        };

        setMessages([...messages, message]);
        setNewMessage("");

        const imageUrls = [];
        for (const file of fileList) {
            try {
                const imageUrl = await uploadImage(file.originFileObj as File);
                imageUrls.push(imageUrl);
            } catch (error) {
                antdMessage.error("Tải ảnh lên thất bại.");
                return;
            }
        }

        const feedbackData = {
            description: newMessage,
            userId,
            ownerId,
            images: imageUrls.map((url) => ({ imgUrl: url })),
        };

        try {
            const response = await fetch("https://localhost:5050/feedbacks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedbackData),
            });

            if (!response.ok) throw new Error();

            antdMessage.success("Phản hồi đã được gửi thành công!");
            setFileList([]);
        } catch (error) {
            antdMessage.error("Có lỗi xảy ra khi gửi phản hồi.");
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

    return (
        <div className="max-w-xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">

            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-3">
                <h3 className="text-white text-xl font-semibold">Liên hệ hỗ trợ</h3>
            </div>

            <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "User" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs rounded-lg py-2 px-3 ${msg.sender === "User" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                            <p className="text-sm">{msg.content}</p>
                            <span className="block text-xs opacity-70 mt-1">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-200">
                <TextArea
                    rows={2}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="mb-2"
                />

                <div className="mb-2 text-sm font-medium text-gray-600">Ảnh đính kèm (tối đa 8 ảnh)</div>

                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    accept="image/*"
                >
                    {fileList.length >= 8 ? null : (
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Tải ảnh</div>
                        </div>
                    )}
                </Upload>

                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}

                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    className="w-full mt-2"
                >
                    Gửi phản hồi
                </Button>
            </div>

        </div>
    );
};

export default ContactChat;
