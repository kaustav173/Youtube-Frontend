import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/auth";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (info) => login(info),

    onSuccess: (user) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      queryClient.setQueryData(["users"], user);
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      console.log("Settled");
    },
  });
}
