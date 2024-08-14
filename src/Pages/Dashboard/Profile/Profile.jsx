import style from "./Profile.module.scss";
// React
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
// Api
import useGetAllTeachersApi from "../../../API/useGetAllTeachersApi";
import { useEditTeacherApi } from "../../../API/useEditTeacherApi";
import useGetTeacherByIdApi from "../../../API/useGetTeacherByIdApi";
import { useDeleteImageApi } from "../../../API/useDeleteImageApi";
import { useAddImageApi } from "../../../API/useAddImageApi";
// Toastify
import { toast } from "react-toastify";

export default function Profile() {

  const editFormRef = useRef();
  const [selectedTeacherId, setSelectedTeachertId] = useState("");
  const [editFormData, setEditFormData] = useState({
    email: "",
  });

  const { data: teachers, fetchStatus } = useGetAllTeachersApi();
  const { mutate, data, isPending, isSuccess } = useEditTeacherApi();

  useEffect(() => {
    if (isSuccess) {
      // Reset the form after successful submission
      editFormRef.current.reset();
      setSelectedTeachertId("");
      setEditFormData({
        email: "",
      });
      toast.success(data.message);
    }
  }, [isSuccess]);

  useEffect(() => {
    // If there's a selected teacher, update the editFormData state
    if (selectedTeacherId) {
      // Find the selected teacher by ID
      const selectedTeacherData = teachers.find(
        (teacher) => teacher.id === parseInt(selectedTeacherId, 10)
      );
      setEditFormData({
        email: selectedTeacherData.email,
      });
    }
  }, [selectedTeacherId, teachers]);

  const handleInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = editFormRef.current.reportValidity();
    if (!validate) return;
    // Submit data

    const formData = new FormData();
    // Append all form data to the FormData object
    Object.keys(editFormData).forEach((key) => {
      formData.append(key, editFormData[key]);
    });

    mutate({ selectedTeacherId, formData });
  };

  // Toggle button
  const [toggleBtn, setToggleBtn] = useState(true);

  // Images form
  const {
    data: teacher,
    fetchStatus: fetchTeacherStatus,
    refetch,
  } = useGetTeacherByIdApi({
    id: selectedTeacherId,
  });

  // You can also manually trigger a refetch when selectedTeacherId changes
  useEffect(() => {
    if (toggleBtn === false) {
      refetch();
    }
  }, [selectedTeacherId, toggleBtn]);

  // Delete image
  const {
    mutate: mutateDeleteImage,
    data: dataDeleteImage,
    isPending: isPendingDeleteImage,
    isSuccess: isSuccessDeleteImage,
  } = useDeleteImageApi(selectedTeacherId);
  const deleteImage = (id) => {
    mutateDeleteImage(id);
  };

  // Add image
  const {
    mutate: mutateAddImage,
    data: dataAddImage,
    isPending: isPendingAddImage,
    isSuccess: isSuccessAddImage,
  } = useAddImageApi(selectedTeacherId);

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
      formData.append("teacher_id", selectedTeacherId);
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
      {fetchStatus === "fetching" ||
        (isPendingDeleteImage && (
          <div className={style.progressContainer}>
            <LinearProgress />
          </div>
        ))}

      <Box
        component="form"
        noValidate
        sx={{ m: "auto", mt: 3, maxWidth: "700px" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              select
              label="الملف الشخصي"
              value={selectedTeacherId}
              onChange={(e) => {
                setSelectedTeachertId(e.target.value);
                setEditFormData({
                  email: "",
                });
              }}
              disabled={isPending}
            >
              {teachers === undefined && (
                <MenuItem dir="rtl" value="">
                  <em>جاري التحميل...</em>
                </MenuItem>
              )}

              {teachers?.length === 0 && (
                <MenuItem dir="rtl" value="">
                  <em>لا يوجد بيانات لتعديلها</em>
                </MenuItem>
              )}

              {teachers !== undefined &&
                teachers?.length !== 0 &&
                teachers.map((teacher) => (
                  <MenuItem
                    sx={{ fontFamily: '"Cairo", sans-serif !important' }}
                    dir="rtl"
                    key={teacher.id}
                    value={teacher.id}
                  >
                    {teacher.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {selectedTeacherId && (
        <Stack
          sx={{ pt: 4, pb: 4, maxWidth: "617px", margin: "auto" }}
          spacing={2}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            sx={{ width: "100%" }}
            size="large"
            variant={toggleBtn ? "contained" : "outlined"}
            onClick={() => setToggleBtn(true)}
          >
            اضافة بريد الكتروني
          </Button>

          <Button
            sx={{ width: "100%" }}
            size="large"
            color="secondary"
            variant={!toggleBtn ? "contained" : "outlined"}
            onClick={() => setToggleBtn(false)}
          >
            اضافة صور للألبوم
          </Button>
        </Stack>
      )}

      {/* Email */}
      {selectedTeacherId && toggleBtn && (
        <Box
          ref={editFormRef}
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ m: "auto", mt: 3, maxWidth: "700px" }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="البريد الالكتروني"
                type="email"
                name="email"
                required
                disabled={isPending}
                value={editFormData.email || ""}
                onChange={handleInputChange}
                dir="ltr"
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
            حفظ / تعديل
          </LoadingButton>
        </Box>
      )}

      {/* Album image + image input*/}
      {selectedTeacherId && !toggleBtn && (
        <>
          {teacher?.albums?.length > 0 && (
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
              حفظ / تعديل
            </LoadingButton>
          </Box>
        </>
      )}
    </div>
  );
}
