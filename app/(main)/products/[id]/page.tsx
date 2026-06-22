"use client";

import { use } from "react";
import { useProductDetail } from "@/hooks/useProductDetail";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchasePanel from "@/components/product/ProductPurchasePanel";
import ProductDescription from "@/components/product/ProductDescription";
import StoreInfoCard from "@/components/product/StoreInfoCard";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, params is a Promise. We must unwrap it with use()
  const resolvedParams = use(params);
  const { product, loading, error } = useProductDetail(resolvedParams.id);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h2>
        <p className="text-slate-500 mb-6">{error || "The product you're looking for doesn't exist or has been removed."}</p>
        <Link href="/products" className="text-blue-600 font-semibold hover:underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0" />
          <Link href="/products" className="hover:text-slate-900 transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0" />
          <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Gallery & Details) */}
          <div className="lg:col-span-2 space-y-8">
            <ProductGallery product={product} />
            <ProductDescription product={product} />
          </div>

          {/* Right Column (Purchase & Store) */}
          <div className="space-y-6 sticky top-24">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <ProductPurchasePanel product={product} />
            </div>
            <StoreInfoCard product={product} />
          </div>

        </div>
      </div>
    </div>
  );
}
