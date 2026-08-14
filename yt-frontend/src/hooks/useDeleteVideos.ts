import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteVideo } from "../api/videofetch";

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myvideo"],
      });
    },
  });
}
