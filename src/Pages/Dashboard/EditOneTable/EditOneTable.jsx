import style from "./EditOneTable.module.scss";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// API
import useGetTableDataApi from "../../../API/useGetTableDataApi";
import { useEditTableApi } from "../../../API/useEditTableApi";

export default function EditOneTable() {
  let { id } = useParams();
  const editFormRef = useRef();

  const [more, setMore] = useState(false);

  const { data: table, fetchStatus } = useGetTableDataApi(id);
  const { mutate, data, isPending, isSuccess } = useEditTableApi();

  // console.log(table?.private_link);
  // console.log(table?.public_link);

  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    private_link: "",
    public_link: "",
  });

  useEffect(() => {
    if (table) {
      setEditFormData((prevData) => ({
        ...prevData,
        name: table.name || "",
        description: table.description || "",
        private_link: table.private_link || "",
        public_link: table.public_link || "",
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

  //
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    if (table) {
      if (table?.public_link?.includes("spreadsheets")) {
        setShowIframe(true);
      }
    }
  }, [table]);

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
        sx={{ m: "auto", mt: 3, mr: 4, ml: 4 }}
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

            <IconButton
              aria-label="more"
              color="primary"
              onClick={() => setMore((prev) => !prev)}
              style={{
                transition: "0.2s",
                transform: more ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
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
              rows={3}
              variant="standard"
            />
          </Grid>

          {more && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="رابط المدير"
                  type="text"
                  name="private_link"
                  required
                  disabled={isPending}
                  value={editFormData.private_link}
                  onChange={handleInputChange}
                  variant="standard"
                  dir="ltr"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="رابط الضيف"
                  type="text"
                  name="public_link"
                  required
                  disabled={isPending}
                  value={editFormData.public_link}
                  onChange={handleInputChange}
                  variant="standard"
                  dir="ltr"
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      {table && showIframe && (
        <iframe
          style={{ width: "100%", height: "calc(100vh - 94px)" }}
          src={table?.private_link}
        ></iframe>
      )}
    </div>
  );
}
