import { useMutation, useQueryClient } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";
// Api
import { fetchAllTeachers } from "./useGetAllTeachersApi";

export const useAddTeacherApi = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await API.post("api/teachers", formData);
      return res.data;
    },

    onSuccess: () => {
      qc.prefetchQuery({
        queryKey: ["allTeachers"],
        queryFn: () => fetchAllTeachers(),
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
