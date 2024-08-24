import style from "./EditDox.module.scss";
import { useNavigate } from "react-router-dom";
// React
import { useRef, useState } from "react";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from "@mui/lab/LoadingButton";
import LinearProgress from "@mui/material/LinearProgress";
// Api
import useGetAllDoxesTitleApi from "../../../API/useGetAllDoxesTitleApi";


export default function EditDox() {
  const editFormRef = useRef();
  const [selectedDoxId, setSelectedDoxId] = useState("");

  const { data: doxes, fetchStatus } = useGetAllDoxesTitleApi();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = editFormRef.current.reportValidity();
    if (!validate) return;

    // Submit
    navigate(`/dashboard/edit-dox/${selectedDoxId}`);
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
              label="اختر المستند المراد تعديله"
              value={selectedDoxId}
              onChange={(e) => setSelectedDoxId(e.target.value)}
            >
              {doxes === undefined && (
                <MenuItem dir="rtl" value="">
                  <em>جاري التحميل...</em>
                </MenuItem>
              )}

              {doxes?.length === 0 && (
                <MenuItem dir="rtl" value="">
                  <em>لا يوجد بيانات لتعديلها</em>
                </MenuItem>
              )}

              {doxes !== undefined &&
                doxes?.length !== 0 &&
                doxes.map((dox) => (
                  <MenuItem
                    sx={{ fontFamily: '"Cairo", sans-serif !important' }}
                    dir="rtl"
                    key={dox.id}
                    value={dox.id}
                  >
                    {dox.title}
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
          sx={{ mt: 3, mb: 2, transition: "0.1s" }}
        >
          تعديل
        </LoadingButton>
      </Box>
    </div>
  );
}
