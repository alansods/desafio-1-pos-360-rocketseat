import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: "default" | "sm" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    // Se for icon button, usa classe específica
    if (size === "icon") {
      const iconClass =
        variant === "secondary"
          ? "btn-icon btn-size-icon"
          : "btn-primary btn-size-icon";
      return (
        <button
          ref={ref}
          className={twMerge(iconClass, className)}
          {...props}
        />
      );
    }

    // Botões normais
    const variantClasses = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      destructive:
        "btn-base bg-danger text-white rounded-lg hover:bg-danger/90 disabled:opacity-50",
      ghost: "btn-base hover:bg-gray-200 text-gray-500",
    };

    const sizeClasses = {
      default: "btn-size-default",
      sm: "btn-size-sm",
      icon: "btn-size-icon",
    };

    return (
      <button
        ref={ref}
        className={twMerge(
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
