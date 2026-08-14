import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteVideo } from "../api/videofetch";

export function useDeleteVideo(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => DeleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-videos"],
      });
    },
  });
}
