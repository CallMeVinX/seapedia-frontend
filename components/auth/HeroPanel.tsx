import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface HeroPanelProps {
  /** Path or URL to a real photo. If omitted, a gradient placeholder is shown. */
  imageSrc?: string;
  title?: string;
  description?: string;
}

export default function HeroPanel({
  imageSrc,
  title = "Your One-Stop Marketplace",
  description = "Discover a world of products from trusted sellers. Shop securely and enjoy seamless delivery to your doorstep.",
}: HeroPanelProps) {
  return (
    <div className="relative hidden overflow-hidden rounded-xl lg:block lg:min-h-[480px]">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-seapedia-navy to-slate-700">
          <ShoppingBag className="h-20 w-20 text-white/20" aria-hidden="true" />
        </div>
      )}

      {/* Readability overlay for the caption */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
        <p className="mt-2 max-w-sm text-sm text-gray-200">{description}</p>
      </div>
    </div>
  );
}
