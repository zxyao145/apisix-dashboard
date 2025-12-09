import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  className?: string;
};

export const PageHeader = ({ title, description, extra, className }: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-3 rounded-xl border border-border/70 bg-card px-5 py-4 shadow-sm",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold leading-tight">{title}</h1>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {extra ? <div className="flex items-center gap-2">{extra}</div> : null}
      </div>
    </div>
  );
};
