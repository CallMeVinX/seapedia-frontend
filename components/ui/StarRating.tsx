"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(starValue)}
            className={[
              "focus:outline-none transition-transform",
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default",
              isFilled ? "text-amber-400" : "text-slate-200"
            ].filter(Boolean).join(" ")}
            aria-label={`Rate ${starValue} stars`}
          >
            <Star
              className={[
                sizeClasses[size],
                isFilled ? "fill-amber-400" : "fill-transparent"
              ].filter(Boolean).join(" ")}
            />
          </button>
        );
      })}
    </div>
  );
}
