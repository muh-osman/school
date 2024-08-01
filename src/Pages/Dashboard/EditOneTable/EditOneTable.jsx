import style from "./EditOneTable.module.scss";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
// API
import useGetTableDataApi from "../../../API/useGetTableDataApi";
import { useEditTableApi } from "../../../API/useEditTableApi";

export default function EditOneTable() {
  let { id } = useParams();
  const editFormRef = useRef();

  const { data: table, fetchStatus } = useGetTableDataApi(id);
  const { mutate, data, isPending, isSuccess } = useEditTableApi();

  // console.log(table?.private_link);

  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    private_link: "",
  });

  useEffect(() => {
    if (table) {
      setEditFormData((prevData) => ({
        ...prevData,
        name: table.name || "",
        description: table.description || "",
        private_link: table.private_link || "",
      }));
    }
  }, [table]);

  const [timer, setTimer] = useState(null);
  const handleInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });

    // Clear the previous timer
    if (timer) {
      clearTimeout(timer);
    }

    // Set a new timer to delay the fetch by 1 second
    const newTimer = setTimeout(() => {
      if (e.target.value !== "") {
        const formData = new FormData(editFormRef.current);

        const data = {
          id,
          formData,
        };

        mutate(data);
      }
    }, 2000); // 1000 milliseconds = 1 second

    setTimer(newTimer);
  };

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" ||
        (isPending && (
          <div className={style.progressContainer}>
            <LinearProgress />
          </div>
        ))}

      <Box
        ref={editFormRef}
        component="form"
        noValidate
        // onSubmit={handleSubmit}
        sx={{ m: "auto", mt: 0, mr: 4, ml: 4 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="name"
              required
              disabled={isPending}
              value={editFormData.name}
              onChange={handleInputChange}
              variant="standard"
              InputProps={{
                style: { fontWeight: "800", fontSize: "24px" },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="text"
              name="description"
              required
              disabled={isPending}
              value={editFormData.description}
              onChange={handleInputChange}
              dir="rtl"
              multiline
              rows={1}
              variant="standard"
            />
          </Grid>
        </Grid>
      </Box>

      {/* E.g. https://docs.google.com/spreadsheets/d/${table?.private_link}/edit?usp=sharing */}
      {table && (
        <iframe
          style={{ width: "100%", height: "calc(100vh - 197px)" }}
          src={`https://docs.google.com/spreadsheets/d/${table?.private_link}/edit?usp=sharing`}
        ></iframe>
      )}
    </div>
  );
}
