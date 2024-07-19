import style from "./AddTeacher.module.scss";
// React
import { useEffect, useRef, useState } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
// Api
import { useAddTeacherApi } from "../../../API/useAddTeacherApi";
// Toastify
import { toast } from "react-toastify";

export default function AddTeacher() {
  const addFormRef = useRef();
  const [addFormData, setAddFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    email: "",
    image: "",
  });

  const { mutate, data, isPending, isSuccess } = useAddTeacherApi();

  useEffect(() => {
    if (isSuccess) {
      // Reset the form after successful submission
      addFormRef.current.reset();
      setAddFormData({
        name: "",
        bio: "",
        skills: "",
        email: "",
        image: "",
      });
      toast.success(data.message);
    }
  }, [isSuccess]);

  const handleInputChange = (e) => {
    setAddFormData({
      ...addFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAddFormData({
      ...addFormData,
      image: file,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = addFormRef.current.reportValidity();
    if (!validate) return;
    // Submit data

    const formData = new FormData();
    // Append all form data to the FormData object
    Object.keys(addFormData).forEach((key) => {
      // Check if the key is 'image' and if there is no image selected
      if (key === "image" && !addFormData.image) {
        return; // Skip appending the 'image' key if no image is selected
      }
      formData.append(key, addFormData[key]);
    });

    mutate(formData);
  };

  return (
    <div className={style.container}>
      <Box
        ref={addFormRef}
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ m: "auto", mt: 3, maxWidth: "350px" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="الأسم"
              type="text"
              name="name"
              required
              disabled={isPending}
              value={addFormData.name}
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
              value={addFormData.bio}
              onChange={handleInputChange}
              dir="rtl"
              multiline
              rows={3}
              sx={{ backgroundColor: "#fff" }}
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
              value={addFormData.skills}
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
              value={addFormData.email}
              onChange={handleInputChange}
              dir="ltr"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="file"
              name="image"
              disabled={isPending}
              onChange={handleImageChange}
              dir="ltr"
              required
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
          حفظ
        </LoadingButton>
      </Box>
    </div>
  );
}
