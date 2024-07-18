import style from "./Delete.module.scss";
// React
import { useEffect, useRef, useState } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from "@mui/lab/LoadingButton";
import LinearProgress from "@mui/material/LinearProgress";
// Api
import { useDeletePostApi } from "../../../API/useDeletePostApi";
import useShowPostsApi from "../../../API/useShowPostsApi";
// Toastify
import { toast } from "react-toastify";

export default function Delete() {
  const formRef = useRef();
  const [selectedPostId, setSelectedPostId] = useState("");

  const { data: posts, fetchStatus } = useShowPostsApi();
  const { mutate, data, isPending, isSuccess } = useDeletePostApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = formRef.current.reportValidity();
    if (!validate) return;
    // Submit data
    mutate(selectedPostId);
  };

  useEffect(() => {
    if (isSuccess) {
      // Reset the form after successful submission
      formRef.current.reset();
      setSelectedPostId("");
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
              required
              fullWidth
              id="outlined-select-post"
              select
              label="Select"
              helperText="Please select the post"
              value={selectedPostId}
              onChange={(e) => setSelectedPostId(e.target.value)}
              disabled={isPending}
            >
              {posts === undefined && (
                <MenuItem value="">
                  <em>Loading...</em>
                </MenuItem>
              )}

              {posts?.length === 0 && (
                <MenuItem value="">
                  <em>No post to delete.</em>
                </MenuItem>
              )}

              {posts !== undefined &&
                posts?.length !== 0 &&
                posts.map((post) => (
                  <MenuItem key={post.id} value={post.id}>
                    {post.title}
                  </MenuItem>
                ))}
            </TextField>
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
          Delete
        </LoadingButton>
      </Box>
    </div>
  );
}
