import Image from "next/image";
import diamond from "@/assets/diamond.png";

const PageSectionHeader = ({
  title,
  subtitle = "Your curated selection of elegance",
  icon = diamond,
}) => {
  return (
    <div className="flex flex-col items-center mb-12 md:mb-16 lg:mb-20 text-center px-4">
      {/* Title with diamonds */}
      <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-4 md:mb-6">
        <Image
          width={68}
          height={68}
          src={icon}
          alt=""
          className="animate-pulse opacity-90 min-w-[28px]"
        />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium tracking-wider text-gray-900 uppercase">
          {title}
        </h1>
        <Image
          width={68}
          height={68}
          src={icon}
          alt=""
          className="animate-pulse opacity-90 min-w-[28px]"
        />
      </div>

      {/* Divider */}
      <div className="relative w-32 md:w-40 h-0.5 mb-3 md:mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400 to-transparent" />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm md:text-base text-gray-600 font-light max-w-md md:max-w-lg lg:max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageSectionHeader;
