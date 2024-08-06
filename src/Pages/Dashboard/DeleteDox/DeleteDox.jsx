import style from "./DeleteDox.module.scss";
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
import useGetAllDoxesTitleApi from "../../../API/useGetAllDoxesTitleApi";
import { useDeleteDoxApi } from "../../../API/useDeleteDoxApi";
// Toastify
import { toast } from "react-toastify";

export default function DeleteDox() {
  const deleteFormRef = useRef();
  const [selectedDoxId, setSelectedDoxId] = useState("");

  const { data: doxesTitle, fetchStatus } = useGetAllDoxesTitleApi();
  const { mutate, data, isPending, isSuccess } = useDeleteDoxApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = deleteFormRef.current.reportValidity();
    if (!validate) return;
    // Submit data
    mutate(selectedDoxId);
  };

  useEffect(() => {
    if (isSuccess) {
      // Reset the form after successful submission
      deleteFormRef.current.reset();
      setSelectedDoxId("");
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
        sx={{ m: "auto", mt: 3, maxWidth: "700px" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              select
              label="اختر"
              value={selectedDoxId}
              onChange={(e) => setSelectedDoxId(e.target.value)}
              disabled={isPending}
              sx={{ backgroundColor: "#fff" }}
            >
              {doxesTitle === undefined && (
                <MenuItem dir="rtl" value="">
                  <em>جاري التحميل...</em>
                </MenuItem>
              )}

              {doxesTitle?.length === 0 && (
                <MenuItem dir="rtl" value="">
                  <em>لا يوجد بيانات لحذفها</em>
                </MenuItem>
              )}

              {doxesTitle !== undefined &&
                doxesTitle?.length !== 0 &&
                doxesTitle.map((doxeTitle) => (
                  <MenuItem
                    sx={{ fontFamily: '"Cairo", sans-serif !important' }}
                    dir="rtl"
                    key={doxeTitle.id}
                    value={doxeTitle.id}
                  >
                    {doxeTitle.title}
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
