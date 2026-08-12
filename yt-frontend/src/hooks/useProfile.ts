import { useQuery } from "@tanstack/react-query";
import { profile } from "../api/auth";

export function useProfile() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => profile(),
  });
}
