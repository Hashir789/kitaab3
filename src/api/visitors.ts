import { api } from "./client.ts";

export type Visitor = {
  id: string;
  sessionId: string;
  firstSeenAt: string;
  lastSeenAt: string;
  country?: string;
  city?: string;
  referrer?: string;
  userAgent?: string;
};

export type VisitorQuery = {
  from?: string;
  to?: string;
  limit?: number;
  cursor?: string;
};

export type VisitorsSummary = {
  clicks: number;
  navigations: number;
  visitors: number;
  visits: number;
};

export type DeviceDistributionItem = {
  device_type: string;
  count: number;
};

export type TimezoneItem = {
  timezone: string;
  count: number;
};

export type VisitorsAnalyticsSummary = {
  summary: VisitorsSummary;
  device_distribution: DeviceDistributionItem[];
  timezones: TimezoneItem[];
};

export type VisitorRow = {
  id: string;
  anonymous_id: string;
  timezone: string;
  device_type: string;
  clicks: number;
  navigations: number;
  number_of_visits: number;
  last_visited: string;
  created_at: string;
};

export type VisitorsTableResponse = {
  rows: VisitorRow[];
  total: number;
  page: number;
  limit: number;
};

export type VisitorsTableQuery = {
  page?: number;
  limit?: number;
};

export type VisitorMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  phone: string;
  message: string;
  created_at: string;
};

export type VisitorMessagesAssociation = {
  anonymous_id: string;
  details: VisitorMessage[];
};

export type VisitorEmail = {
  id: string;
  email: string;
  created_at: string;
};

export type VisitorEmailsAssociation = {
  anonymous_id: string;
  details: VisitorEmail[];
};

export type VisitorUser = {
  id: string;
  gender: string;
  dob: string;
  email_verified: boolean;
  two_factor_enabled: boolean;
  last_login_at: string;
  created_at: string;
};

export type VisitorUsersAssociation = {
  anonymous_id: string;
  details: VisitorUser[];
};

export const visitorsApi = {
  list: (params: VisitorQuery = {}) =>
    api.get<{ items: Visitor[]; nextCursor?: string }>("/visitors", { query: params }),
  get: (id: string) => api.get<Visitor>(`/visitors/${id}`),
  summary: () =>
    api.get<VisitorsAnalyticsSummary>("/visitors/analytics", {
      query: { type: "summary" },
    }),
  table: ({ page = 1, limit = 10 }: VisitorsTableQuery = {}) =>
    api.get<VisitorsTableResponse>("/visitors/analytics", {
      query: { type: "visitors_table", page, limit },
    }),
  messagesAssociation: (anonymousId: string) =>
    api.get<VisitorMessagesAssociation>("/visitors/analytics", {
      query: { type: "messages_association", anonymous_id: anonymousId },
    }),
  emailsAssociation: (anonymousId: string) =>
    api.get<VisitorEmailsAssociation>("/visitors/analytics", {
      query: { type: "emails_association", anonymous_id: anonymousId },
    }),
  usersAssociation: (anonymousId: string) =>
    api.get<VisitorUsersAssociation>("/visitors/analytics", {
      query: { type: "users_association", anonymous_id: anonymousId },
    }),
};
