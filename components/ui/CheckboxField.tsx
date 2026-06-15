import { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface CheckboxFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  error?: string;
}

export default function CheckboxField({
  id,
  label,
  error,
  className,
  ...props
}: CheckboxFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <input
          id={id}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-seapedia-navy focus:ring-seapedia-navy cursor-pointer",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...props}
        />
        <label htmlFor={id} className="text-sm text-gray-600 select-none">
          {label}
        </label>
      </div>
      {error && (
        <span id={errorId} className="text-xs text-red-500 pl-6 animate-in fade-in duration-200" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
