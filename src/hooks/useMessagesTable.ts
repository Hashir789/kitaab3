import { visitorsApi } from "../api/visitors.ts";
import type { MessagesTableQuery } from "../api/visitors.ts";
import { useAsync } from "./useAsync.ts";

export function useMessagesTable(query: MessagesTableQuery = {}) {
  return useAsync(() => visitorsApi.messagesTable(query), [query.page, query.limit]);
}
