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
  TrendingUp,
  Plus,
  ArrowRight,
  Eye,
  Sparkles,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";
import { useAdminAuth } from "@/store/AdminAuthContext";
import StatsCard from "@/components/admin/StatsCard";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminOverviewPage() {
  const { products, orders, customers } = useAdminData();
  const { user } = useAdminAuth();
  const [salesRange, setSalesRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");

  // Real calculations from client transactions
  const totalSales = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySales = orders
    .filter((o) => o.createdAt.startsWith(todayStr) && o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const monthStr = new Date().toISOString().slice(0, 7);
  const monthlyRevenue = orders
    .filter((o) => o.createdAt.startsWith(monthStr) && o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === "pending").length;
  const processingOrders = orders.filter((o) => o.orderStatus === "processing").length;
  const completedOrders = orders.filter((o) => o.orderStatus === "delivered").length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === "cancelled").length;
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);

  // Dynamic calculations for fulfillment ratio
  const totalOrderCount = orders.length;
  const deliveredPercent = totalOrderCount > 0 ? Math.round((completedOrders / totalOrderCount) * 100) : 0;
  const processingPercent = totalOrderCount > 0 ? Math.round((processingOrders / totalOrderCount) * 100) : 0;
  const pendingPercent = totalOrderCount > 0 ? Math.round((pendingOrders / totalOrderCount) * 100) : 0;
  const cancelledPercent = totalOrderCount > 0 ? Math.round((cancelledOrders / totalOrderCount) * 100) : 0;

  // Dynamic category revenue share
  const categoriesList = ["Rings", "Necklaces", "Bracelets", "Earrings"];
  const categoryStats = categoriesList.map((catName) => {
    const catTotal = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => {
        const itemSum = o.items
          .filter((it) => {
            const prod = products.find((p) => p.id === it.productId || p.name === it.name);
            return (prod?.category || "").toLowerCase().includes(catName.toLowerCase());
          })
          .reduce((s, it) => s + it.price * it.quantity, 0);
        return sum + itemSum;
      }, 0);

    const share = totalSales > 0 ? Math.round((catTotal / totalSales) * 100) : 0;
    return { name: catName, total: catTotal, share };
  });

  // Sales trend data points for chart
  const salesChartData = {
    daily: [
      { label: "Mon", sales: 0, orders: 0 },
      { label: "Tue", sales: 0, orders: 0 },
      { label: "Wed", sales: 0, orders: 0 },
      { label: "Thu", sales: 0, orders: 0 },
      { label: "Fri", sales: 0, orders: 0 },
      { label: "Sat", sales: 0, orders: 0 },
      { label: "Sun", sales: 0, orders: 0 },
    ],
    weekly: [
      { label: "Week 1", sales: 0, orders: 0 },
      { label: "Week 2", sales: 0, orders: 0 },
      { label: "Week 3", sales: 0, orders: 0 },
      { label: "Week 4", sales: 0, orders: 0 },
    ],
    monthly: [
      { label: "Jan", sales: 0, orders: 0 },
      { label: "Feb", sales: 0, orders: 0 },
      { label: "Mar", sales: 0, orders: 0 },
      { label: "Apr", sales: 0, orders: 0 },
      { label: "May", sales: 0, orders: 0 },
      { label: "Jun", sales: 0, orders: 0 },
    ],
    yearly: [
      { label: "2024", sales: 0, orders: 0 },
      { label: "2025", sales: 0, orders: 0 },
      { label: "2026", sales: 0, orders: 0 },
    ],
  };

  // Populate sales from real orders if available
  if (orders.length > 0) {
    orders.forEach((o) => {
      if (o.paymentStatus === "paid") {
        const m = new Date(o.createdAt).toLocaleString("en-US", { month: "short" });
        const monthPoint = salesChartData.monthly.find((p) => p.label === m);
        if (monthPoint) {
          monthPoint.sales += o.total;
          monthPoint.orders += 1;
        }
      }
    });
  }

  const activePoints = salesChartData[salesRange];
  const rawMaxSales = Math.max(...activePoints.map((p) => p.sales));
  const maxSales = rawMaxSales > 0 ? rawMaxSales : 1;

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-700/80 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-amber-400">
              Live Atelier Console
            </span>
          </div>
          <h1 className="font-cormorant text-2xl sm:text-3xl font-bold tracking-wide text-white">
            Welcome back, {user?.name ? user.name.split(" ")[0] : "Ahsan"}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Here is your daily executive overview of acquisitions, vault fulfillment, and client activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            href="/admin/products/new"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 text-xs uppercase tracking-wider font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Jewel</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs uppercase tracking-wider font-semibold border border-slate-700 transition-colors"
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
          value={`$${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          change={orders.length > 0 ? "+100%" : "0%"}
          isPositive={true}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatsCard
          title="Today's Acquisition"
          value={`$${todaySales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          change={todaySales > 0 ? "+100%" : "0%"}
          isPositive={true}
          icon={<Sparkles className="w-5 h-5" />}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          change={monthlyRevenue > 0 ? "+100%" : "0%"}
          isPositive={true}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Orders"
          value={orders.length}
          change={orders.length > 0 ? `+${orders.length}` : "0"}
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
          <p className="text-xl font-bold text-slate-900">{completedOrders}</p>
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
          <p className="text-xl font-bold text-slate-900">{customers.length}</p>
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
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-sm min-w-0">
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
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60 max-w-full overflow-x-auto">
              {(["daily", "weekly", "monthly", "yearly"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setSalesRange(range)}
                  className={`px-2.5 sm:px-3 py-1 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
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
          <div className="mt-8 overflow-x-auto pb-2 -mx-2 sm:mx-0 px-2 sm:px-0">
            <div className="h-64 flex items-end gap-2 sm:gap-6 justify-between px-1 sm:px-2 pt-6 min-w-[320px] sm:min-w-[420px]">
              {activePoints.map((item) => {
                const heightPercent = rawMaxSales > 0 ? Math.round((item.sales / maxSales) * 100) : 4;
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
            {totalSales === 0 && (
              <p className="text-center text-[11px] text-slate-400 mt-3 italic">
                Storefront is ready for client launch. Live sales transactions will populate this chart in real time.
              </p>
            )}
          </div>
        </div>

        {/* Order Status Distribution & Category Share */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-cormorant text-2xl font-bold text-slate-900 mb-1">
              Order Fulfillment Ratio
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {totalOrderCount === 0
                ? "Awaiting first client purchases"
                : `${totalOrderCount} total order${totalOrderCount > 1 ? "s" : ""}`}
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Delivered & Verified
                  </span>
                  <span className="text-slate-900 font-bold">{deliveredPercent}% ({completedOrders})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${deliveredPercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Workshop Processing
                  </span>
                  <span className="text-slate-900 font-bold">{processingPercent}% ({processingOrders})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${processingPercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Pending Wire / Verification
                  </span>
                  <span className="text-slate-900 font-bold">{pendingPercent}% ({pendingOrders})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${pendingPercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Cancelled / Exchanged
                  </span>
                  <span className="text-slate-900 font-bold">{cancelledPercent}% ({cancelledOrders})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${cancelledPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-100">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
              Category Revenue Share
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categoryStats.map((stat) => (
                <div key={stat.name} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500">{stat.name}</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {stat.share}% • ${stat.total.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-sm min-w-0">
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

          <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
            <table className="w-full text-left text-[13px] min-w-[620px]">
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
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-60" />
                      <p className="font-semibold text-slate-700 text-xs">No orders received yet</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        When clients place orders on the storefront, they will appear here in real time.
                      </p>
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((order) => (
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
                  ))
                )}
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
