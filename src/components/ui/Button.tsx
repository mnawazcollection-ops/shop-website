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
      "bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] text-white hover:from-[#FBBF24] hover:to-[#D97706] shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 border border-amber-400/40 font-semibold active:scale-95",
    outline:
      "bg-transparent text-[#D97706] border-2 border-[#D97706] hover:bg-gradient-to-r hover:from-[#F59E0B] hover:to-[#D97706] hover:text-white hover:border-transparent font-semibold active:scale-95",
    dark: "bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 shadow-md font-semibold active:scale-95",
    white:
      "bg-white text-slate-900 hover:bg-amber-50 border border-amber-200/60 shadow-md font-semibold active:scale-95",
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
