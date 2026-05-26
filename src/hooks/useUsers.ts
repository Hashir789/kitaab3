import { usersApi } from "../api/users.ts";
import type { UserQuery } from "../api/users.ts";
import { useAsync } from "./useAsync.ts";

export function useUsers(query: UserQuery = {}) {
  return useAsync(
    () => usersApi.list(query),
    [query.search, query.limit, query.cursor],
  );
}
