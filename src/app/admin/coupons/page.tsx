"use client";

import React, { useState } from "react";
import {
  Plus,
  Percent,
  DollarSign,
  Calendar,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Copy,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";
import { useAdminToast } from "@/components/admin/AdminToast";
import SlideOverDrawer from "@/components/admin/SlideOverDrawer";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import { AdminCoupon } from "@/types/admin";

export default function CouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } = useAdminData();
  const { addToast } = useAdminToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [deleteCouponItem, setDeleteCouponItem] = useState<AdminCoupon | null>(null);

  // Form State
  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState<"percentage" | "fixed">("percentage");
  const [formValue, setFormValue] = useState<number | string>(10);
  const [formMinOrder, setFormMinOrder] = useState<number | string>(500);
  const [formMaxDiscount, setFormMaxDiscount] = useState<number | string>("");
  const [formUsageLimit, setFormUsageLimit] = useState<number | string>(100);
  const [formExpiryDate, setFormExpiryDate] = useState("2026-12-31");
  const [formIsActive, setFormIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormCode("");
    setFormType("percentage");
    setFormValue(15);
    setFormMinOrder(500);
    setFormMaxDiscount(1000);
    setFormUsageLimit(50);
    setFormExpiryDate("2026-12-31");
    setFormIsActive(true);
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (cpn: AdminCoupon) => {
    setEditingCoupon(cpn);
    setFormCode(cpn.code);
    setFormType(cpn.discountType);
    setFormValue(cpn.discountValue);
    setFormMinOrder(cpn.minOrder);
    setFormMaxDiscount(cpn.maxDiscount || "");
    setFormUsageLimit(cpn.usageLimit);
    setFormExpiryDate(cpn.expiryDate);
    setFormIsActive(cpn.isActive);
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!formCode.trim()) err.code = "Coupon code is required.";
    if (!formValue || Number(formValue) <= 0) err.value = "Discount value must be greater than zero.";
    if (!formExpiryDate) err.expiry = "Expiry date is required.";

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    const payload = {
      code: formCode.trim().toUpperCase(),
      discountType: formType,
      discountValue: Number(formValue),
      minOrder: Number(formMinOrder) || 0,
      maxDiscount: formMaxDiscount ? Number(formMaxDiscount) : undefined,
      usageLimit: Number(formUsageLimit) || 100,
      expiryDate: formExpiryDate,
      isActive: formIsActive,
    };

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, payload);
      addToast({
        title: "Voucher Updated",
        message: `Privilege code "${payload.code}" updated successfully.`,
        type: "success",
      });
    } else {
      addCoupon(payload);
      addToast({
        title: "Privilege Code Created",
        message: `Voucher "${payload.code}" is now active.`,
        type: "success",
      });
    }

    setIsDrawerOpen(false);
  };

  const handleDelete = () => {
    if (deleteCouponItem) {
      deleteCoupon(deleteCouponItem.id);
      addToast({
        title: "Voucher Removed",
        message: `Code "${deleteCouponItem.code}" was deleted.`,
        type: "info",
      });
      setDeleteCouponItem(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast({
      title: "Code Copied",
      message: `"${code}" copied to clipboard.`,
      type: "info",
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Privilege Vouchers & Discounts
          </h1>
          <p className="text-sm text-stone-500">
            Create bespoke promotional codes, VIP collector allowances, and seasonal incentives.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Privilege Voucher
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                <th className="py-3 px-4">Privilege Code</th>
                <th className="py-3 px-4">Allowance Value</th>
                <th className="py-3 px-4">Min. Acquisition</th>
                <th className="py-3 px-4">Usage & Limit</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-stone-500">
                    No active discount vouchers configured yet.
                  </td>
                </tr>
              ) : (
                coupons.map((cpn) => {
                  const isExpired = new Date(cpn.expiryDate) < new Date();
                  const usagePercent = Math.min(100, Math.round((cpn.usedCount / cpn.usageLimit) * 100));

                  return (
                    <tr key={cpn.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 text-xs">
                            {cpn.code}
                          </span>
                          <button
                            onClick={() => copyCode(cpn.code)}
                            className="text-stone-400 hover:text-stone-700 p-1 rounded"
                            title="Copy code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Value */}
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {cpn.discountType === "percentage" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700">
                            {cpn.discountValue}% OFF
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-stone-900">
                            ${cpn.discountValue.toLocaleString()} Fixed
                          </span>
                        )}
                      </td>

                      {/* Min Order */}
                      <td className="py-3.5 px-4 text-xs text-stone-600">
                        ${cpn.minOrder.toLocaleString()}
                      </td>

                      {/* Usage */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 max-w-[130px]">
                          <div className="flex justify-between text-xs text-stone-600">
                            <span>{cpn.usedCount} used</span>
                            <span className="text-stone-400">/ {cpn.usageLimit}</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-amber-600 h-1.5 rounded-full"
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Expiry */}
                      <td className="py-3.5 px-4 text-xs">
                        <span className={isExpired ? "text-red-600 font-medium" : "text-stone-600"}>
                          {new Date(cpn.expiryDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {isExpired && <span className="block text-[10px] text-red-500 font-bold">Expired</span>}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleCouponStatus(cpn.id)}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${
                            cpn.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {cpn.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(cpn)}
                            className="p-1.5 text-stone-400 hover:text-amber-600 rounded hover:bg-stone-100 transition-colors"
                            title="Edit Voucher"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteCouponItem(cpn)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                            title="Delete Voucher"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SlideOver Drawer for Coupon Create/Edit */}
      <SlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingCoupon ? `Edit Voucher: ${editingCoupon.code}` : "Create Privilege Voucher"}
        description="Issue promotional discounts for VIP acquisition campaigns or seasonal events."
        width="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Voucher Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formCode}
              onChange={(e) => setFormCode(e.target.value.toUpperCase())}
              placeholder="e.g. SOLITAIRE20"
              className="w-full px-3.5 py-2 font-mono uppercase bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            {errors.code && <p className="text-xs text-red-600 mt-1">{errors.code}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Discount Type
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as "percentage" | "fixed")}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="15"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
              />
              {errors.value && <p className="text-xs text-red-600 mt-1">{errors.value}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Min. Order ($)
              </label>
              <input
                type="number"
                min="0"
                value={formMinOrder}
                onChange={(e) => setFormMinOrder(e.target.value)}
                placeholder="500"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Max. Discount ($)
              </label>
              <input
                type="number"
                min="0"
                value={formMaxDiscount}
                onChange={(e) => setFormMaxDiscount(e.target.value)}
                placeholder="Optional cap"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Usage Limit
              </label>
              <input
                type="number"
                min="1"
                value={formUsageLimit}
                onChange={(e) => setFormUsageLimit(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={formExpiryDate}
                onChange={(e) => setFormExpiryDate(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Status
            </label>
            <select
              value={formIsActive ? "active" : "inactive"}
              onChange={(e) => setFormIsActive(e.target.value === "active")}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
            >
              <option value="active">Active & Redeemable</option>
              <option value="inactive">Paused / Inactive</option>
            </select>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 border border-stone-200 text-stone-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold"
            >
              {editingCoupon ? "Update Voucher" : "Create Voucher"}
            </button>
          </div>
        </form>
      </SlideOverDrawer>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteCouponItem}
        title={`Delete "${deleteCouponItem?.code}"?`}
        message="Are you sure you want to delete this promotional voucher code? Existing completed orders will not be affected."
        confirmText="Delete Voucher"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteCouponItem(null)}
      />
    </div>
  );
}
