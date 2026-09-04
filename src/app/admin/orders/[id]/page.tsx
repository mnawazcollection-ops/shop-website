"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  Truck,
  Package,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";
import { useAdminToast } from "@/components/admin/AdminToast";
import StatusBadge from "@/components/admin/StatusBadge";
import { AdminOrder } from "@/types/admin";

export default function OrderDetailsPage() {
  const params = useParams();
  const { orders, updateOrderStatus, updateOrderPaymentStatus, updateOrderNotes, isLoading } =
    useAdminData();
  const { addToast } = useAdminToast();

  const orderId = params?.id as string;
  const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);

  const [notes, setNotes] = useState(order?.notes || "");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Order Not Found</h2>
        <p className="text-sm text-stone-500">The requested order ({orderId}) could not be located.</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  // Status Change Handlers
  const handleStatusChange = (newStatus: AdminOrder["orderStatus"]) => {
    setIsUpdatingStatus(true);
    updateOrderStatus(order.id, newStatus);
    addToast({
      title: "Order Status Updated",
      message: `Order ${order.orderNumber} is now marked as "${newStatus.toUpperCase()}".`,
      type: "success",
    });
    setTimeout(() => setIsUpdatingStatus(false), 300);
  };

  const handlePaymentStatusChange = (newPaymentStatus: AdminOrder["paymentStatus"]) => {
    updateOrderPaymentStatus(order.id, newPaymentStatus);
    addToast({
      title: "Payment Status Updated",
      message: `Payment marked as "${newPaymentStatus.toUpperCase()}".`,
      type: "info",
    });
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrderNotes(order.id, notes);
    addToast({
      title: "Concierge Notes Saved",
      message: "Internal record has been stored.",
      type: "success",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Timeline Step Status Mapping
  const timelineStages = [
    { key: "pending", label: "Order Placed", desc: "Acquisition placed by client" },
    { key: "payment", label: "Payment Confirmed", desc: "Funds verified & vault unlocked" },
    { key: "processing", label: "In Workshop", desc: "Artisan inspection & packaging" },
    { key: "shipped", label: "Armored Transit", desc: "Dispatched with insured courier" },
    { key: "delivered", label: "Delivered", desc: "Signature received & completed" },
  ];

  const getStageIndex = (status: AdminOrder["orderStatus"]) => {
    switch (status) {
      case "pending":
        return 0;
      case "processing":
        return 2;
      case "shipped":
        return 3;
      case "delivered":
        return 4;
      case "cancelled":
        return -1;
      default:
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(order.orderStatus);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-mono">
                {order.orderNumber}
              </h1>
              <StatusBadge status={order.orderStatus} />
              <StatusBadge status={order.paymentStatus} />
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Acquisition registered on{" "}
              {new Date(order.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            Print Packing Slip
          </button>

          {/* Quick Status Action */}
          <div className="relative">
            <select
              value={order.orderStatus}
              onChange={(e) => handleStatusChange(e.target.value as AdminOrder["orderStatus"])}
              disabled={isUpdatingStatus}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer focus:outline-none"
            >
              <option value="pending" className="bg-white text-stone-900">
                Status: Pending
              </option>
              <option value="processing" className="bg-white text-stone-900">
                Status: Workshop Processing
              </option>
              <option value="shipped" className="bg-white text-stone-900">
                Status: Armored Transit (Shipped)
              </option>
              <option value="delivered" className="bg-white text-stone-900">
                Status: Delivered
              </option>
              <option value="cancelled" className="bg-white text-stone-900">
                Status: Cancelled
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* 5-Stage Visual Order Timeline */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-6 flex items-center gap-2">
          <Truck className="w-4 h-4 text-amber-600" />
          Fulfillment Timeline & Status Progression
        </h2>

        <div className="relative">
          {/* Progress bar background line */}
          <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-stone-100 -z-0" />
          {/* Active progress fill */}
          {currentStageIndex >= 0 && (
            <div
              className="hidden sm:block absolute top-5 left-8 h-1 bg-amber-600 transition-all duration-500 -z-0"
              style={{
                width: `${(Math.min(currentStageIndex, 4) / 4) * 88}%`,
              }}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
            {timelineStages.map((stage, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = currentStageIndex === idx;

              return (
                <div key={stage.key} className="flex flex-col sm:items-center text-left sm:text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors mb-2 ${
                      isPast
                        ? "bg-amber-600 text-white shadow-sm"
                        : isCurrent
                        ? "bg-amber-600 text-white ring-4 ring-amber-100"
                        : "bg-white border-2 border-stone-200 text-stone-400"
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <h4
                    className={`text-xs font-bold ${
                      isCurrent || isPast ? "text-stone-900" : "text-stone-400"
                    }`}
                  >
                    {stage.label}
                  </h4>
                  <p className="text-[11px] text-stone-500 max-w-[140px] mt-0.5">{stage.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Advance Controls */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-stone-500">
            Current Stage: <strong className="text-stone-900 capitalize">{order.orderStatus}</strong>
          </span>
          <div className="flex items-center gap-2">
            {order.orderStatus === "pending" && (
              <button
                onClick={() => handleStatusChange("processing")}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold rounded-lg border border-amber-300 transition-colors"
              >
                Advance to Workshop Processing →
              </button>
            )}
            {order.orderStatus === "processing" && (
              <button
                onClick={() => handleStatusChange("shipped")}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
              >
                Dispatch Armored Transit →
              </button>
            )}
            {order.orderStatus === "shipped" && (
              <button
                onClick={() => handleStatusChange("delivered")}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                Confirm Final Delivery ✓
              </button>
            )}
            {order.orderStatus !== "cancelled" && (
              <button
                onClick={() => handleStatusChange("cancelled")}
                className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                Cancel Acquisition
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Order Items & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                Acquired Items ({order.items.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[550px]">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                    <th className="py-3 px-4">Masterwork</th>
                    <th className="py-3 px-4">Specifications</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4">Unit Price</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-14 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900">{item.name}</p>
                            <span className="text-xs text-stone-400 font-mono">ID: {item.productId}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs text-stone-600">
                        {item.selectedVariants ? (
                          <div className="space-y-0.5">
                            {Object.entries(item.selectedVariants).map(([k, v]) => (
                              <p key={k}>
                                <span className="capitalize text-stone-400">{k}:</span> {v}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">Standard Specification</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center font-semibold text-stone-800">
                        {item.quantity}
                      </td>

                      <td className="py-4 px-4 text-stone-700">
                        ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-4 px-4 text-right font-bold text-stone-900">
                        ${item.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="p-5 bg-stone-50/60 border-t border-stone-200">
              <div className="max-w-xs ml-auto space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-medium text-stone-900">
                    ${order.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>
                      Privilege Discount {order.discountCode ? `(${order.discountCode})` : ""}:
                    </span>
                    <span>
                      -${order.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Insured Shipping ({order.shippingMethod}):</span>
                  <span className="font-medium text-stone-900">
                    {order.shipping === 0
                      ? "Complimentary"
                      : `$${order.shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Estimated Tax:</span>
                  <span className="font-medium text-stone-900">
                    ${order.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                  <span>Total Amount:</span>
                  <span className="text-amber-600">
                    ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Concierge Notes */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 mb-3">
              Internal Concierge Notes
            </h3>
            <form onSubmit={handleSaveNotes} className="space-y-3">
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private packaging, VIP requests, or courier tracking identifiers..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Save Concierge Note
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Customer Card & Delivery Destination */}
        <div className="space-y-6">
          {/* Customer Profile Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" />
              Client Profile
            </h3>

            <div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-stone-900">{order.customer.name}</p>
                {order.customer.isVip && (
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                    VIP Collector
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1">{order.customer.email}</p>
              <p className="text-xs text-stone-500">{order.customer.phone}</p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-400">Payment Status:</span>
              <select
                value={order.paymentStatus}
                onChange={(e) =>
                  handlePaymentStatusChange(e.target.value as AdminOrder["paymentStatus"])
                }
                className="bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs font-semibold text-stone-800"
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Payment Instrument:</span>
              <span className="font-semibold text-stone-800">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Shipping & Delivery Destination */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              Delivery Destination
            </h3>

            <div className="text-xs text-stone-600 space-y-1">
              <p className="font-medium text-stone-900">{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
              <p className="font-semibold text-stone-800">{order.shippingAddress.country}</p>
            </div>

            <div className="pt-2 border-t border-stone-100 text-xs">
              <span className="text-stone-400">Shipping Service:</span>
              <p className="font-semibold text-stone-900 mt-0.5">{order.shippingMethod}</p>
            </div>
          </div>

          {/* Luxury White-Glove Guarantee */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-xl p-5 text-white space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Vault & Transit Guarantee
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Every high-jewelry shipment is fully insured by Lloyd&apos;s of London syndicates and requires
              in-person identity verification upon handover.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
