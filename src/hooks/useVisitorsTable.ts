import { visitorsApi } from "../api/visitors.ts";
import type { VisitorsTableQuery } from "../api/visitors.ts";
import { useAsync } from "./useAsync.ts";

export function useVisitorsTable(query: VisitorsTableQuery = {}) {
  return useAsync(() => visitorsApi.table(query), [query.page, query.limit]);
}
