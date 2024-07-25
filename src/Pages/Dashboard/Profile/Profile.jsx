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
// Api
import useGetAllTeachersApi from "../../../API/useGetAllTeachersApi";
import { useEditTeacherApi } from "../../../API/useEditTeacherApi";
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
              label="اسم الملف المراد اضافة بريد الكتروني له"
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

          {selectedTeacherId && (
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
          حفظ / تعديل
        </LoadingButton>
      </Box>
    </div>
  );
}
