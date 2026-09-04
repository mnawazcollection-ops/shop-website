"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Crown,
  Eye,
  AlertCircle,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";
import { useAdminToast } from "@/components/admin/AdminToast";
import StatusBadge from "@/components/admin/StatusBadge";
import type { AdminCustomer } from "@/types/admin";

export default function CustomersPage() {
  const { customers, toggleCustomerStatus } = useAdminData();
  const { addToast } = useAdminToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = tierFilter === "all" || c.tier === tierFilter;
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;

      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [customers, searchQuery, tierFilter, statusFilter]);

  const handleToggleStatus = (cust: AdminCustomer) => {
    toggleCustomerStatus(cust.id);
    addToast({
      title: "Client Status Updated",
      message: `${cust.name}'s account is now ${cust.status === "active" ? "disabled" : "active"}.`,
      type: "info",
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Clientele & Collectors</h1>
          <p className="text-sm text-stone-500">
            Private client dossiers, lifetime acquisition value, and bespoke relationship records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-stone-100 rounded-lg text-xs font-semibold text-stone-700">
            Total Collectors: {customers.length}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, or telephone..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none"
          >
            <option value="all">All VIP Tiers</option>
            <option value="VIP Collector">VIP Collector</option>
            <option value="Gold Tier">Gold Tier</option>
            <option value="Private Client">Private Client</option>
            <option value="Standard Client">Standard Client</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Access</option>
            <option value="disabled">Suspended / Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                <th className="py-3 px-4">Client Dossier</th>
                <th className="py-3 px-4">Patronage Tier</th>
                <th className="py-3 px-4">Telephone</th>
                <th className="py-3 px-4 text-center">Acquisitions</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Last Acquisition</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-stone-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    <p className="font-semibold text-stone-700">No clientele matches found</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-serif font-bold text-sm flex items-center justify-center shrink-0">
                          {cust.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <Link
                            href={`/admin/customers/${cust.id}`}
                            className="font-semibold text-stone-900 hover:text-amber-600 transition-colors block"
                          >
                            {cust.name}
                          </Link>
                          <span className="text-xs text-stone-400">{cust.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          cust.tier.includes("VIP")
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : cust.tier.includes("Gold")
                            ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        <Crown className="w-3 h-3 text-amber-600" />
                        {cust.tier}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 font-mono text-xs text-stone-600">{cust.phone}</td>

                    {/* Total Orders */}
                    <td className="py-3.5 px-4 text-center font-semibold text-stone-800">
                      {cust.totalOrders}
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      ${cust.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Last Order Date */}
                    <td className="py-3.5 px-4 text-xs text-stone-500">
                      {new Date(cust.lastOrderDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={cust.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/customers/${cust.id}`}
                          className="p-1.5 text-stone-400 hover:text-amber-600 rounded hover:bg-stone-100 transition-colors"
                          title="View Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(cust)}
                          className={`p-1.5 rounded transition-colors text-xs font-semibold ${
                            cust.status === "active"
                              ? "text-stone-400 hover:text-red-600 hover:bg-red-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={cust.status === "active" ? "Disable Client" : "Enable Client"}
                        >
                          {cust.status === "active" ? "Disable" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
