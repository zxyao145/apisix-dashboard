"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LogoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const redirectTo = searchParams?.get("redirect");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    const target = redirectTo || encodeURIComponent(pathname);
    router.replace(`/user/login?redirect=${target}`);
  }, [pathname, redirectTo, router]);

  return null;
};

export default LogoutPage;
