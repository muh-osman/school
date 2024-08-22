import style from "./EditTeacher.module.scss";
// React
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from "@mui/lab/LoadingButton";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
// Api
import useGetAllTeachersApi from "../../../API/useGetAllTeachersApi";
import { useEditTeacherApi } from "../../../API/useEditTeacherApi";
// Toastify
import { toast } from "react-toastify";

export default function EditTeacher() {
  const editFormRef = useRef();
  const [selectedTeacherId, setSelectedTeachertId] = useState("");
  const [editFormData, setEditFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    image: "",
    email: "",
  });

  const { data: teachers, fetchStatus } = useGetAllTeachersApi();
  const { mutate, data, isPending, isSuccess } = useEditTeacherApi();

  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      navigate("/");
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
        name: selectedTeacherData.name,
        bio: selectedTeacherData.bio,
        email: selectedTeacherData.email || "",
        skills: selectedTeacherData.skills,
        // image: selectedTeacherData.image,
      });
    }
  }, [selectedTeacherId, teachers]);

  const handleInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditFormData({
      ...editFormData,
      image: file,
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
      // Check if the key is 'image' and if there is no image selected
      if (key === "image" && !editFormData.image) {
        return; // Skip appending the 'image' key if no image is selected
      }
      formData.append(key, editFormData[key]);
    });

    mutate({ selectedTeacherId, formData });
  };

  const addImagesToAlbum = () => {
    navigate(`album/${selectedTeacherId}`);
  };

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}
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
              required
              fullWidth
              select
              label="اختر اسم الملف المراد تعديله"
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeachertId(e.target.value)}
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

          {selectedTeacherId && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="الأسم"
                  type="text"
                  name="name"
                  required
                  disabled={isPending}
                  value={editFormData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="نبذة شخصية"
                  type="text"
                  name="bio"
                  required
                  disabled={isPending}
                  value={editFormData.bio}
                  onChange={handleInputChange}
                  dir="rtl"
                  multiline
                  rows={3}
                  sx={{ backgroundColor: "#fff", whiteSpace: "pre-wrap" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="المهارات"
                  type="text"
                  name="skills"
                  required
                  disabled={isPending}
                  value={editFormData.skills}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="البريد الالكتروني"
                  type="email"
                  name="email"
                  required
                  disabled={isPending}
                  value={editFormData.email}
                  onChange={handleInputChange}
                  dir="ltr"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="الصورة الشخصية"
                  fullWidth
                  type="file"
                  name="image"
                  disabled={isPending}
                  onChange={handleImageChange}
                  dir="ltr"
                />
              </Grid>
            </>
          )}
        </Grid>

        {selectedTeacherId && (
          <Button
            onClick={addImagesToAlbum}
            fullWidth
            variant="outlined"
            sx={{ mt: 3 }}
          >
            اضافة البوم صور
          </Button>
        )}

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          disableRipple
          loading={isPending}
          sx={{ mt: 3, mb: 2, transition: "0.1s" }}
        >
          تعديل
        </LoadingButton>
      </Box>
    </div>
  );
}
