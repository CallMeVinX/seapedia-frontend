import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
}

export default function Button({
  children,
  icon,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-md bg-seapedia-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-seapedia-navy-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seapedia-navy disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
      {icon}
    </button>
  );
}
