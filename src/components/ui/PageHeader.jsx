import Image from "next/image";
import diamond from "@/assets/diamond.png";

const PageSectionHeader = ({
  title,
  subtitle = "Your curated selection of elegance",
  icon = diamond,
}) => {
  return (
    <div className="flex flex-col items-center mb-16 text-center">
      <div className="flex items-center justify-center space-x-6 mb-4">
        <Image
          width={40}
          src={icon}
          alt="section-icon"
          className="animate-pulse"
        />
        <h1 className="text-3xl font-serif tracking-widest text-gray-800 uppercase">
          {title}
        </h1>
        <Image
          width={40}
          src={icon}
          alt="section-icon"
          className="animate-pulse"
        />
      </div>
      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-pink-300 to-transparent mb-2"></div>
      {subtitle && (
        <p className="text-sm text-gray-500 font-light max-w-md">{subtitle}</p>
      )}
    </div>
  );
};

export default PageSectionHeader;
