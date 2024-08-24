import { useMutation, useQueryClient } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";
// Api
import { fetchTeachersById } from "./useGetTeacherByIdApi";

export const useAddImageApi = (id) => {

  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await API.post("api/albums", formData);
      return res.data;
    },

    onSuccess: () => {
      qc.prefetchQuery({
        queryKey: ["teacher", id],
        queryFn: () => fetchTeachersById(id),
      });

      toast.success("Uploaded successfully");
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
