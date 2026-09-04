"use client";

import React from "react";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <ProductForm isEdit={false} />
    </div>
  );
}
