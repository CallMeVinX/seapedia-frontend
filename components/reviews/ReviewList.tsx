"use client";

import { ReviewResponse } from '@/services/reviewService';
import { Star, MessageSquare } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

interface ReviewListProps {
  reviews: ReviewResponse[];
  isLoading: boolean;
}

export const ReviewList = ({ reviews, isLoading }: ReviewListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse h-48"></div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-10 h-10 text-blue-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Belum ada ulasan</h3>
        <p className="text-slate-500">Jadilah yang pertama membagikan pengalaman Anda!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <div 
          key={review.id} 
          className="bg-white rounded-3xl p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group flex flex-col"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 border border-white shadow-sm flex items-center justify-center font-black text-slate-400 group-hover:from-blue-600 group-hover:to-blue-400 group-hover:text-white transition-colors duration-300">
              {review.reviewer_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 leading-tight">{review.reviewer_name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{dayjs(review.created_at).format('DD MMMM YYYY')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 mb-4 bg-slate-50/80 w-fit px-3 py-1.5 rounded-full border border-slate-100">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-50'}`} 
              />
            ))}
          </div>
          
          <p className="text-slate-600 leading-relaxed text-sm flex-grow">
            "{review.comment}"
          </p>
        </div>
      ))}
    </div>
  );
};
