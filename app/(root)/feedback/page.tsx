"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import Link from "next/link";
import { Alert } from "antd";
import UserFeedbackDetail from "@/components/user-feedback/user-feedback";
import Loader from "@/components/loader/Loader";

function FeedbackContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const { customer } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setLoading(false);
    }
  }, [customer]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!bookingId || !customer) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-36">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Thông tin không hợp lệ
          </h2>
          <p className="mb-4">
            Không tìm thấy thông tin đặt chỗ hoặc bạn chưa đăng nhập.
          </p>
          <Link
            href="/purchase-history"
            className="text-primary hover:underline"
          >
            Quay lại lịch sử thanh toán
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-36">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#8B5E3C] mb-2">Phản hồi</h2>
        <p className="text-gray-600">
          Hãy chia sẻ ý kiến của bạn về trải nghiệm đặt chỗ. Phản hồi của bạn
          giúp chúng tôi cải thiện dịch vụ.
        </p>
      </div>

      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          className="mb-6"
          closable
          onClose={() => setError(null)}
        />
      )}

      <div>
        {customer && customer.id && (
          <UserFeedbackDetail
            userId={customer.id.toString()}
            bookingId={parseInt(bookingId)}
          />
        )}
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader /></div>}>
      <FeedbackContent />
    </Suspense>
  );
}
