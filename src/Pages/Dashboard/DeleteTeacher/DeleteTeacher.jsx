import style from "./DeleteTeacher.module.scss";
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
import { useDeleteTeacherApi } from "../../../API/useDeleteTeacherApi";
// Toastify
import { toast } from "react-toastify";

export default function DeleteTeacher() {
  const deleteFormRef = useRef();
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const { data: teachers, fetchStatus } = useGetAllTeachersApi();
  const { mutate, data, isPending, isSuccess } = useDeleteTeacherApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = deleteFormRef.current.reportValidity();
    if (!validate) return;
    // Submit data
    mutate(selectedTeacherId);
  };

  useEffect(() => {
    if (isSuccess) {
      // Reset the form after successful submission
      deleteFormRef.current.reset();
      setSelectedTeacherId("");
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
        ref={deleteFormRef}
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ m: "auto", mt: 3, maxWidth: "350px" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              select
              label="اختر"
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              disabled={isPending}
            >
              {teachers === undefined && (
                <MenuItem dir="rtl" value="">
                  <em>جاري التحميل...</em>
                </MenuItem>
              )}

              {teachers?.length === 0 && (
                <MenuItem dir="rtl" value="">
                  <em>لا يوجد بيانات لحذفها</em>
                </MenuItem>
              )}

              {teachers !== undefined &&
                teachers?.length !== 0 &&
                teachers.map((teacher) => (
                  <MenuItem dir="rtl" key={teacher.id} value={teacher.id}>
                    {teacher.name}
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
          حذف
        </LoadingButton>
      </Box>
    </div>
  );
}
