/* eslint-disable @next/next/no-img-element */

import SectionTitle from "./section-tilte";

interface FeatureSectionProps {
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryLinks: { text: string; href: string }[];
  imageUrl: string;
}

export default function FeatureSection({
  description,
  buttonText,
  buttonLink,
  secondaryLinks,
  imageUrl,
}: FeatureSectionProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full mx-auto py-12">
      <div className="md:w-1/2 text-left">
        <SectionTitle>
          Khám phá thêm về việc trở thành <br /> chủ không gian làm việc
        </SectionTitle>
        <p className="text-gray-600 text-sm my-6">{description}</p>
        <div className="flex space-x-6 mb-6">
          {secondaryLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-yellow-700 font-semibold hover:underline"
            >
              {link.text}
            </a>
          ))}
        </div>

        <a
          href={buttonLink}
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-full shadow-md hover:bg-gray-800 transition"
        >
          {buttonText}
        </a>
      </div>

      <div className="md:w-1/2 flex justify-end">
        <div className="relative w-full">
          <img
            src={imageUrl}
            alt="Feature"
            className="rounded-lg shadow-md object-cover max-h-[300px] w-full"
          />
        </div>
      </div>
    </div>
  );
}
