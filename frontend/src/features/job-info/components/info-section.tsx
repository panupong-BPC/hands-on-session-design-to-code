"use client";

import { useState, type ReactNode } from "react";

interface InfoSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  actionSlot?: ReactNode;
}

export function InfoSection({
  title,
  children,
  defaultOpen = true,
  actionSlot,
}: InfoSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <button
          aria-expanded={isOpen}
          aria-label={`Toggle ${title} section`}
          onClick={() => setIsOpen((v) => !v)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <svg
            viewBox="0 0 24 24"
            className={[
              "h-4 w-4 fill-none stroke-current shrink-0 transition-transform",
              isOpen ? "rotate-90" : "rotate-0",
            ].join(" ")}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <h2 className="text-sm font-semibold">{title}</h2>
        </button>
        {actionSlot && <div className="ml-3 shrink-0">{actionSlot}</div>}
      </div>

      {/* Collapsible body */}
      {isOpen && <div className="px-5 py-4">{children}</div>}
    </div>
  );
}
