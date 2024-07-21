import { useMutation, useQueryClient } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";
// Api
import { fetchAllTeachers } from "./useGetAllTeachersApi";
// Cookies
import { useCookies } from "react-cookie";

export const useEditTeacherApi = () => {

  // Cookie
  const [cookies, setCookie] = useCookies(["userId"]);
  const userId = cookies.userId


  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ selectedTeacherId, formData }) => {
      const res = await API.post(
        `api/teachers/${selectedTeacherId}?_method=PATCH`,
        formData
      );
      return res.data;
    },

    onSuccess: () => {
      qc.prefetchQuery({
        queryKey: ["allTeachers"],
        queryFn: () => fetchAllTeachers(userId),
      });
    },

    onError: (err) => {
      console.error(err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "An error occurred";
      // Toastify
      toast.error(errorMessage);
    },
  });
};
