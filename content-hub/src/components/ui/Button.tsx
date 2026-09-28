import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: "bg-indigo-600 text-white hover:bg-opacity-90 shadow-sm border border-transparent",
      secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm",
      ghost: "bg-transparent text-slate-600 hover:bg-slate-100 border border-transparent",
      danger: "bg-rose-600 text-white hover:bg-opacity-90 shadow-sm border border-transparent",
      outline: "bg-transparent text-slate-700 border border-slate-200 hover:bg-slate-100/50 shadow-xs",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          variants[variant],
          sizes[size],
          (disabled || isLoading) && "opacity-60 cursor-not-allowed active:scale-100",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
