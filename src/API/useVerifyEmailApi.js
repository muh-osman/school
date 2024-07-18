import { useMutation } from "@tanstack/react-query";
// API base
import API from "./Api";
// Cookies
import { useCookies } from "react-cookie";

export const useVerifyEmailApi = () => {
  // Cookies
  const [cookies, setCookie] = useCookies(["verified"]);

  return useMutation({
    mutationFn: async (data) => {
      const res = await API.post("api/verify-email", data);
      return res.data;
    },

    onSuccess: () => {
      setCookie("verified", "verified");
    },

    onError: (err) => {
      console.error(err);
    },
  });
};
