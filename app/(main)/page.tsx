import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import HomeProductCard from "@/components/product/HomeProductCard";
import { ReviewCard, Review } from "@/components/ui/ReviewCard";
import { ReviewForm } from "@/components/ui/ReviewForm";

async function getProducts() {
  try {
    // Implement Incremental Static Regeneration (ISR) to cache products for 60 seconds
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}

async function getReviews() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, { 
      next: { revalidate: 30 } 
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch reviews", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  const reviews = await getReviews();
  
  // Display only top 4 products for the homepage
  const displayProducts = products.slice(0, 4);
  // Display up to 3 reviews for the homepage
  const displayReviews = reviews.slice(0, 3);

  return (
    <div className="flex flex-col bg-slate-50 font-sans w-full pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 opacity-70"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col items-start text-left max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Temukan Segalanya.<br/>
              <span className="text-blue-900">Satu Marketplace.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
              Belanja jutaan produk dari ribuan penjual terverifikasi. Logistik cepat, pembayaran aman, dan pilihan tak terbatas—semua dikurasi untuk Anda.
            </p>
            <div className="mt-10 flex items-center gap-4 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sedang Tren:</span>
              <Link href="/products?category=Fresh%20Seafood%20%26%20Meats" className="px-4 py-1.5 bg-slate-200/60 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors cursor-pointer">Seafood & Daging</Link>
              <Link href="/products?category=Electronics%20%26%20Gadgets" className="px-4 py-1.5 bg-slate-200/60 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors cursor-pointer">Elektronik</Link>
              <Link href="/products?category=Fashion%20%26%20Apparel" className="px-4 py-1.5 bg-slate-200/60 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors cursor-pointer">Pakaian</Link>
            </div>
          </div>

          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-sm border border-white/40">
            <Image src="/hero.png" alt="Konsep Marketplace 3D" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-900 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-blue-700 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-amber-700 border-2 border-white"></div>
              </div>
              <span className="text-sm font-bold text-slate-900">10K+ Toko</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Browse Products Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Jelajahi Produk</h2>
            <p className="mt-2 text-slate-500">Temukan pilihan terbaik dari penjual teratas kami.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 group">
            Lihat Semua <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.map((product: any) => (
              <HomeProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            Tidak ada produk yang tersedia saat ini.
          </div>
        )}
      </section>

      {/* 3. Application Reviews Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 bg-blue-900/5 rounded-3xl my-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Apa Kata Pengguna Kami</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Jangan hanya percaya kata-kata kami. Berikut adalah apa yang dikatakan pembeli, penjual, dan pengemudi tentang ekosistem SEAPEDIA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((review: any) => (
            <ReviewCard 
              key={review.id} 
              review={{
                id: review.id,
                reviewerName: review.reviewer_name,
                rating: review.rating,
                comment: review.comment,
                date: new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
              }} 
            />
          ))}
        </div>
      </section>

      {/* 4. Review Submission Form */}
      <section id="write-review" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ReviewForm />
      </section>

    </div>
  );
}
