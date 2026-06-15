import { Card } from "./Card";
import { StarRating } from "./StarRating";
import { Quote } from "lucide-react";

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="flex flex-col h-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-bold text-slate-900">{review.reviewerName}</h4>
          <span className="text-xs text-slate-500">{review.date}</span>
        </div>
        <Quote className="h-6 w-6 text-blue-100 fill-blue-50" />
      </div>
      <div className="mb-3">
        <StarRating rating={review.rating} size="sm" />
      </div>
      <p className="text-slate-600 text-sm leading-relaxed flex-grow">
        "{review.comment}"
      </p>
    </Card>
  );
}
