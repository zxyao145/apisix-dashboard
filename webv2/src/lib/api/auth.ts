"use client";

import { apiRequest } from "./client";
import type { AuthUser, LoginResponse } from "@/types/account";
import type { ApiResult } from "@/types/api";

const DEFAULT_USER: AuthUser = {
  name: "APISIX User",
  avatar: "/logo.svg",
  userid: "00000001",
  access: "admin",
};

export const loginWithPassword = async (payload: {
  username: string;
  password: string;
}): Promise<ApiResult<LoginResponse>> => {
  const result = await apiRequest<LoginResponse>({
    url: "/user/login",
    method: "POST",
    data: payload,
  });
  if (typeof window !== "undefined" && result.data?.token) {
    localStorage.setItem("token", result.data.token);
  }
  return result;
};

export const loginWithToken = async (token: string): Promise<AuthUser> => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
  return getCurrentUser();
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  try {
    const result = await apiRequest<AuthUser>({
      url: "/user",
      method: "GET",
    });
    return result.data || DEFAULT_USER;
  } catch (error) {
    // Fall back to the default stub to avoid breaking layout when API is unreachable.
    return DEFAULT_USER;
  }
};

export const logout = async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
  return Promise.resolve();
};
