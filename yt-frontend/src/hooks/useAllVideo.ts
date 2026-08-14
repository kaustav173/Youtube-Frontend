import { useQuery } from "@tanstack/react-query";
import { Allvideo } from "../api/videofetch";

export function useAllVideo(id) {
  return useQuery({
    queryKey: ["videos", id],
    queryFn: () => Allvideo(id),
    enabled: !!id,
  });
}
