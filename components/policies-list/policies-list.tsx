import { Policies } from "@/types";

function PoliciesList({ policies }: { policies: Policies[] }) {
  return (
    <div>
      {policies.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 md:max-w-4xl text-fourth font-semibold items-center">
          {policies.map((policy) => (
            <div
              className="flex items-center gap-4 mb-2 col-span-1"
              key={policy.id}
            >
              <span>
                {policy.id}. {policy.policyName}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-sixth italic flex items-center">Trống</p>
      )}
    </div>
  );
}

export default PoliciesList;
