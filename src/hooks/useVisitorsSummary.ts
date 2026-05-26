import { visitorsApi } from "../api/visitors.ts";
import { useAsync } from "./useAsync.ts";

export function useVisitorsSummary() {
  return useAsync(() => visitorsApi.summary(), []);
}
