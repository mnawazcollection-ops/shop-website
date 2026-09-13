"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Store,
  DollarSign,
  Truck,
  Bell,
  ShieldCheck,
  Check,
  RotateCcw,
  Sparkles,
  Mail,
  Phone,
  Database,
  Cloud,
} from "lucide-react";
import { useAdminData } from "@/store/AdminDataContext";
import { useAdminToast } from "@/components/admin/AdminToast";

export default function SettingsPage() {
  const { settings, updateSettings, resetToDefaults, cleanOperationalData, syncCatalogToCloud } = useAdminData();
  const { addToast } = useAdminToast();
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "store" | "shipping" | "tax" | "notifications" | "firebase"
  >("store");

  // Local Form State
  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [currency, setCurrency] = useState(settings.currency);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);

  const [taxRate, setTaxRate] = useState(settings.taxRate);
  const [taxInclusive, setTaxInclusive] = useState(settings.taxInclusive);

  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold);
  const [standardShippingRate, setStandardShippingRate] = useState(settings.standardShippingRate);
  const [expressShippingRate, setExpressShippingRate] = useState(settings.expressShippingRate);
  const [whiteGloveShippingRate, setWhiteGloveShippingRate] = useState(settings.whiteGloveShippingRate);
  const [orderPrefix, setOrderPrefix] = useState(settings.orderPrefix);

  const [lowStockNotification, setLowStockNotification] = useState(settings.lowStockNotification);
  const [orderEmailNotification, setOrderEmailNotification] = useState(settings.orderEmailNotification);

  const [firebaseProjectId, setFirebaseProjectId] = useState(settings.firebaseProjectId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      tagline,
      logoUrl,
      email,
      phone,
      address,
      currency,
      currencySymbol,
      taxRate: Number(taxRate),
      taxInclusive,
      freeShippingThreshold: Number(freeShippingThreshold),
      standardShippingRate: Number(standardShippingRate),
      expressShippingRate: Number(expressShippingRate),
      whiteGloveShippingRate: Number(whiteGloveShippingRate),
      orderPrefix,
      lowStockNotification,
      orderEmailNotification,
      firebaseProjectId,
    });
    addToast({
      title: "Store Settings Saved",
      message: "Atelier configurations updated successfully.",
      type: "success",
    });
  };

  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    addToast({
      title: "Cloud Sync Initiated",
      message: "Syncing images to Cloudinary and catalog to Firebase Firestore...",
      type: "info",
    });

    const result = await syncCatalogToCloud();
    setIsSyncingCloud(false);

    if (result.success) {
      addToast({
        title: "Catalog Synced Successfully",
        message: `All ${result.count} products have been saved to Firebase Firestore & Cloudinary.`,
        type: "success",
      });
    } else {
      addToast({
        title: "Sync Warning",
        message: result.error || "Could not complete cloud sync.",
        type: "error",
      });
    }
  };

  const handleReset = () => {
    if (confirm("Reset all store settings to default demonstration parameters?")) {
      resetToDefaults();
      addToast({
        title: "Settings Restored",
        message: "Default parameters applied.",
        type: "info",
      });
    }
  };

  const handleCleanOperational = () => {
    if (
      confirm(
        "Clean all operational data for client handover?\n\nThis will reset orders, customers, coupons, and reviews to 0, while keeping all products and categories intact."
      )
    ) {
      cleanOperationalData();
      addToast({
        title: "Store Cleaned for Client Handover",
        message: "Orders, customers, coupons, and reviews reset to zero. Products & categories preserved.",
        type: "success",
      });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Store Administration</h1>
          <p className="text-sm text-stone-500">
            Configure jewelry brand profile, insured logistics rates, taxation, and database keys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            { id: "store", label: "General & Branding", icon: Store },
            { id: "shipping", label: "Shipping & Delivery", icon: Truck },
            { id: "tax", label: "Taxation & Currency", icon: DollarSign },
            { id: "notifications", label: "Concierge Alerts", icon: Bell },
            { id: "firebase", label: "Cloudinary & Cloud Storage", icon: Cloud },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-stone-500 hover:text-stone-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="max-w-4xl space-y-6">
        {/* TAB 1: STORE PROFILE */}
        {activeTab === "store" && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Store className="w-4 h-4 text-amber-600" />
              Flagship Brand Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Store Title
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Brand Emblem / Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl border border-stone-200 bg-white p-2 shrink-0 shadow-xs flex items-center justify-center">
                  <Image
                    src={logoUrl || "/images/logo.png"}
                    alt="Store Logo"
                    fill
                    className="object-contain p-1.5"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="/images/logo.png"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Static asset: /images/logo.png or Cloudinary secure URL.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Concierge Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Flagship Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Flagship Atelier Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 2: SHIPPING & LOGISTICS */}
        {activeTab === "shipping" && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Truck className="w-4 h-4 text-amber-600" />
              Insured Logistics & White-Glove Delivery
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Complimentary Shipping Threshold ($)
                </label>
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Acquisitions exceeding this amount qualify for zero-cost armored transit.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Order Number Prefix
                </label>
                <input
                  type="text"
                  value={orderPrefix}
                  onChange={(e) => setOrderPrefix(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-mono text-stone-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Standard Insured ($)
                </label>
                <input
                  type="number"
                  value={standardShippingRate}
                  onChange={(e) => setStandardShippingRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Express Courier ($)
                </label>
                <input
                  type="number"
                  value={expressShippingRate}
                  onChange={(e) => setExpressShippingRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  White Glove Armored ($)
                </label>
                <input
                  type="number"
                  value={whiteGloveShippingRate}
                  onChange={(e) => setWhiteGloveShippingRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TAX & CURRENCY */}
        {activeTab === "tax" && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <DollarSign className="w-4 h-4 text-amber-600" />
              Taxation & Currency Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Operating Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCurrency(val);
                    const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", AED: "AED" };
                    setCurrencySymbol(symbols[val] || "$");
                  }}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
                >
                  <option value="USD">USD ($) - United States Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound Sterling</option>
                  <option value="AED">AED (د.إ) - UAE Dirham</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  VAT / Sales Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={taxInclusive}
                onChange={(e) => setTaxInclusive(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
              />
              <span className="text-xs font-medium text-stone-800">
                Display prices inclusive of tax on customer storefront
              </span>
            </label>
          </div>
        )}

        {/* TAB 4: CONCIERGE NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Bell className="w-4 h-4 text-amber-600" />
              Automated Concierge Alerts
            </h2>

            <label className="flex items-center gap-3 cursor-pointer py-2">
              <input
                type="checkbox"
                checked={lowStockNotification}
                onChange={(e) => setLowStockNotification(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
              />
              <div>
                <span className="text-sm font-semibold text-stone-800">Low-Reserve Stock Alerts</span>
                <p className="text-xs text-stone-500">
                  Notify store administrators immediately when vault items cross below safety levels.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer py-2 border-t border-stone-100">
              <input
                type="checkbox"
                checked={orderEmailNotification}
                onChange={(e) => setOrderEmailNotification(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
              />
              <div>
                <span className="text-sm font-semibold text-stone-800">
                  New Acquisition Email Alerts
                </span>
                <p className="text-xs text-stone-500">
                  Receive instant notifications whenever a client completes a high-jewelry order.
                </p>
              </div>
            </label>
          </div>
        )}

        {/* TAB 5: CLOUD & MEDIA STORAGE */}
        {activeTab === "firebase" && (
          <div className="space-y-6">
            {/* Cloudinary Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-amber-600" />
                  Cloudinary Media Storage
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> Cloudinary Integration Active
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                All fine jewelry photography, gallery views, and promotional banners are processed and delivered via Cloudinary&apos;s global image CDN with automated format optimization and lossless high-DPI compression.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Cloud Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "configured in .env.local"}
                    className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-lg text-xs font-mono text-stone-700 select-all"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Cloud Upload Endpoint
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="/api/upload (Serverless Route)"
                    className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-lg text-xs font-mono text-stone-700"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">Handles 10MB multipart uploads & base64 transforms</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-lg border border-amber-200/60 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Cloud Storage Folders:
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                  <span className="bg-white px-2 py-0.5 rounded border border-amber-300/60">/sir-ihsan/products</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-amber-300/60">/sir-ihsan/categories</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-amber-300/60">/sir-ihsan/banners</span>
                </div>
              </div>
            </div>

            {/* Firebase Database Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-600" />
                  Firebase Cloud Architecture
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> Architecture Ready
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Connected Firebase Project ID
                  </label>
                  <input
                    type="text"
                    value={firebaseProjectId}
                    onChange={(e) => setFirebaseProjectId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-mono text-stone-900 focus:outline-none"
                  />
                </div>

                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2 text-xs">
                  <p className="font-bold text-stone-800">Provisioned Cloud Collections:</p>
                  <div className="flex flex-wrap gap-2 font-mono text-[11px] text-amber-900">
                    {[
                      "products",
                      "categories",
                      "orders",
                      "customers",
                      "coupons",
                      "banners",
                      "reviews",
                      "settings",
                    ].map((col) => (
                      <span key={col} className="bg-white px-2 py-0.5 rounded border border-stone-200">
                        /{col}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloudSync}
                  disabled={isSyncingCloud}
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Cloud className={`w-4 h-4 ${isSyncingCloud ? "animate-spin" : ""}`} />
                  <span>{isSyncingCloud ? "Syncing Catalog with Cloud..." : "Push Local Catalog to Firebase & Cloudinary"}</span>
                </button>
              </div>
            </div>
            {/* Client Handover Card */}
            <div className="bg-amber-50/50 rounded-xl border border-amber-300/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                <div>
                  <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-amber-700" />
                    Client Handover Data Wipe
                  </h2>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Clean all test/mock orders, clientele records, reviews, and coupons to handover a clean slate ($0.00 sales, 0 orders).
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="text-xs text-stone-600 space-y-1">
                  <p className="font-semibold text-emerald-800">✓ Preserved:</p>
                  <p className="text-stone-500">All products in catalog, categories, inventory threshold rules, and store branding.</p>
                </div>
                <button
                  type="button"
                  onClick={handleCleanOperational}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer shrink-0 border border-stone-800"
                >
                  Wipe Operational Data (Handover Ready)
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Save Store Settings
          </button>
        </div>
      </form>
    </div>
  );
}
