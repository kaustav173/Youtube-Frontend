import { useQuery } from "@tanstack/react-query";
import { GetAvideo } from "../api/videofetch";

interface IID {
  id: string;
}
export function useAVideo(id: IID) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => GetAvideo(id),
    enabled: !!id,
  });
}
