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
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Write a Review</h3>
        <p className="text-slate-500">Share your SEAPEDIA experience with the community.</p>
      </div>

      {success ? (
        <div className="p-6 bg-green-50 border border-green-100 rounded-xl text-center">
          <p className="font-bold text-green-800">Thank you for your review!</p>
          <p className="text-sm text-green-600 mt-1">Your feedback helps us improve the marketplace.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            id="reviewerName"
            name="reviewerName"
            label="Your Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Star Rating <span className="text-red-500">*</span>
            </label>
            <StarRating 
              rating={rating} 
              interactive={true} 
              size="lg" 
              onRatingChange={setRating} 
            />
            {rating === 0 && <p className="text-xs text-red-500 mt-1">Please select a rating.</p>}
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-seapedia-navy focus:outline-none focus:ring-1 focus:ring-seapedia-navy sm:text-sm"
              placeholder="Tell us what you love about SEAPEDIA..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || rating === 0 || !name || !comment} 
            className="w-full"
            icon={<Send className="w-4 h-4" />}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}
    </div>
  );
}
