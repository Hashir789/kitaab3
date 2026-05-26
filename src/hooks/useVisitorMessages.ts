import { visitorsApi } from "../api/visitors.ts";
import { useAsync } from "./useAsync.ts";

export function useVisitorMessages(anonymousId: string) {
  return useAsync(() => visitorsApi.messagesAssociation(anonymousId), [anonymousId]);
}
