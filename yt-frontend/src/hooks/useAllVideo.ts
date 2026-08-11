import { useQuery } from "@tanstack/react-query";
import { Allvideo } from "../api/videofetch";

export function useAllVideo() {
  return useQuery({
    queryKey: ["users"],
    queryFn: Allvideo,
  });
}
