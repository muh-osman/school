import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchAllTables = async () => {
  const res = await API.get(`api/tables-associated-with-user`);
  return res.data;
};

export default function useGetAllTablesApi() {
  return useQuery({
    queryKey: ["allTables"],
    queryFn: () => fetchAllTables(),
  });
}
