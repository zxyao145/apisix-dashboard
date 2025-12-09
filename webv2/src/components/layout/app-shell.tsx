"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import useAuth from "@/hooks/use-auth";

import Topbar from "./topbar";
import Sidebar from "./sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  const { token, initialized } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
    if (!token) {
      const redirect = encodeURIComponent(pathname);
      router.replace(`/user/login?redirect=${redirect}`);
    }
  }, [initialized, pathname, router, token]);

  if (!initialized) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        Loading session...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 bg-muted/40 px-6 py-4">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
