import { Star } from "lucide-react";
import Image from "next/image";

interface ReviewItemProps {
  avatar: string;
  name: string;
  date: string;
  rating: number;
  review: string;
  images: { url: string }[];
}

function ReviewItem({
  avatar,
  name,
  date,
  rating,
  review,
  images,
}: ReviewItemProps) {
  return (
    <div className="flex flex-col gap-2 border rounded-xl p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Image
            alt="avatar"
            src={avatar ? avatar : "/WorkHive.svg"}
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
      <div className="flex gap-2 mt-2">
        {images.map((image, index) => (
          <Image
            key={index}
            alt={`Review Image ${index + 1}`}
            src={image.url}
            width={100}
            height={100}
            className="rounded-lg object-cover"
          />
        ))}
      </div>
    </div>
  );
}

export default ReviewItem;
