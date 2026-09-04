interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  className = "",
  light = false,
}: SectionHeadingProps) {
  const alignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`${alignment[align]} mb-10 ${className}`}>
      {subtitle && (
        <p
          className={`text-[13px] tracking-[3px] uppercase mb-3 font-medium ${
            light ? "text-[#C8A165]" : "text-[#C8A165]"
          }`}
        >
          {subtitle}
        </p>
      )}
      <h2
        className={`font-cormorant text-3xl md:text-4xl lg:text-[42px] font-semibold leading-tight ${
          light ? "text-white" : "text-[#1A1A1A]"
        }`}
      >
        {title}
      </h2>
      <div className="flex justify-center mt-4">
        <div className="w-12 h-[1px] bg-[#C8A165]"></div>
      </div>
    </div>
  );
}
