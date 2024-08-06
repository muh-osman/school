import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchDoxData = async (id) => {
  const res = await API.get(`api/doxes/${id}`);
  return res.data;
};

export default function useGetDoxDataApi(id) {


  return useQuery({
    queryKey: ["dox", id],
    queryFn: () => fetchDoxData(id),
  });
}
