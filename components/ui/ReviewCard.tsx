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
  // Generate a vibrant avatar color based on the first letter of the reviewer's name
  const getAvatarColor = (name: string) => {
    const colors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-rose-500"];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  return (
    <Card className="group relative flex flex-col h-full bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Decorative gradient blur in the background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg shadow-inner ${getAvatarColor(review.reviewerName)}`}>
            {review.reviewerName.charAt(0)}
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 tracking-tight">{review.reviewerName}</h4>
            <span className="text-xs font-medium text-slate-400">{review.date}</span>
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
          <Quote className="h-4 w-4 fill-current" />
        </div>
      </div>
      
      <div className="relative z-10 mb-4 bg-slate-50/50 inline-flex px-3 py-1.5 rounded-full border border-slate-100">
        <StarRating rating={review.rating} size="sm" />
      </div>
      
      <p className="relative z-10 text-slate-600 text-base leading-relaxed flex-grow font-medium">
        "{review.comment}"
      </p>
    </Card>
  );
}
