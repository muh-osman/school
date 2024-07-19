import style from "./Dashboard.module.scss";
// React router
import { Link } from "react-router-dom";
// React
import { useEffect } from "react";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
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

      <Stack
        sx={{pt: 6 }}
        spacing={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap="14px"
      >
        <Link to={"add-teacher"}>
          <Button  size="large" variant="contained">اضافة</Button>
        </Link>

        <Link to={"edit-teacher"}>
          <Button size="large" color="secondary" variant="outlined">تعديل</Button>
        </Link>

        <Link to={"delete-teacher"}>
          <Button size="large" color="error" variant="outlined">حذف</Button>
        </Link>
      </Stack>
    </div>
  );
}
