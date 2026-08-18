import { useState } from "react";
import { useComments } from "../hooks/useComments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "../api/comments";

type Comment = {
  id?: string;
  _id?: string;
  text: string;
  user?: { name?: string };
  username?: string;
};

function Comments({ id }: { id?: string }) {
  const queryClient = useQueryClient();
  const { data, isFetching } = useComments(id ?? "");
  const [text, setText] = useState("");

  const mutation = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      postComment({ id, text }),
    onSuccess: () => {
      if (!id) return;
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setText("");
    },
  });

  if (isFetching) {
    return <div>Is Fetching...</div>;
  }

  const comments = data?.data ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !text.trim()) return;
    mutation.mutate({ id, text: text.trim() });
  };

  return (
    <div className="mt-10">
      <h3 className="font-semibold mb-2">Comments</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="border rounded-md p-2 w-full"
          rows={3}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-60"
          >
            {mutation.isPending ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <div>No Comments Yet</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {comments.map((c: Comment) => (
            <li key={c.id || c._id} className="border rounded-md p-2">
              <div className="text-sm  mb-1">
                {c.user?.name ?? c.username ?? "User"}
              </div>
              <div>{c.text}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Comments;
