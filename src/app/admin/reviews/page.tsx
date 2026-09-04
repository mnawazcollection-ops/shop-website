"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Filter,
  Eye,
  MessageSquare,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";
import { useAdminToast } from "@/components/admin/AdminToast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import { AdminReview } from "@/types/admin";

export default function ReviewsPage() {
  const { reviews, approveReview, rejectReview, toggleFeatureReview, deleteReview } = useAdminData();
  const { addToast } = useAdminToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [deleteReviewItem, setDeleteReviewItem] = useState<AdminReview | null>(null);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesRating = ratingFilter === "all" || r.rating === Number(ratingFilter);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, searchQuery, statusFilter, ratingFilter]);

  const handleApprove = (id: string) => {
    approveReview(id);
    addToast({
      title: "Review Approved",
      message: "Testimonial is now verified and published to storefront.",
      type: "success",
    });
  };

  const handleReject = (id: string) => {
    rejectReview(id);
    addToast({
      title: "Review Rejected",
      message: "Testimonial flagged and hidden from store.",
      type: "info",
    });
  };

  const handleToggleFeature = (r: AdminReview) => {
    toggleFeatureReview(r.id);
    addToast({
      title: "Featured Status Changed",
      message: `Review ${!r.featured ? "spotlighted on homepage" : "un-featured"}.`,
      type: "info",
    });
  };

  const handleDelete = () => {
    if (deleteReviewItem) {
      deleteReview(deleteReviewItem.id);
      addToast({
        title: "Review Deleted",
        message: "Customer feedback permanently removed.",
        type: "info",
      });
      setDeleteReviewItem(null);
    }
  };

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Client Testimonials & Reviews
          </h1>
          <p className="text-sm text-stone-500">
            Moderate certified buyer testimonials, evaluate feedback, and spotlight masterwork endorsements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="px-3.5 py-1.5 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {pendingCount} Pending Moderation
            </span>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patron name, product, or feedback..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none"
          >
            <option value="all">All Moderation Status</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved / Live</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                <th className="py-3 px-4">Patron</th>
                <th className="py-3 px-4">Masterwork</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Testimonial Content</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-stone-500">
                    No testimonials matching your filters.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Author */}
                    <td className="py-3.5 px-4 font-semibold text-stone-900">{rev.author}</td>

                    {/* Product */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8 rounded bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                          <Image
                            src={rev.productImage}
                            alt={rev.productName}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <span className="text-xs font-medium text-stone-800 line-clamp-1 max-w-[140px]">
                          {rev.productName}
                        </span>
                      </div>
                    </td>

                    {/* Star Rating */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? "fill-amber-400 text-amber-500" : "text-stone-200"
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Content */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-semibold text-stone-900 text-xs truncate">{rev.title}</p>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-0.5 leading-relaxed">
                        "{rev.content}"
                      </p>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs text-stone-400 whitespace-nowrap">{rev.date}</td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={rev.status} />
                    </td>

                    {/* Featured */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeature(rev)}
                        className="p-1 rounded hover:bg-stone-100"
                        title={rev.featured ? "Unfeature" : "Spotlight on Homepage"}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            rev.featured ? "fill-amber-400 text-amber-500" : "text-stone-300"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Moderation Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {rev.status !== "approved" && (
                          <button
                            onClick={() => handleApprove(rev.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Approve Review"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {rev.status !== "rejected" && (
                          <button
                            onClick={() => handleReject(rev.id)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                            title="Reject Review"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteReviewItem(rev)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteReviewItem}
        title="Delete Customer Testimonial?"
        message="Are you sure you want to permanently delete this client review from the store records?"
        confirmText="Delete Review"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteReviewItem(null)}
      />
    </div>
  );
}
