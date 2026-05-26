import { visitorsApi } from "../api/visitors.ts";
import type { EmailsTableQuery } from "../api/visitors.ts";
import { useAsync } from "./useAsync.ts";

export function useEmailsTable(query: EmailsTableQuery = {}) {
  return useAsync(() => visitorsApi.emailsTable(query), [query.page, query.limit]);
}
