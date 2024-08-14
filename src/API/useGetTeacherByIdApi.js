import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchTeachersById = async (id) => {
  const res = await API.get(`api/teachers/${id}`);
  return res.data;
};

export default function useGetTeacherByIdApi({ id }) {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: () => fetchTeachersById(id),
  });
}
