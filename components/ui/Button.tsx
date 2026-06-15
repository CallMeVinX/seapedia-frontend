import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const variantStyles = {
  primary: "bg-seapedia-navy text-white hover:bg-seapedia-navy-light focus-visible:outline-seapedia-navy",
  secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:outline-slate-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600"
};

export default function Button({
  children,
  icon,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
      {icon}
    </button>
  );
}
