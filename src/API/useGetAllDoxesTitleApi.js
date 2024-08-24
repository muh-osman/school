import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchAllDoxesTitle = async () => {
  const res = await API.get(`api/doxes-title-associated-with-user`);
  return res.data;
};

export default function useGetAllDoxesTitleApi() {
  return useQuery({
    queryKey: ["allDoxesTitle"],
    queryFn: () => fetchAllDoxesTitle(),
  });
}
