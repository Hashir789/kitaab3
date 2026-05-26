import { visitorsApi } from "../api/visitors.ts";
import type { VisitorQuery } from "../api/visitors.ts";
import { useAsync } from "./useAsync.ts";

export function useVisitors(query: VisitorQuery = {}) {
  return useAsync(
    () => visitorsApi.list(query),
    [query.from, query.to, query.limit, query.cursor],
  );
}
