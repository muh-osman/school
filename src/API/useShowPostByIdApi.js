import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export default function useShowPostByIdApi({ id }) {
  const fetchPostById = async () => {
    const res = await API.get(`api/posts/${id}`);
    return res.data;
  };

  return useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(),
  });
}
