import style from "./DeleteTable.module.scss";
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
import { useDeleteTableApi } from "../../../API/useDeleteTableApi";
// Toastify
import { toast } from "react-toastify";

export default function DeleteTable() {
  const deleteFormRef = useRef();
  const [selectedTableId, setSelectedTableId] = useState("");

  const { data: tables, fetchStatus } = useGetAllTablesApi();
  const { mutate, data, isPending, isSuccess } = useDeleteTableApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = deleteFormRef.current.reportValidity();
    if (!validate) return;
    // Submit data
    mutate(selectedTableId);
  };

  useEffect(() => {
    if (isSuccess) {
      // Reset the form after successful submission
      deleteFormRef.current.reset();
      setSelectedTableId("");
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
              label="اختر جدول"
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
              disabled={isPending}
              sx={{ backgroundColor: "#fff" }}
            >
              {tables === undefined && (
                <MenuItem dir="rtl" value="">
                  <em>جاري التحميل...</em>
                </MenuItem>
              )}

              {tables?.length === 0 && (
                <MenuItem dir="rtl" value="">
                  <em>لا يوجد بيانات لحذفها</em>
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
          loading={isPending}
          sx={{ mt: 3, mb: 2, transition: "0.1s" }}
        >
          حذف
        </LoadingButton>
      </Box>
    </div>
  );
}
