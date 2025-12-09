export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/apisix/admin";

export const isBrowser = typeof window !== "undefined";

export const redirectToLogin = (redirect?: string) => {
  if (!isBrowser) return;
  const target =
    redirect ||
    (typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "/");
  localStorage.removeItem("token");
  window.location.href = `/user/login?redirect=${encodeURIComponent(target)}`;
};

export const stripEmpty = (input: unknown): unknown => {
  if (Array.isArray(input)) {
    return input
      .map((item) => stripEmpty(item))
      .filter((item) => item !== undefined && item !== null);
  }

  if (input && typeof input === "object") {
    return Object.entries(input as Record<string, unknown>).reduce<
      Record<string, unknown>
    >((acc, [key, value]) => {
      const nextValue = stripEmpty(value);
      if (nextValue !== undefined && nextValue !== null) {
        acc[key] = nextValue;
      }
      return acc;
    }, {});
  }

  return input;
};
