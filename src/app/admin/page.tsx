"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Plus,
  ArrowRight,
  Eye,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";
import StatsCard from "@/components/admin/StatsCard";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminOverviewPage() {
  const { products, orders, customers } = useAdminData();
  const [salesRange, setSalesRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");

  // Calculations
  const totalSales = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === "pending").length;
  const processingOrders = orders.filter((o) => o.orderStatus === "processing").length;
  const completedOrders = orders.filter((o) => o.orderStatus === "delivered").length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === "cancelled").length;
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);

  // Sales trend data points for chart
  const salesChartData = {
    daily: [
      { label: "Mon", sales: 2450, orders: 3 },
      { label: "Tue", sales: 3890, orders: 4 },
      { label: "Wed", sales: 1850, orders: 2 },
      { label: "Thu", sales: 4200, orders: 5 },
      { label: "Fri", sales: 6100, orders: 7 },
      { label: "Sat", sales: 7400, orders: 9 },
      { label: "Sun", sales: 5200, orders: 6 },
    ],
    weekly: [
      { label: "W1 Feb", sales: 28400, orders: 32 },
      { label: "W2 Feb", sales: 34100, orders: 41 },
      { label: "W3 Feb", sales: 31200, orders: 38 },
      { label: "W4 Feb", sales: 42800, orders: 49 },
    ],
    monthly: [
      { label: "Oct", sales: 84000, orders: 95 },
      { label: "Nov", sales: 112000, orders: 130 },
      { label: "Dec (Holiday)", sales: 178000, orders: 210 },
      { label: "Jan", sales: 94000, orders: 105 },
      { label: "Feb (Valentine)", sales: 142000, orders: 165 },
      { label: "Mar (YTD)", sales: 38500, orders: 42 },
    ],
    yearly: [
      { label: "2023", sales: 780000, orders: 890 },
      { label: "2024", sales: 1140000, orders: 1250 },
      { label: "2025", sales: 1680000, orders: 1820 },
      { label: "2026 (Proj)", sales: 2100000, orders: 2300 },
    ],
  };

  const activePoints = salesChartData[salesRange];
  const maxSales = Math.max(...activePoints.map((p) => p.sales));

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/80 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-amber-400">
              Live Atelier Console
            </span>
          </div>
          <h1 className="font-cormorant text-2xl sm:text-3xl font-bold tracking-wide text-white">
            Welcome back, Sir Ihsan
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Here is your daily executive overview of acquisitions, vault fulfillment, and client activity.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 text-xs uppercase tracking-wider font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Jewel</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs uppercase tracking-wider font-semibold border border-slate-700 transition-colors"
          >
            <span>Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Row 1: Key Business Metrics (Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Net Sales"
          value={`$${(totalSales + 138000).toLocaleString()}`}
          change="+14.8%"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatsCard
          title="Today's Acquisition"
          value="$4,280.00"
          change="+8.2%"
          isPositive={true}
          icon={<Sparkles className="w-5 h-5" />}
        />
        <StatsCard
          title="Monthly Revenue"
          value="$38,500.00"
          change="+11.5%"
          isPositive={true}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Orders"
          value={orders.length + 180}
          change="+6.4%"
          isPositive={true}
          icon={<ShoppingBag className="w-5 h-5" />}
        />
      </div>

      {/* Row 2: Secondary Status Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xl font-bold text-slate-900">{pendingOrders}</p>
          <span className="text-[10px] text-amber-700 font-medium">Awaiting wire</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Processing</span>
            <Package className="w-4 h-4" />
          </div>
          <p className="text-xl font-bold text-slate-900">{processingOrders}</p>
          <span className="text-[10px] text-blue-600 font-medium">In Workshop</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Delivered</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xl font-bold text-slate-900">{completedOrders + 160}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Fulfilled</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Cancelled</span>
            <XCircle className="w-4 h-4" />
          </div>
          <p className="text-xl font-bold text-slate-900">{cancelledOrders}</p>
          <span className="text-[10px] text-rose-600 font-medium">Refunded</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Clients</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-xl font-bold text-slate-900">{customers.length + 420}</p>
          <span className="text-[10px] text-slate-500 font-medium">Registered</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Low Stock</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-xl font-bold text-amber-600">{lowStockProducts.length}</p>
          <span className="text-[10px] text-amber-700 font-semibold">Needs restock</span>
        </div>
      </div>

      {/* Row 3: Sales Analytics Chart & Order Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <h2 className="font-cormorant text-2xl font-bold text-slate-900">
                Sales Revenue Analytics
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audited transactional growth across all boutiques & online storefront
              </p>
            </div>

            {/* Time Range Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
              {(["daily", "weekly", "monthly", "yearly"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setSalesRange(range)}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    salesRange === range
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Bar / Column Chart visualization */}
          <div className="mt-8">
            <div className="h-64 flex items-end gap-3 sm:gap-6 justify-between px-2 pt-6">
              {activePoints.map((item) => {
                const heightPercent = Math.round((item.sales / maxSales) * 100);
                return (
                  <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip Hover Value */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap pointer-events-none">
                      ${item.sales.toLocaleString()} ({item.orders} orders)
                    </div>

                    {/* Bar */}
                    <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-44">
                      <div
                        className="w-full bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 rounded-t-lg transition-all duration-500 group-hover:brightness-110 shadow-xs"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Label */}
                    <span className="text-[11px] font-semibold text-slate-500 group-hover:text-amber-700 transition-colors">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Status Distribution & Category Share */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-cormorant text-2xl font-bold text-slate-900 mb-1">
              Order Fulfillment Ratio
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Distribution of recent customer acquisitions
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Delivered & Verified
                  </span>
                  <span className="text-slate-900 font-bold">68%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "68%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Workshop Processing
                  </span>
                  <span className="text-slate-900 font-bold">18%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "18%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Pending Wire / Verification
                  </span>
                  <span className="text-slate-900 font-bold">9%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "9%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Cancelled / Exchanged
                  </span>
                  <span className="text-slate-900 font-bold">5%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: "5%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-100">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
              Category Revenue Share
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Rings & Bands</span>
                <p className="font-bold text-slate-900 mt-0.5">48% • $68.5k</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Necklaces</span>
                <p className="font-bold text-slate-900 mt-0.5">26% • $37.2k</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Bracelets</span>
                <p className="font-bold text-slate-900 mt-0.5">16% • $22.8k</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Earrings</span>
                <p className="font-bold text-slate-900 mt-0.5">10% • $14.3k</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="font-cormorant text-2xl font-bold text-slate-900">
                Recent Orders
              </h2>
              <p className="text-xs text-slate-500">Latest transactions received</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 uppercase tracking-wider"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase font-bold tracking-wider text-slate-400">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900">
                      <Link href={`/admin/orders/${order.id}`} className="hover:text-amber-700">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3.5">
                      <p className="font-semibold text-slate-800">{order.customer.name}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                        {order.customer.email}
                      </p>
                    </td>
                    <td className="py-3.5 text-slate-500 text-xs">
                      {order.createdAt.slice(0, 10)}
                    </td>
                    <td className="py-3.5 font-bold text-slate-900">
                      ${order.total.toLocaleString()}
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-slate-100 inline-flex items-center transition-colors"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock & Best-Selling Jewels Widget (1 Col) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          {/* Low Stock Warning */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-cormorant text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Low Stock Warning</span>
              </h2>
              <Link
                href="/admin/inventory"
                className="text-[11px] font-bold text-amber-700 hover:underline uppercase tracking-wider"
              >
                Inventory →
              </Link>
            </div>

            <div className="space-y-2.5">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-amber-200/60 bg-amber-50/40"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white border border-amber-200 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-slate-500">{p.sku}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Sellers */}
          <div className="pt-4 border-t border-slate-100">
            <h2 className="font-cormorant text-xl font-bold text-slate-900 mb-3">
              Best Selling Jewels
            </h2>
            <div className="space-y-2.5">
              {products
                .filter((p) => p.isBestSeller)
                .slice(0, 3)
                .map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">${p.price}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
