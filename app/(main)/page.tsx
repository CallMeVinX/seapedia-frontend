import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ReviewCard, Review } from "@/components/ui/ReviewCard";
import { ReviewForm } from "@/components/ui/ReviewForm";

// --- MOCK DATA ---
const mockProducts = [
  { id: "1", name: "Sony WH-1000XM5 Headphones", price: "$348.00", store: "TechHub Premium", image: "/tech_store.png" },
  { id: "2", name: "Minimalist Desk Lamp", price: "$45.99", store: "Luxe Living", image: "/luxe_living.png" },
  { id: "3", name: "Nike Air Max 270", price: "$150.00", store: "Kickz Kulture", image: "/kickz_kulture.png" },
  { id: "4", name: "Oversized Cotton Tee", price: "$25.00", store: "Urban Wear", image: "/urban_wear.png" },
];

const mockReviews: Review[] = [
  { id: "r1", reviewerName: "Sarah Jenkins", rating: 5, date: "Oct 12, 2026", comment: "Absolutely love the fast shipping. The fact that I can buy from multiple sellers in one checkout is a game changer." },
  { id: "r2", reviewerName: "Michael Chang", rating: 4, date: "Oct 10, 2026", comment: "Great UI and very responsive customer support. Had an issue with a voucher but it was resolved instantly." },
  { id: "r3", reviewerName: "Elena Rodriguez", rating: 5, date: "Oct 08, 2026", comment: "I became a seller last month and the dashboard is incredibly intuitive. Revenue tracking is spot on." },
];

export default function Home() {
  return (
    <div className="flex flex-col bg-slate-50 font-sans w-full pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 opacity-70"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col items-start text-left max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Discover Everything.<br/>
              <span className="text-blue-900">One Marketplace.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
              Shop millions of products from thousands of verified sellers. Fast logistics, secure payments, and endless variety—all curated for you.
            </p>
            <div className="mt-10 flex items-center gap-4 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trending:</span>
              <span className="px-4 py-1.5 bg-slate-200/60 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors cursor-pointer">Electronics</span>
              <span className="px-4 py-1.5 bg-slate-200/60 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors cursor-pointer">Fashion</span>
              <span className="px-4 py-1.5 bg-slate-200/60 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors cursor-pointer">Home Decor</span>
            </div>
          </div>

          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-sm border border-white/40">
            <Image src="/hero.png" alt="3D Marketplace Concept" fill className="object-cover" priority />
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-900 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-blue-700 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-amber-700 border-2 border-white"></div>
              </div>
              <span className="text-sm font-bold text-slate-900">10K+ Stores</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Browse Products Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Explore Products</h2>
            <p className="mt-2 text-slate-500">Discover top picks from our best sellers.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 group">
            See All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {mockProducts.map((product) => (
            <Card key={product.id} hoverable className="group border-0 shadow-sm hover:shadow-xl transition-all rounded-2xl overflow-hidden flex flex-col bg-white">
              <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-slate-400 mb-1">{product.store}</span>
                <Link href={`/products/${product.id}`} className="text-sm font-bold text-slate-900 hover:text-blue-700 line-clamp-2 mb-2">
                  {product.name}
                </Link>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-extrabold text-slate-900">{product.price}</span>
                  <Link href="/login" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-100 flex items-center justify-center text-slate-600 hover:text-blue-700 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Application Reviews Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 bg-blue-900/5 rounded-3xl my-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What Our Users Say</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here is what buyers, sellers, and drivers have to say about the SEAPEDIA ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
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
