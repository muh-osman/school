import style from "./Dashboard.module.scss";
// React router
import { Link } from "react-router-dom";
// React
import { useEffect } from "react";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
// API
import useShowPostsApi from "../../API/useShowPostsApi";
// Toastify
import { toast } from "react-toastify";

export default function Dashboard() {
  const { data, isLoading, isError, error, fetchStatus, isSuccess } =
    useShowPostsApi();

  useEffect(() => {
    if (isError) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "An error occurred";
      // Toastify
      toast.error(errorMessage);
    }
  }, [error]);

  return (
    <div className={style.container}>

      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <h1>Dashboard</h1>
      {isSuccess && data?.length === 0 && <p>No post to show.</p>}
      <div className={style.posts_box}>
        {data?.map(({ id, title, description }) => (
          <Link to={`post/${id}`} key={id}>
            <h3> {title} </h3>
            <p>{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
