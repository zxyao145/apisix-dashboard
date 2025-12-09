export type AuthUser = {
  name: string;
  avatar?: string;
  userid?: string;
  access?: string;
  email?: string;
};

export type LoginResponse = {
  token: string;
};
