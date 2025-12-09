import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ActionBarProps = {
  children: ReactNode;
  className?: string;
};

export const ActionBar = ({ children, className }: ActionBarProps) => (
  <div
    className={cn(
      "sticky bottom-0 mt-6 flex items-center justify-end gap-3 border-t border-border/80 bg-card/95 px-5 py-4 shadow-[0_-4px_20px_-16px_rgba(0,0,0,0.2)] backdrop-blur",
      className,
    )}
  >
    {children}
  </div>
);
