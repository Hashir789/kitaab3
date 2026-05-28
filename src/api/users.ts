import { api } from "./client.ts";

export type User = {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  lastActiveAt?: string;
};

export type UserQuery = {
  search?: string;
  limit?: number;
  cursor?: string;
};

export type GenderRatioItem = {
  gender: string;
  count: number;
  percentage: number;
};

export type GenderRatio = {
  total: number;
  distribution: GenderRatioItem[];
};

export type AgeDistributionItem = {
  age: number;
  count: number;
};

export type AgeDistribution = {
  total: number;
  distribution: AgeDistributionItem[];
};

export type UserRow = {
  id: string;
  visitor_id: string;
  gender: string;
  dob: string;
  email_verified: boolean;
  two_factor_enabled: boolean;
  last_login_at: string;
  created_at: string;
};

export type UsersTableResponse = {
  rows: UserRow[];
  total: number;
  page: number;
  limit: number;
};

export type UsersTableQuery = {
  page?: number;
  limit?: number;
};

export type UserVisitor = {
  id: string;
  anonymous_id: string;
  timezone: string;
  device_type: string;
  clicks: number;
  navigations: number;
  number_of_visits: number;
  last_visited: string;
};

export type UserVisitorsAssociation = {
  anonymous_id: string;
  details: UserVisitor[];
};

export const usersApi = {
  list: (params: UserQuery = {}) =>
    api.get<{ items: User[]; nextCursor?: string }>("/users", { query: params }),
  get: (id: string) => api.get<User>(`/users/${id}`),
  genderRatio: () =>
    api.get<GenderRatio>("/users/analytics", { query: { type: "gender_ratio" } }),
  ageDistribution: () =>
    api.get<AgeDistribution>("/users/analytics", { query: { type: "age_distribution" } }),
  table: ({ page = 1, limit = 10 }: UsersTableQuery = {}) =>
    api.get<UsersTableResponse>("/users/analytics", {
      query: { type: "users_table", page, limit },
    }),
  visitorsAssociation: (id: number) =>
    api.get<UserVisitorsAssociation>("/users/analytics", {
      query: { type: "visitors_association", id },
    }),
};
