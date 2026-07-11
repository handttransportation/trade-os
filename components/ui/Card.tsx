import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export default function Card({
  title,
  subtitle,
  children,
  className = "",
}: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg backdrop-blur-sm ${className}`}
    >
      {(title || subtitle) && (
        <div className="border-b border-slate-800 px-6 py-4">
          {title && (
            <h2 className="text-lg font-semibold text-white">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1 text-sm text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}
