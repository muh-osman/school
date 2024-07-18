import style from "./Post.module.scss";
// React
import { useEffect } from "react";
// React router
import { useParams, useNavigate } from "react-router-dom";
// API
import useShowPostByIdApi from "../../../API/useShowPostByIdApi";
// Toastify
import { toast } from "react-toastify";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";

export default function Post() {
  let { id } = useParams();

  const {
    data: post,
    isError,
    error,
    fetchStatus,
    isSuccess,
  } = useShowPostByIdApi({ id });

  useEffect(() => {
    if (isError) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "An error occurred";
      // Toastify
      toast.error(errorMessage);
    }
  }, [error]);

  const navigate = useNavigate();

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <Button onClick={() => navigate(-1)} variant="outlined">
        Back
      </Button>

      <h1>{post?.title}</h1>
      <p>{post?.description}</p>
    </div>
  );
}
