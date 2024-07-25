import style from "./EditTable.module.scss";
import { useNavigate } from "react-router-dom";
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
import useGetAllTablesApi from "../../../API/useGetAllTablesApi";
// Toastify
import { toast } from "react-toastify";

export default function EditTable() {
  const editFormRef = useRef();
  const [selectedTableId, setSelectedTableId] = useState("");

  const { data: tables, fetchStatus } = useGetAllTablesApi();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = editFormRef.current.reportValidity();
    if (!validate) return;

    // Submit
    navigate(`/dashboard/edit-table/${selectedTableId}`);
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
              label="اختر الجدول المراد تعديله"
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
            >
              {tables === undefined && (
                <MenuItem dir="rtl" value="">
                  <em>جاري التحميل...</em>
                </MenuItem>
              )}

              {tables?.length === 0 && (
                <MenuItem dir="rtl" value="">
                  <em>لا يوجد بيانات لتعديلها</em>
                </MenuItem>
              )}

              {tables !== undefined &&
                tables?.length !== 0 &&
                tables.map((table) => (
                  <MenuItem
                    sx={{ fontFamily: '"Cairo", sans-serif !important' }}
                    dir="rtl"
                    key={table.id}
                    value={table.id}
                  >
                    {table.name}
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
