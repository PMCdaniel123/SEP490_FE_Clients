import Image from "next/image";

interface FeatureSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryLinks: { text: string; href: string }[];
  imageUrl: string;
}

export default function FeatureSection({
  title,
  description,
  buttonText,
  buttonLink,
  secondaryLinks,
  imageUrl,
}: FeatureSectionProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto py-12 px-6">
      <div className="md:w-1/2 text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-[#835101] leading-tight">
          {title}
        </h2>
        <div className="w-12 h-1 bg-gray-700 my-4"></div>
        <p className="text-gray-600 text-lg mb-6">{description}</p>
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
        <div className="relative w-full max-w-md">
          <Image
            src={imageUrl}
            alt="Feature"
            width={500}
            height={400}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
