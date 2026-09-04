import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon,
  badge,
}: StatsCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0 shadow-sm">
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[12px]">
        {change && (
          <div className="flex items-center gap-1">
            <span
              className={`inline-flex items-center font-bold ${
                isPositive ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {change}
            </span>
            <span className="text-slate-400 font-normal">vs last period</span>
          </div>
        )}

        {subtitle && !change && (
          <span className="text-slate-500 font-medium">{subtitle}</span>
        )}

        {badge && (
          <span className="ml-auto bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300/40">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
