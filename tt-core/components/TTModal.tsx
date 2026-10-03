"use client";

import { useEffect, type ReactNode } from "react";

type TTModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
};

export default function TTModal({
  isOpen,
  title,
  description,
  children,
  onClose,
}: TTModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
      role="presentation"
    >
      <section
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tt-modal-title"
      >
        <header className="flex items-start justify-between border-b border-slate-800 p-6">
          <div>
            <h2
              id="tt-modal-title"
              className="text-2xl font-bold text-white"
            >
              {title}
            </h2>

            {description ? (
              <p className="mt-2 text-sm text-slate-400">{description}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close modal"
          >
            ✕
          </button>
        </header>

        <div className="p-6">{children}</div>
      </section>
    </div>
  );
}
