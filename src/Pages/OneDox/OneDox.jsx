import style from "./OneDox.module.scss";
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
// react-quill
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
// Toastify
import { toast } from "react-toastify";
// API
import useGetDoxDataApi from "../../API/useGetDoxDataApi";

export default function OneDox() {
  let { id } = useParams();
  const { data: dox, fetchStatus } = useGetDoxDataApi(id);

  useEffect(() => {
    if (dox) {
      setValue(dox.content);
      setTitle(dox.title);
    }
  }, [dox]);

  // Text editor value
  const [value, setValue] = useState("");
  // Title
  const [title, setTitle] = useState("");

  const modules = {
    toolbar: [],
  };

  return (
    <div className={style.container} dir="ltr">
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <Box
        dir="rtl"
        component="form"
        noValidate
        sx={{ m: "auto", mt: 0, mb: 3 }}
      >
        <Grid container>
          <Grid item>
            <TextField
              type="text"
              name="title"
              placeholder="العنوان"
              required
              fullWidth
              value={title}
              variant="standard"
              InputProps={{
                style: {
                  fontWeight: "800",
                  fontSize: "24px",
                  backgroundColor: "#f9fbfd",
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <ReactQuill
        value={value}
        modules={modules}
        theme="snow"
        readOnly={true}
      />

      {/* <h2>Output</h2> */}
      {/* <div dir="auto" dangerouslySetInnerHTML={{ __html: value }} /> */}
    </div>
  );
}
