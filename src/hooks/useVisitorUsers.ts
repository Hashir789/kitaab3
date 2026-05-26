import { visitorsApi } from "../api/visitors.ts";
import { useAsync } from "./useAsync.ts";

export function useVisitorUsers(anonymousId: string) {
  return useAsync(() => visitorsApi.usersAssociation(anonymousId), [anonymousId]);
}
