"use client";

import { useState, FormEvent } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { StarRating } from "./StarRating";
import { Send } from "lucide-react";

export function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !comment || rating === 0) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setIsSubmitting(false);
    setSuccess(true);
    
    // Reset form after a brief delay
    setTimeout(() => {
      setName("");
      setRating(0);
      setComment("");
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-white/60 max-w-3xl mx-auto overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl" />

      <div className="relative z-10 text-center mb-10">
        <span className="inline-block py-1 px-3 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wider uppercase mb-4">
          Feedback
        </span>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Share Your Experience</h3>
        <p className="text-slate-500 font-medium text-lg max-w-lg mx-auto">Your insights help the SEAPEDIA community discover the best products and sellers.</p>
      </div>

      <div className="relative z-10">
        {success ? (
          <div className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/50 rounded-3xl text-center transform animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-2xl font-extrabold text-emerald-900 mb-2">Thank You!</p>
            <p className="text-emerald-700 font-medium">Your review has been published and helps us improve the marketplace.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <InputField
              id="reviewerName"
              name="reviewerName"
              label="Your Name"
              placeholder="E.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100/80">
              <label className="block text-sm font-bold text-slate-700 mb-4 text-center">
                How would you rate your experience? <span className="text-rose-500">*</span>
              </label>
              <div className="flex justify-center">
                <div className="bg-white px-6 py-4 rounded-full shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <StarRating 
                    rating={rating} 
                    interactive={true} 
                    size="lg" 
                    onRatingChange={setRating} 
                  />
                </div>
              </div>
              {rating === 0 && <p className="text-sm font-medium text-rose-500 mt-4 text-center animate-pulse">Please select a star rating.</p>}
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-bold text-slate-700 mb-2">
                Detailed Review <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={5}
                className="block w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-base resize-none"
                placeholder="Tell us what you loved, what could be improved, and your overall thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || rating === 0 || !name || !comment} 
              className="w-full py-4 text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all"
              icon={<Send className="w-5 h-5" />}
            >
              {isSubmitting ? "Publishing Review..." : "Publish Review"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
