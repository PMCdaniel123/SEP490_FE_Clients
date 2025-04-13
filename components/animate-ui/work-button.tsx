export default function WorkButton() {
  return (
    <button className="group relative overflow-hidden rounded-md bg-primary px-7 py-2 text-sm transition-all border border-white">
      <span className="absolute bottom-0 left-0 h-48 w-full origin-bottom translate-y-full transform overflow-hidden rounded-3xl bg-white/15 transition-all duration-300 ease-out group-hover:translate-y-14"></span>
      <span className="font-medium text-white">Đăng nhập doanh nghiệp</span>
    </button>
  );
}
