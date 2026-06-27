"use client";

import { useEffect, useState, useCallback } from 'react';
import { reviewService, ReviewResponse } from '@/services/reviewService';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewList } from '@/components/reviews/ReviewList';
import { Star, Sparkles } from 'lucide-react';
import SiteFooter from '@/components/layout/SiteFooter';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await reviewService.getReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-200 overflow-x-hidden">

      <main className="flex-grow pt-24 pb-20 relative">
        {/* Background decorations */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50/80 to-transparent -z-10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-sm mb-6 shadow-sm border border-blue-100">
              <Sparkles className="w-4 h-4" />
              Ulasan Pengguna
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Apa Kata Mereka Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">SEAPEDIA</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Kami selalu berusaha memberikan pengalaman terbaik untuk Anda. Baca pengalaman pengguna lain atau bagikan pengalaman Anda sendiri bersama SEAPEDIA.
            </p>
            
            {reviews.length > 0 && !isLoading && (
              <div className="mt-8 inline-flex items-center gap-6 px-8 py-4 bg-white rounded-3xl shadow-sm border border-slate-200/60">
                <div className="flex items-center gap-1">
                  <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                  <span className="text-3xl font-black text-slate-900 ml-2">{avgRating}</span>
                  <span className="text-slate-400 font-medium text-lg mt-1">/5</span>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="text-left">
                  <p className="text-slate-900 font-bold">{reviews.length} Ulasan</p>
                  <p className="text-slate-500 text-sm">Dari pengguna setia</p>
                </div>
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto">
            <ReviewForm onSuccess={fetchReviews} />
            
            <div className="mt-16">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-black text-slate-900">Ulasan Terbaru</h3>
                <div className="h-px bg-slate-200 flex-grow"></div>
              </div>
              <ReviewList reviews={reviews} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
