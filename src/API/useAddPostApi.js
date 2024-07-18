import { useMutation, useQueryClient } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";
// Api
import { fetchPosts } from "./useShowPostsApi";

export const useAddPostApi = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await API.post("api/posts", data);
      return res.data;
    },

    onSuccess: () => {
      qc.prefetchQuery({
        queryKey: ["posts"],
        queryFn: () => fetchPosts(),
      });
    },

    onError: (err) => {
      console.error(err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "An error occurred";
      // Toastify
      toast.error(errorMessage);
    },
  });
};
