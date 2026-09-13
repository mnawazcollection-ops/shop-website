"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/currency";

export default function OrdersPage() {
  const { orders } = useAdminData();

  // Filter States
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "total-desc" | "total-asc">("date-desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        // Tab status filter
        if (activeTab !== "all" && o.orderStatus !== activeTab) return false;

        // Payment status filter
        if (paymentFilter !== "all" && o.paymentStatus !== paymentFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesId = o.orderNumber.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
          const matchesName = o.customer.name.toLowerCase().includes(q);
          const matchesEmail = o.customer.email.toLowerCase().includes(q);
          if (!matchesId && !matchesName && !matchesEmail) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date-asc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === "total-desc") return b.total - a.total;
        if (sortBy === "total-asc") return a.total - b.total;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [orders, activeTab, paymentFilter, searchQuery, sortBy]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // Quick stats for top status tabs
  const getTabCount = (statusKey: string) => {
    if (statusKey === "all") return orders.length;
    return orders.filter((o) => o.orderStatus === statusKey).length;
  };

  const statusTabs = [
    { id: "all", label: "All Orders" },
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Orders</h1>
          <p className="text-sm text-stone-500">
            View and manage customer orders, delivery status, and payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-stone-100 rounded-lg text-xs font-semibold text-stone-700">
            Total Orders: {orders.length}
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-stone-200 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => {
          const count = getTabCount(tab.id);
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-stone-500 hover:text-stone-900 hover:border-stone-300"
              }`}
            >
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filter Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by order number, customer name, or email..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Unpaid / Pending</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date-desc" | "date-asc" | "total-desc" | "total-asc")}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none"
          >
            <option value="date-desc">Newest Orders</option>
            <option value="date-asc">Oldest Orders</option>
            <option value="total-desc">Highest Amount</option>
            <option value="total-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[850px]">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-stone-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    <p className="font-semibold text-stone-700">No orders found</p>
                    <p className="text-xs text-stone-400 mt-0.5">Try resetting search or filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const itemCount = order.items.reduce((acc, it) => acc + it.quantity, 0);

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Order Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="hover:text-amber-600 transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-stone-900">{order.customer.name}</span>
                            {order.customer.isVip && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                                VIP
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-stone-400">{order.customer.email}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-xs text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold text-stone-700">
                          {itemCount} {itemCount === 1 ? "piece" : "pieces"}
                        </span>
                        <p className="text-[11px] text-stone-400 truncate max-w-[140px]">
                          {order.items[0]?.name}
                        </p>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 font-semibold text-stone-900">
                        {formatPrice(order.total)}
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={order.paymentStatus} />
                      </td>

                      {/* Order Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={order.orderStatus} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Order
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-stone-200 text-xs text-stone-500">
            <div>
              Showing{" "}
              <strong className="text-stone-800">
                {(currentPage - 1) * itemsPerPage + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-stone-800">
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
              </strong>{" "}
              of <strong className="text-stone-800">{filteredOrders.length}</strong> orders
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                    currentPage === idx + 1
                      ? "bg-amber-600 text-white"
                      : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
