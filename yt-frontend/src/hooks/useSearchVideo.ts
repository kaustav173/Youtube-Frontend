import { useQuery } from "@tanstack/react-query";

import { SearchVideo } from "../api/videofetch";

interface IText {
  text: string;
}

export function useSearchVideo(text: IText) {
  return useQuery({
    queryKey: ["search"],
    queryFn: () => SearchVideo(text),
  });
}
