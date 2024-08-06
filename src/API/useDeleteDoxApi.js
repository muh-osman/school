import { useMutation, useQueryClient } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";
// Api
import { fetchAllDoxesTitle } from "./useGetAllDoxesTitleApi";
// Cookies
import { useCookies } from "react-cookie";

export const useDeleteDoxApi = () => {

  // Cookie
  const [cookies, setCookie] = useCookies(["userId"]);
  const userId = cookies.userId


  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await API.delete(`api/doxes/${id}`);
      return res.data;
    },

    onSuccess: () => {
      qc.prefetchQuery({
        queryKey: ["allDoxesTitle"],
        queryFn: () => fetchAllDoxesTitle(userId),
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
