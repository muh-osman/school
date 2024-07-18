import { useMutation } from "@tanstack/react-query";
// API base
import API from "./Api";
// Toastify
import { toast } from "react-toastify";

export const useResendEmailApi = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await API.post("api/resend-verify-email", {});
      return res.data;
    },

    onMutate: () => {
      return toast.loading("Sending verification email...");
    },

    onSuccess: (data, variables, context) => {
      toast.update(context, {
        render: "Email sent.",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    },

    onError: (err, variables, context) => {
      console.error(err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "An error occurred";
      // Toastify
      toast.update(context, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    },
  });
};
