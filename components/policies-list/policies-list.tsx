import { policies } from "@/constants/constant";

function PoliciesList() {
  return (
    <div className="grid grid-cols-1 gap-2 md:max-w-4xl text-fourth font-semibold items-center">
      {policies.map((policy, index) => (
        <div className="flex items-center gap-4 mb-2 col-span-1" key={index}>
          <span>
            {index + 1}. {policy}
          </span>
        </div>
      ))}
    </div>
  );
}

export default PoliciesList;
