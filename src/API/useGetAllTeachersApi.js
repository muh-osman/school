import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchAllTeachers = async () => {
  const res = await API.get("api/teachers");
  return res.data;
};

export default function useGetAllTeachersApi() {
  return useQuery({
    queryKey: ["allTeachers"],
    queryFn: () => fetchAllTeachers(),
  });
}
