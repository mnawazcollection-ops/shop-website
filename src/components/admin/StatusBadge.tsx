import React from "react";

type BadgeVariant =
  | "active"
  | "draft"
  | "archived"
  | "paid"
  | "pending"
  | "failed"
  | "refunded"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "approved"
  | "rejected";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const norm = status.toLowerCase().replace(/\s+/g, "_") as BadgeVariant;

  const getStyle = (): { bg: string; text: string; dot: string; label: string } => {
    switch (norm) {
      case "active":
      case "paid":
      case "delivered":
      case "approved":
      case "in_stock":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20",
          text: "text-emerald-600 dark:text-emerald-400",
          dot: "bg-emerald-500",
          label: status.replace(/_/g, " "),
        };

      case "processing":
      case "shipped":
        return {
          bg: "bg-blue-500/10 border-blue-500/20",
          text: "text-blue-600 dark:text-blue-400",
          dot: "bg-blue-500",
          label: status.replace(/_/g, " "),
        };

      case "pending":
      case "low_stock":
      case "draft":
        return {
          bg: "bg-amber-500/10 border-amber-500/20",
          text: "text-amber-600 dark:text-amber-400",
          dot: "bg-amber-500",
          label: status.replace(/_/g, " "),
        };

      case "cancelled":
      case "failed":
      case "refunded":
      case "out_of_stock":
      case "rejected":
      case "archived":
        return {
          bg: "bg-rose-500/10 border-rose-500/20",
          text: "text-rose-600 dark:text-rose-400",
          dot: "bg-rose-500",
          label: status.replace(/_/g, " "),
        };

      default:
        return {
          bg: "bg-slate-500/10 border-slate-500/20",
          text: "text-slate-600 dark:text-slate-300",
          dot: "bg-slate-400",
          label: status,
        };
    }
  };

  const { bg, text, dot, label } = getStyle();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border uppercase ${bg} ${text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
      {label}
    </span>
  );
}
