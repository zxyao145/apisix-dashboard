"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getCurrentUser, loginWithPassword, loginWithToken, logout } from "@/lib/api/auth";
import type { AuthContextValue } from "@/types/auth";
import type { AuthUser } from "@/types/account";

type AuthAction =
  | { type: "set-user"; user?: AuthUser }
  | { type: "set-token"; token?: string }
  | { type: "set-loading"; loading: boolean }
  | { type: "set-error"; error?: string }
  | { type: "initialized" }
  | { type: "reset" };

const initialState = {
  user: undefined,
  token: undefined,
  loading: false,
  error: undefined,
  initialized: false,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const reducer = (state: typeof initialState, action: AuthAction) => {
  switch (action.type) {
    case "set-user":
      return { ...state, user: action.user, loading: false };
    case "set-token":
      return { ...state, token: action.token };
    case "set-loading":
      return { ...state, loading: action.loading };
    case "set-error":
      return { ...state, error: action.error };
    case "initialized":
      return { ...state, initialized: true, loading: false };
    case "reset":
      return { ...initialState, initialized: true };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(reducer, initialState);

  const bootstrap = useCallback(async () => {
    const existingToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    if (!existingToken) {
      dispatch({ type: "initialized" });
      return;
    }
    dispatch({ type: "set-token", token: existingToken });
    dispatch({ type: "set-loading", loading: true });
    const user = await getCurrentUser();
    dispatch({ type: "set-user", user });
    dispatch({ type: "initialized" });
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const signInWithPassword = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      dispatch({ type: "set-loading", loading: true });
      dispatch({ type: "set-error", error: undefined });
      try {
        const result = await loginWithPassword({ username, password });
        dispatch({ type: "set-token", token: result.data?.token });
        const user = await getCurrentUser();
        dispatch({ type: "set-user", user });
        dispatch({ type: "initialized" });
      } catch (error) {
        dispatch({
          type: "set-error",
          error: error instanceof Error ? error.message : "Unable to sign in",
        });
        dispatch({ type: "set-loading", loading: false });
        throw error;
      }
    },
    [],
  );

  const signInWithToken = useCallback(async (token: string) => {
    dispatch({ type: "set-token", token });
    const user = await loginWithToken(token);
    dispatch({ type: "set-user", user });
    dispatch({ type: "initialized" });
  }, []);

  const refreshUser = useCallback(async () => {
    const user = await getCurrentUser();
    dispatch({ type: "set-user", user });
  }, []);

  const signOut = useCallback(async () => {
    await logout();
    dispatch({ type: "reset" });
    const redirect = encodeURIComponent(
      `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`,
    );
    router.push(`/user/login?redirect=${redirect}`);
  }, [pathname, router, searchParams]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signInWithPassword,
      signInWithToken,
      refreshUser,
      signOut,
    }),
    [refreshUser, signInWithPassword, signInWithToken, signOut, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
};
