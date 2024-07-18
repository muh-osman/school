import { useMutation } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";

export const useForgotPasswordApi = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await API.post("api/forgot-password", data);
      return res.data;
    },

    onSuccess: () => {
      toast.success("Password reset email sent! Check your inbox.");
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
