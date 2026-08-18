import { useQuery } from "@tanstack/react-query";
import { commentsApi } from "../api/comments";

export function useComments(id: string) {
  return useQuery({
    queryKey: ["comments", id],
    queryFn: () => commentsApi(id),
    enabled: !!id,
  });
}
