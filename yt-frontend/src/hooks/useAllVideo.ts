import { useQuery } from "@tanstack/react-query";
import { Allvideo } from "../api/videofetch";

type IID = string | undefined;

export function useAllVideo(id: IID) {
  return useQuery({
    queryKey: ["videos", id],
    queryFn: () => Allvideo(id as string),
    enabled: !!id,
  });
}
