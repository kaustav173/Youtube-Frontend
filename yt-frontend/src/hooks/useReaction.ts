import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeCount } from "../api/videoCount";

type ReactionVars = { id: string; type: "LIKE" | "DISLIKE" };

interface IOLDDATA {
  likeCount: number;
  dislikeCount: number;
}

export function useReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, type }: ReactionVars) => likeCount(id, type),

    onMutate: async ({ id, type }) => {
      const videoQueryKey = ["video", id];

      await queryClient.cancelQueries({ queryKey: videoQueryKey });

      const previousVideo = queryClient.getQueryData(videoQueryKey);

      queryClient.setQueryData(videoQueryKey, (oldData: IOLDDATA) => {
        if (!oldData) return oldData;

        const currentLikeCount = Number(oldData.likeCount);
        const currentDislikeCount = Number(oldData.dislikeCount);

        return {
          ...oldData,
          likeCount: type === "LIKE" ? currentLikeCount + 1 : currentLikeCount,
          dislikeCount:
            type === "DISLIKE" ? currentDislikeCount + 1 : currentDislikeCount,
        };
      });

      return { previousVideo };
    },

    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["video", id] });
    },
  });
}
