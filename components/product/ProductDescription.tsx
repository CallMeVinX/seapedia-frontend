import { Product } from "@/services/productService";

export default function ProductDescription({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Product Description</h3>
      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
        {product.description ? (
          <p className="whitespace-pre-wrap">{product.description}</p>
        ) : (
          <p className="italic text-slate-400">No description provided for this product.</p>
        )}
      </div>
      
      {/* Specifications Section (Dummy Data as per screenshot requirements) */}
      <div className="mt-10 pt-8 border-t border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">Category</span>
            <span className="font-semibold text-slate-900">{product.category_name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">Brand</span>
            <span className="font-semibold text-slate-900">SEAPEDIA Official</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">Stock</span>
            <span className="font-semibold text-slate-900">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">Condition</span>
            <span className="font-semibold text-slate-900">New</span>
          </div>
        </div>
      </div>
    </div>
  );
}
