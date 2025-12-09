import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { PageHeader } from "./page-header";

type PageContainerProps = {
  title?: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  padded?: boolean;
  className?: string;
};

export const PageContainer = ({
  title,
  description,
  extra,
  children,
  padded = true,
  className,
}: PageContainerProps) => {
  return (
    <section className={cn("space-y-4", className)}>
      {title ? <PageHeader title={title} description={description} extra={extra} /> : null}
      <div
        className={cn(
          "rounded-xl border border-border/70 bg-card shadow-sm",
          padded ? "p-5" : "",
        )}
      >
        {children}
      </div>
    </section>
  );
};
