import style from "./Edit.module.scss";
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
import { useEditPostApi } from "../../../API/useEditPostApi";
import useShowPostsApi from "../../../API/useShowPostsApi";
// Toastify
import { toast } from "react-toastify";

export default function Edit() {
  const formRef = useRef();
  const [selectedPostId, setSelectedPostId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const { data: posts, fetchStatus } = useShowPostsApi();
  const { mutate, data, isPending, isSuccess } = useEditPostApi();

  useEffect(() => {
    if (isSuccess) {
      // Reset the form after successful submission
      formRef.current.reset();
      setSelectedPostId("");
      toast.success(data.message);
    }
  }, [isSuccess]);

  useEffect(() => {
    // If there's a selected post, update the formData state
    if (selectedPostId) {
      // Find the selected post by ID
      const selectedPost = posts.find(
        (post) => post.id === parseInt(selectedPostId, 10)
      );
      setFormData({
        title: selectedPost.title,
        description: selectedPost.description,
      });
    }
  }, [selectedPostId, posts]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = formRef.current.reportValidity();
    if (!validate) return;
    // Submit data
    mutate({ selectedPostId, formData });
  };

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
                  <em>No post to edit.</em>
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

          {selectedPostId && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  label="Title"
                  type="text"
                  name="title"
                  required
                  disabled={isPending}
                  value={formData.title}
                  onChange={handleInputChange}
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
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
            </>
          )}
        </Grid>

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          disableRipple
          loading={isPending}
          sx={{ mt: 3, mb: 2, transition: "0.1s" }}
        >
          Edit
        </LoadingButton>
      </Box>
    </div>
  );
}
