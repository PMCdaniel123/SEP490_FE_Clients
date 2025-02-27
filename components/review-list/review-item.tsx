import { ReviewItemProps } from "@/types";
import { Star } from "lucide-react";
import Image from "next/image";

function ReviewItem({ avatar, name, date, rating, review }: ReviewItemProps) {
  return (
    <div className="flex flex-col gap-2 border rounded-xl p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Image
            alt="avatar"
            src={avatar}
            width={54}
            height={54}
            className="rounded-full border"
          />
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-fourth text-sm">{name}</p>
            <p className="text-fifth text-xs">{date}</p>
          </div>
        </div>
        <div className="flex items-center justify-start gap-1">
          {Array.from({ length: rating }, (_, index) => index + 1).map(
            (index) => (
              <Star key={index} size={16} />
            )
          )}
        </div>
      </div>
      <p className="text-fifth text-sm">{review}</p>
    </div>
  );
}

export default ReviewItem;
