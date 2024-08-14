import style from "./Album.module.scss";
// React
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from "@mui/lab/LoadingButton";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import CollectionsIcon from "@mui/icons-material/Collections";
// Toastify
import { toast } from "react-toastify";
// Api
import useGetTeacherByIdApi from "../../../API/useGetTeacherByIdApi";
import { useAddImageApi } from "../../../API/useAddImageApi";
import { useDeleteImageApi } from "../../../API/useDeleteImageApi";

export default function Album() {
  let { id } = useParams();

  // Images form
  const { data: teacher, fetchStatus } = useGetTeacherByIdApi({
    id: id,
  });

  // Delete image
  const {
    mutate: mutateDeleteImage,
    data: dataDeleteImage,
    isPending: isPendingDeleteImage,
    isSuccess: isSuccessDeleteImage,
  } = useDeleteImageApi(id);

  const deleteImage = (id) => {
    mutateDeleteImage(id);
  };

  // Add image
  const {
    mutate: mutateAddImage,
    data: dataAddImage,
    isPending: isPendingAddImage,
    isSuccess: isSuccessAddImage,
  } = useAddImageApi(id);

  const imagesFormRef = useRef();

  const handleImagesSubmit = (e) => {
    e.preventDefault();
    const validate = imagesFormRef.current.reportValidity();
    if (!validate) return;

    const fileInput = e.target.querySelector('input[type="file"]');
    const files = Array.from(fileInput.files);

    // Send images one by one
    files.forEach((file) => {
      const formData = new FormData();
      formData.append("teacher_id", id);
      formData.append("image", file);

      mutateAddImage(formData);
    });
  };

  useEffect(() => {
    if (isSuccessAddImage) {
      // Reset the form after submission
      imagesFormRef.current.reset();
    }
  }, [isSuccessAddImage]);

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      {isPendingDeleteImage === true && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}
      {/* Album image + image input*/}

      {teacher?.albums?.length > 0 ? (
        <div className={style.img_container}>
          {teacher?.albums?.map(({ id, image }) => (
            <div
              key={id}
              className={style.img_box}
              onClick={() => deleteImage(id)}
            >
              <img src={image} alt={id} key={id} />
              <DeleteIcon className={style.del_icon} />
            </div>
          ))}
        </div>
      ) : (
        <Stack
          sx={{ pt: 4, pb: 4, maxWidth: "617px", margin: "auto" }}
          spacing={2}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <CollectionsIcon sx={{ fontSize: "55px", color: "#757575" }} />
        </Stack>
      )}

      <Box
        ref={imagesFormRef}
        component="form"
        noValidate
        onSubmit={handleImagesSubmit}
        sx={{ m: "auto", mt: 3, maxWidth: "700px" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="file"
              name="image"
              disabled={isPendingAddImage}
              dir="ltr"
              required
              inputProps={{
                multiple: true,
              }}
            />
          </Grid>
        </Grid>

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          disableRipple
          loading={isPendingAddImage}
          sx={{ mt: 3, mb: 2, transition: "0.1s" }}
        >
          حفظ
        </LoadingButton>
      </Box>
    </div>
  );
}
