import { Policies } from "@/types";

function PoliciesList({ policies }: { policies: Policies[] }) {
  return (
    <div className="divide-y divide-gray-200">
      {policies.length > 0 ? (
        policies.map((policy, index) => (
          <div
            key={index}
            className="flex items-start gap-3 py-4 px-2 hover:bg-gray-50 transition-all duration-200"
          >
            <span className="text-sm font-semibold text-primary">
              {index + 1}.
            </span>
            <p className="text-gray-800 text-sm md:text-base leading-relaxed">
              {policy.policyName}
            </p>
          </div>
        ))
      ) : (
        <div className="p-6 text-gray-400 italic text-center">
          Chưa có quy định nào được thêm.
        </div>
      )}
    </div>
  );
}

export default PoliciesList;
