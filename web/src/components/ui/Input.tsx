import { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Warning } from "phosphor-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className={twMerge("input-label", error && "text-danger")}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={twMerge(
            error ? "input-error" : "input-default",
            className
          )}
          {...props}
        />
        {error && (
          <div className="input-error-message">
            <Warning size={16} className="text-danger" weight="fill" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
