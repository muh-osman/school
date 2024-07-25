import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchTableData = async (tableId) => {
  const res = await API.get(`api/tables/${tableId}`);
  return res.data;
};

export default function useGetTableData(tableId) {


  return useQuery({
    queryKey: ["table", tableId],
    queryFn: () => fetchTableData(tableId),
  });
}
