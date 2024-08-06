import { useQuery } from "@tanstack/react-query";
// Cookies
import { useCookies } from "react-cookie";
// API
import API from "./Api";

export const fetchAllDoxesTitle = async (userId) => {
  const res = await API.get(`api/doxes-title-associated-with-user/${userId}`);
  return res.data;
};

export default function useGetAllDoxesTitleApi() {

  // Cookie
  const [cookies, setCookie] = useCookies(["userId"]);
  const userId = cookies.userId

  return useQuery({
    queryKey: ["allDoxesTitle"],
    queryFn: () => fetchAllDoxesTitle(userId),
  });
}
