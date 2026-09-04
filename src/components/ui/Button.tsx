import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "dark" | "white";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer";

  const variants = {
    primary:
      "bg-[#C8A165] text-white hover:bg-[#b8914f] border border-[#C8A165]",
    outline:
      "bg-transparent text-[#C8A165] border border-[#C8A165] hover:bg-[#C8A165] hover:text-white",
    dark: "bg-[#1A1A1A] text-white hover:bg-[#333] border border-[#1A1A1A]",
    white:
      "bg-white text-[#1A1A1A] hover:bg-[#f5f5f5] border border-white",
  };

  const sizes = {
    sm: "px-5 py-2 text-[11px]",
    md: "px-8 py-3 text-[12px]",
    lg: "px-10 py-4 text-[13px]",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
