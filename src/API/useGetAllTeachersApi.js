import { useQuery } from "@tanstack/react-query";
// Cookies
import { useCookies } from "react-cookie";
// API
import API from "./Api";

export const fetchAllTeachers = async (userId) => {
  const res = await API.get(`api/teachers-associated-with-user/${userId}`);
  return res.data;
};

export default function useGetAllTeachersApi() {

  // Cookie
  const [cookies, setCookie] = useCookies(["userId"]);
  const userId = cookies.userId

  return useQuery({
    queryKey: ["allTeachers"],
    queryFn: () => fetchAllTeachers(userId),
  });
}
