import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeCount } from "../api/videoCount";

type ReactionVars = { id: string; type: string };

export function useReaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, type }: ReactionVars) => likeCount(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video"] });
    },
  });
}
