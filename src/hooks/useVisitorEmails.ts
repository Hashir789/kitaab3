import { visitorsApi } from "../api/visitors.ts";
import { useAsync } from "./useAsync.ts";

export function useVisitorEmails(anonymousId: string) {
  return useAsync(() => visitorsApi.emailsAssociation(anonymousId), [anonymousId]);
}
