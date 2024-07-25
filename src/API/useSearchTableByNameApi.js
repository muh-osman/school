import { useMutation, useQueryClient } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";
// Cookies
import { useCookies } from "react-cookie";

export const useSearchTableByNameApi = () => {

  // Cookie
  const [cookies, setCookie] = useCookies(["userId"]);
  const userId = cookies.userId

  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (searchQuery) => {
      const res = await API.post(`api/tables/search/${userId}`, {
        name: searchQuery,
      });

      return res.data.tables;
    },

    onSuccess: () => {
      //   toast.success("Manufacturer edited.");
      //   Refetch
      //   qc.invalidateQueries("allManufactures");
      //   qc.prefetchQuery({
      //     queryKey: ["allManufactures"],
      //     queryFn: () => fetchPosts(),
      //   });
    },

    onError: (err) => {
      console.error(err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "An error occurred";
      // Toastify
      // toast.error(errorMessage);
    },
  });
};
