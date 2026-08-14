import { useQuery } from "@tanstack/react-query";
import { Allvideo } from "../api/videofetch";

interface IID {
  id: string;
}

export function useAllVideo(id: IID) {
  return useQuery({
    queryKey: ["videos", id],
    queryFn: () => Allvideo(id),
    enabled: !!id,
  });
}
