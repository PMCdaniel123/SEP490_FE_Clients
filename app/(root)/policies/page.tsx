import React from "react";

export default function PartnershipTerms() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-800">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-8 text-center">
        Điều Khoản Hợp Tác Giữa Chủ Không Gian và Nền Tảng WorkHive
      </h1>

      <div className="space-y-8">
        <Section
          title="1. Đăng Ký và Xác Minh"
          content={[
            "Chủ không gian phải cung cấp thông tin chính xác, bao gồm: giấy phép kinh doanh (nếu có), thông tin liên hệ, và mô tả chi tiết về không gian làm việc.",
            "WorkHive có quyền xác minh tính hợp lệ của thông tin và từ chối hợp tác nếu phát hiện gian lận.",
          ]}
        />

        <Section
          title="2. Quản Lý Không Gian Làm Việc"
          content={[
            "Owner chịu trách nhiệm tạo, cập nhật và duy trì thông tin chi tiết về không gian làm việc trên hệ thống, bao gồm:",
          ]}
          list={[
            "Loại hình không gian (Bàn cá nhân, Văn phòng, Phòng họp, Phòng hội thảo)",
            "Giá thuê, hình ảnh, tiện ích, giờ hoạt động,...",
          ]}
          note="Thông tin phải đảm bảo tính chính xác, minh bạch, và không gây hiểu nhầm cho khách hàng."
        />

        <Section
          title="3. Quy Định Về Đặt Chỗ và Doanh Thu"
          content={[
            "Mỗi đơn đặt chỗ được tạo thông qua WorkHive sẽ được ghi nhận trên hệ thống và thông báo cho Owner theo thời gian thực.",
            "Sau khi giao dịch thành công, WorkHive sẽ khấu trừ 10% phí nền tảng, và số tiền còn lại sẽ được chuyển vào ví hệ thống của Owner.",
            "Chủ không gian có thể yêu cầu rút tiền từ ví bất cứ lúc nào, tuân theo quy trình xác minh rút tiền của WorkHive.",
          ]}
        />

        <Section
          title="4. Trách Nhiệm Của Owner"
          list={[
            "Đảm bảo không gian hoạt động đúng mô tả, đúng giờ và cung cấp đầy đủ tiện ích đã cam kết.",
            "Giải quyết các khiếu nại từ khách hàng liên quan đến dịch vụ, thái độ phục vụ, hoặc điều kiện không gian.",
            "Chủ động xử lý các vấn đề như hoàn tiền hoặc hỗ trợ khách hàng, trong phạm vi chính sách hoàn hủy do Owner thiết lập.",
          ]}
        />

        <Section
          title="5. Trách Nhiệm Của WorkHive"
          list={[
            "Cung cấp nền tảng ổn định, hỗ trợ khách hàng đặt chỗ và thanh toán dễ dàng.",
            "Đảm bảo thông tin của Owner được hiển thị công khai, minh bạch đến người dùng.",
            "Hỗ trợ quảng bá không gian trên các kênh truyền thông hoặc chương trình khuyến mãi (nếu tham gia).",
          ]}
        />

        <Section
          title="6. Chấm Dứt Hợp Tác"
          content={[
            "Mỗi bên có quyền đơn phương chấm dứt hợp tác bằng thông báo trước ít nhất 7 ngày.",
            "Nếu Owner vi phạm điều khoản hoặc gây ảnh hưởng xấu đến trải nghiệm người dùng, WorkHive có quyền tạm khóa hoặc xóa không gian khỏi hệ thống mà không hoàn tiền.",
          ]}
        />

        <Section
          title="7. Cam Kết Chung"
          content={[
            "Việc sử dụng nền tảng đồng nghĩa với việc Owner đồng ý với các điều khoản nêu trên.",
            "Hai bên hợp tác trên nguyên tắc minh bạch, linh hoạt, không ràng buộc pháp lý phức tạp, hướng đến trải nghiệm tối ưu cho người dùng.",
          ]}
        />
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  content?: string[];
  list?: string[];
  note?: string;
}

function Section({ title, content = [], list = [], note }: SectionProps) {
  return (
    <section>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h2>
      {content.map((text, idx) => (
        <p key={idx} className="mb-2 text-sm sm:text-base leading-relaxed">
          {text}
        </p>
      ))}
      {list.length > 0 && (
        <ul className="list-disc list-inside text-sm sm:text-base mb-2">
          {list.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
      {note && <p className="italic text-sm text-gray-600">{note}</p>}
    </section>
  );
}
