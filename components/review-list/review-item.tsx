import { Star } from "lucide-react";
import Image from "next/image";

interface ReviewItemProps {
  avatar: string;
  name: string;
  date: string;
  rating: number;
  review: string;
}

function ReviewItem({ avatar, name, date, rating, review }: ReviewItemProps) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center gap-4">
        <Image
          alt="avatar"
          src={avatar}
          width={64}
          height={64}
          className="rounded-full border"
        />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-fourth text-base">{name}</p>
          <p className="text-fifth text-sm">{date}</p>
          <div className="flex items-center justify-start gap-1">
            {Array.from({ length: rating }, (_, index) => index + 1).map(
              (index) => (
                <Star key={index} size={16} />
              )
            )}
          </div>
        </div>
      </div>
      <p className="text-fifth">{review}</p>
    </div>
  );
}

export default ReviewItem;
