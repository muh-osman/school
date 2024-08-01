import style from "./OneTable.module.scss";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
// API
import useGetTableDataApi from "../../API/useGetTableDataApi";

export default function OneTable() {
  let { id } = useParams();
  const editFormRef = useRef();

  const { data: table, fetchStatus } = useGetTableDataApi(id);

  // console.log(table?.private_link);
  // console.log(table?.public_link);

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

  // Show iframe
  const [showIframe, setShowIframe] = useState(false);
  useEffect(() => {
    if (table && fetchStatus === "idle") {
      setShowIframe(true);
    }
  }, [table]);

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
        sx={{ m: "auto", mt: 0, mr: 0, ml: 0 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="name"
              required
              value={editFormData.name}
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
              value={editFormData.description}
              dir="rtl"
              multiline
              rows={1}
              variant="standard"
            />
          </Grid>
        </Grid>
      </Box>

      {table && showIframe && (
        <iframe
          style={{
            width: "100%",
            height: "calc(100vh - 94px)",
            marginTop: "16px",
          }}
          src={`https://docs.google.com/spreadsheets/d/${editFormData.private_link}/preview`}
        ></iframe>
      )}
    </div>
  );
}
