import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// API base
import API from "./Api";
// Cookies
import { useCookies } from "react-cookie";

export const useLogoutApi = () => {
  const navigate = useNavigate();

  const qc = useQueryClient();
  // Cookies
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "verified",
    "userId",
    "pinStatus",
  ]);

  return useMutation({
    mutationFn: async () => {
      const res = await API.post("api/logout");
      return res.data;
    },

    onSuccess: () => {
      qc.clear();
      removeCookie("userId");
      removeCookie("verified");
      removeCookie("pinStatus");
      removeCookie("token");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    },

    onError: (err) => {
      qc.clear();
      console.error(err);
      removeCookie("userId");
      removeCookie("verified");
      removeCookie("pinStatus");
      removeCookie("token");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    },
  });
};
