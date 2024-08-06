import { useMutation, useQueryClient } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";
// Api
import { fetchAllDoxesTitle } from "./useGetAllDoxesTitleApi";
// Cookies
import { useCookies } from "react-cookie";

export const useEditDoxApi = () => {
  // Cookie
  const [cookies, setCookie] = useCookies(["userId"]);
  const userId = cookies.userId;

  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await API.post(`api/doxes/${data.id}?_method=PATCH`, data);
      return res.data;
    },

    onSuccess: () => {
      qc.prefetchQuery({
        queryKey: ["allDoxesTitle"],
        queryFn: () => fetchAllDoxesTitle(userId),
      });
      toast.success("Updated successfully");
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
