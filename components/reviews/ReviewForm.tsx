"use client";

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { reviewService } from '@/services/reviewService';
import { showToast } from '@/utils/toast';

interface ReviewFormProps {
  onSuccess: () => void;
}

export const ReviewForm = ({ onSuccess }: ReviewFormProps) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return showToast.error('Gagal', 'Nama wajib diisi.');
    if (rating === 0) return showToast.error('Gagal', 'Silakan pilih rating (1-5 bintang).');
    if (!comment.trim()) return showToast.error('Gagal', 'Komentar wajib diisi.');

    setIsSubmitting(true);
    try {
      await reviewService.createReview({ reviewer_name: name, rating, comment });
      showToast.success('Berhasil', 'Ulasan Anda telah dikirim! Terima kasih.');
      setName('');
      setRating(0);
      setHoverRating(0);
      setComment('');
      onSuccess();
    } catch (error) {
      showToast.error('Gagal', 'Gagal mengirim ulasan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 mb-10">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Bagikan Pengalaman Anda</h2>
      <p className="text-slate-500 mb-8">Bantu kami meningkatkan kualitas layanan SEAPEDIA dengan memberikan ulasan Anda.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Nama Anda</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Penilaian</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                disabled={isSubmitting}
                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
              >
                <Star 
                  className={`w-10 h-10 transition-colors duration-200 ${(hoverRating || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-50'}`}
                />
              </button>
            ))}
            <span className="ml-3 font-semibold text-slate-400 text-sm">
              {rating === 0 ? 'Pilih bintang' : `${rating} dari 5 bintang`}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Komentar & Masukan</label>
          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ceritakan pengalaman Anda menggunakan aplikasi SEAPEDIA..."
            rows={4}
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kirim Ulasan'}
        </button>
      </form>
    </div>
  );
};
