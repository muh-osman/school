import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchPosts = async () => {
  const res = await API.get("api/posts");
  return res.data;
};

export default function useShowPostsApi() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(),
  });
}
