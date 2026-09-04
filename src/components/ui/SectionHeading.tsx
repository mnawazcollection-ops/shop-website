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
          className={`text-[13px] tracking-[3px] uppercase mb-3 font-semibold ${
            light ? "text-amber-400 drop-shadow-sm" : "text-amber-600 font-bold"
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
      <div className={`flex mt-4 ${align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center"}`}>
        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      </div>
    </div>
  );
}
