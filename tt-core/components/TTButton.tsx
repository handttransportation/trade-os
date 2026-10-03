import type { ButtonHTMLAttributes, ReactNode } from "react";

type TTButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";

type TTButtonSize = "small" | "medium" | "large";

type TTButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: TTButtonVariant;
  size?: TTButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const variantClasses: Record<TTButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 focus-visible:ring-blue-500",
  secondary:
    "bg-slate-700 text-white hover:bg-slate-600 focus-visible:ring-slate-500",
  outline:
    "border border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800 focus-visible:ring-slate-500",
  ghost:
    "bg-transparent text-slate-200 hover:bg-slate-800 focus-visible:ring-slate-500",
  danger:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-500",
};

const sizeClasses: Record<TTButtonSize, string> = {
  small: "h-8 px-3 text-sm",
  medium: "h-10 px-4 text-sm",
  large: "h-12 px-5 text-base",
};

export function TTButton({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  type = "button",
  ...props
}: TTButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-slate-950",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : (
        leftIcon
      )}

      <span>{children}</span>

      {!loading && rightIcon}
    </button>
  );
}
