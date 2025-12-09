"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BookOpen, Github } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import UserMenu from "./user-menu";

const Topbar = () => {
  const env = useMemo(
    () =>
      process.env.NEXT_PUBLIC_ENV ||
      process.env.NEXT_PUBLIC_APP_ENV ||
      process.env.NEXT_PUBLIC_RUNTIME_ENV,
    [],
  );

  return (
    <header className="flex h-14 items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link
          href="https://apisix.apache.org/docs/apisix/getting-started"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-foreground transition hover:bg-muted"
        >
          <BookOpen className="h-4 w-4" />
          Documentation
        </Link>
        <Link
          href="https://github.com/apache/apisix-dashboard"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-foreground transition hover:bg-muted"
        >
          <Github className="h-4 w-4" />
          Source
        </Link>
        {env ? (
          <Badge variant="outline" className="uppercase">
            {env}
          </Badge>
        ) : null}
      </div>
      <UserMenu />
    </header>
  );
};

export default Topbar;
