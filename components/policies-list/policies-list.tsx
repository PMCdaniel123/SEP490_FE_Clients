import { ShieldEllipsis } from "lucide-react";

const policies = [
  "Không mang đồ ăn thức uống từ bên ngoài vào",
  "Không mang theo động vật",
  "Không gây ồn ào xung quanh",
  "Không khói thuốc",
];

function PoliciesList() {
  return (
    <div className="grid grid-cols-2 gap-4 md:max-w-4xl text-fourth font-semibold items-center">
      {policies.map((policy, index) => (
        <div className="flex items-center gap-4 mb-2" key={index}>
          <ShieldEllipsis size={28} />
          <span>{policy}</span>
        </div>
      ))}
    </div>
  );
}

export default PoliciesList;
