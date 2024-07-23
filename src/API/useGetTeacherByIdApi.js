import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export default function useGetTeacherByIdApi({ id }) {
  const fetchTeachersById = async () => {
    const res = await API.get(`api/teachers/${id}`);
    return res.data;
  };

  return useQuery({
    queryKey: ["teacher", id],
    queryFn: () => fetchTeachersById(),
  });
}
