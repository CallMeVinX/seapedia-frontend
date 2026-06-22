import Image from "next/image";
import { Product } from "@/services/productService";

export default function ProductGallery({ product }: { product: Product }) {
  // Use product.images if available, else fallback to image_url
  const images = product.images && product.images.length > 0 
    ? product.images 
    : (product.image_url ? [product.image_url] : ['/tech_store.png']);

  const mainImage = images[0];

  return (
    <div className="w-full relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-sm">
      <Image 
        src={mainImage} 
        alt={product.name} 
        fill 
        unoptimized
        className="object-cover"
      />
    </div>
  );
}
