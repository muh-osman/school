import { useQuery } from "@tanstack/react-query";
// Cookies
import { useCookies } from "react-cookie";
// API
import API from "./Api";

export const fetchAllTables = async (userId) => {
  const res = await API.get(`api/tables-associated-with-user/${userId}`);
  return res.data;
};

export default function useGetAllTablesApi() {

  // Cookie
  const [cookies, setCookie] = useCookies(["userId"]);
  const userId = cookies.userId

  return useQuery({
    queryKey: ["allTables"],
    queryFn: () => fetchAllTables(userId),
  });
}
