interface FacilitiesItemProps {
  index: number;
  label: string;
}

function FacilitiesItem({ index, label }: FacilitiesItemProps) {
  return (
    <div className="flex items-center mb-2">
      <span>
        {index}. {label}
      </span>
    </div>
  );
}

export default FacilitiesItem;
