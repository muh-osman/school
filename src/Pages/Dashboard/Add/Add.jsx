import style from "./Add.module.scss";
// React
import { useEffect, useRef } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import LinearProgress from "@mui/material/LinearProgress";
// Api
import { useAddPostApi } from "../../../API/useAddPostApi";
import useShowPostsApi from "../../../API/useShowPostsApi";
// Toastify
import { toast } from "react-toastify";

export default function Add() {
  const formRef = useRef();

  const { fetchStatus } = useShowPostsApi();
  const { mutate, data, isPending, isSuccess } = useAddPostApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = formRef.current.reportValidity();
    if (!validate) return;
    // Submit data
    const data = new FormData(e.currentTarget);
    mutate(data);
  };

  useEffect(() => {
    if (isSuccess) {
      // Reset the form after successful submission
      formRef.current.reset();
      toast.success(data.message);
    }
  }, [isSuccess]);

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}
      <Box
        ref={formRef}
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="title"
              label="Title"
              type="text"
              name="title"
              autoFocus
              required
              disabled={isPending}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              label="Description"
              type="text"
              name="description"
              required
              disabled={isPending}
            />
          </Grid>
        </Grid>

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          disableRipple
          loading={isPending}
          sx={{ mt: 3, mb: 2, transition: "0.1s" }}
        >
          Add
        </LoadingButton>
      </Box>
    </div>
  );
}
