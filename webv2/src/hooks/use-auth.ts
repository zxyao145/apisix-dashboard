"use client";

import { useAuthContext } from "@/contexts/auth/auth-context";

export const useAuth = () => useAuthContext();

export default useAuth;
