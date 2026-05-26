import { usersApi } from "../api/users.ts";
import { useAsync } from "./useAsync.ts";

export function useGenderRatio() {
  return useAsync(() => usersApi.genderRatio(), []);
}

export function useAgeDistribution() {
  return useAsync(() => usersApi.ageDistribution(), []);
}
