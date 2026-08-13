import { useQuery } from "@tanstack/react-query";

import { SearchVideo } from "../api/videofetch";

export function useSearchVideo(text: string | undefined) {
  return useQuery({
    queryKey: ["search", text],
    queryFn: () => SearchVideo(text!),
    enabled: !!text,
  });
}
