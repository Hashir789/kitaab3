import { usersApi } from "../api/users.ts";
import type { UsersTableQuery } from "../api/users.ts";
import { useAsync } from "./useAsync.ts";

export function useUsersTable(query: UsersTableQuery = {}) {
  return useAsync(() => usersApi.table(query), [query.page, query.limit]);
}
