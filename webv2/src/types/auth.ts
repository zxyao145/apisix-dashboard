import type { AuthUser } from "./account";

export type AuthState = {
  user?: AuthUser;
  token?: string;
  loading: boolean;
  initialized: boolean;
  error?: string;
};

export type AuthContextValue = AuthState & {
  signInWithPassword: (payload: { username: string; password: string }) => Promise<void>;
  signInWithToken: (token: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
};
