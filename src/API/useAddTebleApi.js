import { useMutation, useQueryClient } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";
// Api
import { fetchAllTables } from "./useGetAllTablesApi";
// Cookies
import { useCookies } from "react-cookie";

export const useAddTebleApi = () => {
  // Cookie
  const [cookies, setCookie] = useCookies(["userId"]);
  const userId = cookies.userId;

  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await API.post("api/tables", formData);
      return res.data;
    },

    onSuccess: () => {
      qc.prefetchQuery({
        queryKey: ["allTables"],
        queryFn: () => fetchAllTables(userId),
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
