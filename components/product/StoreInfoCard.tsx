import { Product } from "@/services/productService";
import { BadgeCheck, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";

export default function StoreInfoCard({ product }: { product: Product }) {
  // Using initials as a dummy avatar
  const initials = product.store_name.substring(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-bold text-slate-900">Sold By</h3>
        <BadgeCheck className="w-6 h-6 text-blue-600" />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
          {product.store_avatar ? (
            <img src={product.store_avatar} alt={`${product.store_name} logo`} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-bold text-xl tracking-widest">{initials}</span>
          )}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 line-clamp-1">{product.store_name}</h4>
          <div className="flex items-center gap-1 mt-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs">Global Hub, Singapore</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 border-y border-slate-100 py-4 mb-6">
        <div className="text-center">
          <div className="text-sm font-bold text-slate-900">98%</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-1">Positive</div>
        </div>
        <div className="text-center border-l border-slate-100">
          <div className="text-sm font-bold text-slate-900">12.4k</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-1">Followers</div>
        </div>
        <div className="text-center border-l border-slate-100">
          <div className="text-sm font-bold text-slate-900">&lt; 2h</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-1">Response</div>
        </div>
      </div>

      <Button variant="secondary" className="w-full text-sm">
        Visit Store
      </Button>
    </div>
  );
}
