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

  // handle iframe url
  const [src, setSrc] = useState("");
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    if (table) {
      if (table?.public_link?.includes("amp;")) {
        // Extract the src URL from the iframe string
        let srcUrl = table?.public_link?.match(/src="([^"]+)"/)[1];

        // Remove 'amp;' from the src URL
        srcUrl = srcUrl?.replace(/amp;/g, "");

        // Replace 'headers=false' with 'headers=true' in the src URL
        srcUrl = srcUrl?.replace("headers=false", "headers=true");

        setSrc(srcUrl);
        setShowIframe(true);
      }
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
        sx={{ m: "auto", mt: 3, mr: 4, ml: 4 }}
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
              rows={3}
              variant="standard"
            />
          </Grid>
        </Grid>
      </Box>

      {table && showIframe && (
        <iframe
          style={{ width: "100%", height: "calc(100vh - 94px)" }}
          src={src}
        ></iframe>
      )}
    </div>
  );
}
