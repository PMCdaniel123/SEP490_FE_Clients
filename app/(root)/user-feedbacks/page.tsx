"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { Spin, List, Card, Typography, Empty, Tag, Tabs } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import Link from "next/link";
import UserFeedbackDetail from "@/components/user-feedback/user-feedback";
import { BASE_URL } from "@/constants/environments";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  price: number;
  status: string;
  createdAt: string;
  userId: number;
  userName: string;
  workspaceId: number;
  workspaceName: string;
  feedbackIds: number[];
  hasOwnerResponse?: boolean;
}

interface FeedbackId {
  id: number;
  bookingId: number;
  hasResponse?: boolean;
  title?: string;
}

export default function UserFeedbacksPage() {
  const { customer } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(null);
  const [feedbackIds, setFeedbackIds] = useState<FeedbackId[]>([]);

  useEffect(() => {
    const fetchFeedbackBookings = async () => {
      if (!customer || !customer.id) return;

      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/user-feedback-bookings/${customer.id}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Sort bookings by newest first (based on createdAt date)
          const sortedData = [...data].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          
          // Check for owner responses for each booking's feedbacks
          const bookingsWithResponseInfo = await Promise.all(sortedData.map(async (booking: Booking) => {
            if (booking.feedbackIds && booking.feedbackIds.length > 0) {
              // Check if any feedback has an owner response
              const feedbacksWithResponseInfo = await Promise.all(booking.feedbackIds.map(async (feedbackId: number) => {
                try {
                  const responseData = await fetch(`${BASE_URL}/response-feedbacks/feedback/${feedbackId}`);
                  if (responseData.ok) {
                    const responseJson = await responseData.json();
                    // Check if we received a valid response with an id
                    return { 
                      id: feedbackId, 
                      bookingId: booking.id, 
                      hasResponse: responseJson && responseJson.id !== 0 
                    };
                  }
                } catch (error) {
                  console.error(`Error fetching response for feedback ${feedbackId}:`, error);
                }
                return { id: feedbackId, bookingId: booking.id, hasResponse: false };
              }));
              
              // Set hasOwnerResponse to true if any feedback has a response
              const hasAnyResponse = feedbacksWithResponseInfo.some(feedback => feedback.hasResponse);
              return { ...booking, hasOwnerResponse: hasAnyResponse };
            }
            return { ...booking, hasOwnerResponse: false };
          }));
          
          setBookings(bookingsWithResponseInfo);
          
          // Select the first booking by default if available
          if (bookingsWithResponseInfo.length > 0) {
            setSelectedBooking(bookingsWithResponseInfo[0]);
            
            // Extract all feedback IDs from the first booking
            if (bookingsWithResponseInfo[0].feedbackIds && bookingsWithResponseInfo[0].feedbackIds.length > 0) {
              const firstFeedbackId = bookingsWithResponseInfo[0].feedbackIds[0];
              
              // Fetch the first feedback details to get the title
              try {
                const feedbackResponse = await fetch(`${BASE_URL}/feedbacks/${firstFeedbackId}`);
                if (feedbackResponse.ok) {
                  const feedbackData = await feedbackResponse.json();
                  
                  // Create feedback IDs with title for the first one
                  const feedbackIdsWithBooking = bookingsWithResponseInfo[0].feedbackIds.map(id => ({
                    id,
                    bookingId: bookingsWithResponseInfo[0].id,
                    title: id === firstFeedbackId ? feedbackData.title : undefined
                  }));
                  
                  setFeedbackIds(feedbackIdsWithBooking);
                  setSelectedFeedbackId(firstFeedbackId);
                }
              } catch (error) {
                console.error(`Error fetching initial feedback details:`, error);
                
                // Fallback if fetching details fails
                const feedbackIdsWithBooking = bookingsWithResponseInfo[0].feedbackIds.map(id => ({
                  id,
                  bookingId: bookingsWithResponseInfo[0].id
                }));
                setFeedbackIds(feedbackIdsWithBooking);
                setSelectedFeedbackId(firstFeedbackId);
              }
            }
          }
        } else {
          console.error("Failed to fetch feedback bookings");
        }
      } catch (error) {
        console.error("Error fetching feedback bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackBookings();
  }, [customer]);

  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking);
    
    // Extract all feedback IDs from the selected booking
    if (booking.feedbackIds && booking.feedbackIds.length > 0) {
      const feedbackIdsWithBooking = booking.feedbackIds.map(id => ({
        id,
        bookingId: booking.id
      }));
      setFeedbackIds(feedbackIdsWithBooking);
      
      // Select the first feedback and fetch its details
      setSelectedFeedbackId(booking.feedbackIds[0]);
      
      // Fetch the feedback details to get the title
      const fetchFirstFeedbackDetails = async () => {
        try {
          const response = await fetch(`${BASE_URL}/feedbacks/${booking.feedbackIds[0]}`);
          if (response.ok) {
            const data = await response.json();
            // Update the feedbackIds array with the title
            setFeedbackIds(prevFeedbacks => 
              prevFeedbacks.map(feedback => 
                feedback.id === booking.feedbackIds[0] ? { ...feedback, title: data.title } : feedback
              )
            );
          }
        } catch (error) {
          console.error(`Error fetching feedback details for ID ${booking.feedbackIds[0]}:`, error);
        }
      };
      
      fetchFirstFeedbackDetails();
    } else {
      setFeedbackIds([]);
      setSelectedFeedbackId(null);
    }
  };

  const handleFeedbackSelect = (feedbackId: number) => {
    setSelectedFeedbackId(feedbackId);
    
    // Fetch the feedback details to get the title
    const fetchFeedbackDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/feedbacks/${feedbackId}`);
        if (response.ok) {
          const data = await response.json();
          // Update the feedbackIds array with the title
          setFeedbackIds(prevFeedbacks => 
            prevFeedbacks.map(feedback => 
              feedback.id === feedbackId ? { ...feedback, title: data.title } : feedback
            )
          );
        }
      } catch (error) {
        console.error(`Error fetching feedback details for ID ${feedbackId}:`, error);
      }
    };
    
    fetchFeedbackDetails();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-36">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Bạn chưa đăng nhập
          </h2>
          <p className="mb-4">
            Vui lòng đăng nhập để xem phản hồi của bạn.
          </p>
          <Link href="/login" className="text-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-36">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#8B5E3C] mb-2">
          Phản hồi của tôi
        </h2>
        <p className="text-gray-600">
          Xem lại các phản hồi bạn đã gửi và phản hồi từ chủ không gian.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="shadow-md border-0 overflow-hidden">
            <Title level={5} className="mb-4">Đặt chỗ có phản hồi</Title>
            
            {bookings.length === 0 ? (
              <Empty 
                description="Không có phản hồi nào" 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
              />
            ) : (
              <List
                dataSource={bookings}
                renderItem={(booking) => (
                  <List.Item 
                    key={booking.id}
                    onClick={() => handleBookingSelect(booking)}
                    className={`cursor-pointer transition-all duration-200 rounded-md p-3 mb-2 ${
                      selectedBooking?.id === booking.id 
                        ? 'bg-amber-50 border border-amber-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-1">
                        <Text strong className="text-[#8B5E3C]">
                          {booking.workspaceName}
                        </Text>
                        {booking.hasOwnerResponse ? (
                          <Tag color="green">Đã phản hồi</Tag>
                        ) : (
                          <Tag color="volcano">Chưa phản hồi</Tag>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>
                          {dayjs(booking.startDate).format('DD/MM/YYYY')}
                        </span>
                        <span>
                          <MessageOutlined className="mr-1" />
                          Xem chi tiết
                        </span>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedBooking && customer && customer.id ? (
            <Card className="shadow-md border-0">
              {feedbackIds.length > 0 ? (
                <>
                  {feedbackIds.length > 1 && (
                    <Tabs 
                      activeKey={selectedFeedbackId?.toString()} 
                      onChange={(key) => handleFeedbackSelect(parseInt(key))}
                      className="mb-4"
                    >
                      {feedbackIds.map((feedback, index) => (
                        <TabPane 
                          tab={`Phản hồi ${index + 1}`} 
                          key={feedback.id.toString()}
                        />
                      ))}
                    </Tabs>
                  )}
                  
                  {selectedFeedbackId && (
                    <div key={selectedFeedbackId}>
                      <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <Text strong className="text-[#8B5E3C]">Thông tin phản hồi</Text>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <div>
                            <Text strong>Mã đặt chỗ:</Text>
                            <Text className="ml-2">#{selectedBooking.id}</Text>
                          </div>
                          {feedbackIds.find(f => f.id === selectedFeedbackId)?.title && (
                            <div>
                              <Text strong>Tiêu đề:</Text>
                              <Text className="ml-2">
                                {feedbackIds.find(f => f.id === selectedFeedbackId)?.title}
                              </Text>
                            </div>
                          )}
                        </div>
                      </div>
                      <UserFeedbackDetail 
                        userId={customer.id.toString()} 
                        bookingId={selectedBooking.id}
                        feedbackId={selectedFeedbackId}
                      />
                    </div>
                  )}
                </>
              ) : (
                <Empty 
                  description="Không có phản hồi nào cho đặt chỗ này" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          ) : (
            <Card className="shadow-md border-0 h-full flex items-center justify-center">
              <Empty 
                description="Chọn một đặt chỗ để xem phản hồi" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
