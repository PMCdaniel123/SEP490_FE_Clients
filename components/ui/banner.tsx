import Image from "next/image";

interface BannerProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  overlayText?: string;
}

export default function Banner({
  imageUrl,
  title,
  subtitle,
  buttonText,
  buttonLink,
}: BannerProps) {
  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-xl shadow-lg mb-12">
      <div className="relative w-full h-[300px] md:h-[400px]">
        <Image
          src={imageUrl}
          alt="Banner"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
      </div>
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
        <h2 className="text-white text-2xl md:text-4xl font-bold max-w-md">
          {title}
        </h2>
        {subtitle && <p className="text-gray-300 mt-2 max-w-md">{subtitle}</p>}
        {buttonText && buttonLink && (
          <a
            href={buttonLink}
            className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-full shadow-md hover:bg-gray-800 transition inline-block w-auto max-w-max"
          >
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
}
