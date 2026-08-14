import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeCount } from "../api/videoCount";

export function useReaction(id, type) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => likeCount(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["video"],
      });
    },
  });
}
