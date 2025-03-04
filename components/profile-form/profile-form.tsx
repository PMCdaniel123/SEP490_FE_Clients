import React from "react";

interface EditProfileFormProps {
  formData: {
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    dob: string;
    gender: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  handleCancel,
}) => {
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin cá nhân</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mt-1"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Số điện thoại</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Ngày sinh</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Giới tính</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mt-1"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
      </div>
      <h3 className="text-lg font-bold mt-6">Thay đổi mật khẩu</h3>
      <input
        type="password"
        name="currentPassword"
        placeholder="Mật khẩu hiện tại"
        onChange={handleChange}
        className="w-full p-2 border rounded-lg mt-2"
      />
      <input
        type="password"
        name="newPassword"
        placeholder="Mật khẩu mới"
        onChange={handleChange}
        className="w-full p-2 border rounded-lg mt-2"
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Xác nhận mật khẩu mới"
        onChange={handleChange}
        className="w-full p-2 border rounded-lg mt-2"
      />
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-200"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#8B5D27] text-white rounded-lg hover:bg-[#6b451f]"
        >
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;