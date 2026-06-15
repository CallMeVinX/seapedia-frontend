import { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  error?: string;
}

export default function InputField({
  label,
  icon,
  rightElement,
  error,
  id,
  className,
  ...props
}: InputFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            "w-full rounded-md border bg-white py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-1",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-seapedia-navy focus:ring-seapedia-navy",
            icon ? "pl-10" : "pl-3",
            rightElement ? "pr-10" : "pr-3",
            className
          )}
          {...props}
        />
        {rightElement && (
          <span className="absolute inset-y-0 right-3 flex items-center">
            {rightElement}
          </span>
        )}
      </div>
      {error && (
        <span id={errorId} className="text-xs text-red-500 mt-0.5 animate-in fade-in duration-200" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
