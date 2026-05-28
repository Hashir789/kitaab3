import { usersApi } from "../api/users.ts";
import { useAsync } from "./useAsync.ts";

export function useUserVisitors(id: number) {
  return useAsync(() => usersApi.visitorsAssociation(id), [id]);
}
