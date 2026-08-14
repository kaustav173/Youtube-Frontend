import { useQuery } from "@tanstack/react-query";
import { GetAvideo } from "../api/videofetch";

export function useAVideo(id?: string) {
  return useQuery({
    queryKey: ["video", id],
    queryFn: () => GetAvideo({ id: id as string }),
    enabled: !!id,
  });
}
