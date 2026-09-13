"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/admin/products/${params.id}/edit`);
    } else {
      router.replace("/admin/products");
    }
  }, [params, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Redirecting to product editor...</p>
      </div>
    </div>
  );
}
