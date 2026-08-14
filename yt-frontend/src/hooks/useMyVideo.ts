import { useQuery } from "@tanstack/react-query";
import { GetMyVideo } from "../api/videofetch";

export function useMyVideo() {
  const token = localStorage.getItem("token");
  return useQuery({
    queryKey: ["myvideo"],
    queryFn: () => GetMyVideo(),
    enabled: !!token,
  });
}
