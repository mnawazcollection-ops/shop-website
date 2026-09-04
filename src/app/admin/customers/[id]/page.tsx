"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Shield,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";
import { useAdminToast } from "@/components/admin/AdminToast";
import StatusBadge from "@/components/admin/StatusBadge";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { customers, orders, toggleCustomerStatus, isLoading } = useAdminData();
  const { addToast } = useAdminToast();

  const customerId = params?.id as string;
  const customer = customers.find((c) => c.id === customerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Client Not Found</h2>
        <p className="text-sm text-stone-500">The dossier for ({customerId}) does not exist.</p>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Clientele
        </Link>
      </div>
    );
  }

  // Find all orders placed by this customer
  const customerOrders = orders.filter(
    (o) =>
      o.customer.email.toLowerCase() === customer.email.toLowerCase() ||
      o.customer.name.toLowerCase() === customer.name.toLowerCase()
  );

  const handleToggleStatus = () => {
    toggleCustomerStatus(customer.id);
    addToast({
      title: "Account Status Changed",
      message: `${customer.name}'s account is now ${
        customer.status === "active" ? "disabled" : "active"
      }.`,
      type: "info",
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/customers"
            className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900">{customer.name}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                <Crown className="w-3 h-3 text-amber-600" />
                {customer.tier}
              </span>
              <StatusBadge status={customer.status} />
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Patron since{" "}
              {new Date(customer.joinedDate).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleStatus}
          className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors ${
            customer.status === "active"
              ? "border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100"
              : "border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100"
          }`}
        >
          {customer.status === "active" ? "Suspend Account Access" : "Re-activate Account Access"}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Lifetime Acquisition Value</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">
            ${customer.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Total Orders Placed</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">{customer.totalOrders} acquisitions</p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Average Order Value</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">
            $
            {customer.totalOrders > 0
              ? (customer.totalSpent / customer.totalOrders).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })
              : "0"}
          </p>
        </div>
      </div>

      {/* Profile & Acquisition History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 1 Col: Contact & Vault Address */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2">
              Contact Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-stone-700">
                <Mail className="w-4 h-4 text-stone-400" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-700">
                <Phone className="w-4 h-4 text-stone-400" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-700">
                <Calendar className="w-4 h-4 text-stone-400" />
                <span>Registered: {customer.joinedDate}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              Primary Delivery Address
            </h3>

            <div className="text-xs text-stone-700 space-y-1">
              <p className="font-semibold text-stone-900">{customer.address.street}</p>
              <p>
                {customer.address.city}, {customer.address.zip}
              </p>
              <p className="font-bold text-stone-800">{customer.address.country}</p>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Order History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Acquisitions History ({customerOrders.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customerOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs text-stone-500">
                        No previous acquisitions registered for this profile.
                      </td>
                    </tr>
                  ) : (
                    customerOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50/50">
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                          {o.orderNumber}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-stone-500">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-stone-900">
                          ${o.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={o.paymentStatus} />
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={o.orderStatus} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700"
                          >
                            View Order <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
