import { api } from "./client.ts";

export type AuthUser = {
  email: string;
  full_name: string;
  dob: string;
  gender: string;
  key_salt: string;
  key_iv: string;
  encrypted_master_key: string;
  created_at: string;
  email_verified: boolean;
  two_factor_enabled: boolean;
};

export type LoginRequest = {
  anonymous_id: string;
  email: string;
  password: string;
};

export type LoginResponse = AuthUser & {
  access_token: string;
};

export const authApi = {
  login: (body: LoginRequest) =>
    api.post<LoginResponse>("/auth/login", body, { skipAuth: true }),
};
