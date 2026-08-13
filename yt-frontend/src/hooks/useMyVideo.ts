import { useQuery } from "@tanstack/react-query";
import { GetMyVideo } from "../api/videofetch";

export function useMyVideo() {
  return useQuery({
    queryKey: ["myvideo"],
    queryFn: () => GetMyVideo(),
  });
}
