import style from "./AddDox.module.scss";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// react-quill
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
// Toastify
import { toast } from "react-toastify";
// Cookies
import { useCookies } from "react-cookie";
// API
import { useAddDoxApi } from "../../../API/useAddDoxApi";

export default function AddDox() {
  const [value, setValue] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }], // Header options
      ["bold", "italic", "underline", "strike"], // Text formatting
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      [{ script: "sub" }, { script: "super" }], // Subscript and superscript
      [{ indent: "-1" }, { indent: "+1" }], // Indent
      [{ direction: "rtl" }], // Text direction
      ["link", "image"], // Links, images, and videos
      ["clean"], // Remove formatting button
      [{ color: [] }, { background: [] }], // Text color and background color
      [{ font: [] }], // Font options
      [{ align: [] }], // Text alignment
    ],
  };

  // Title
  const [title, setTitle] = useState("");
  const { mutate, data: createdDoxData, isPending, isSuccess } = useAddDoxApi();
  // Cookie
  const [cookies, setCookie] = useCookies(["userId"]);
  const userId = cookies.userId;

  const formRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = formRef.current.reportValidity();
    if (!validate) return;

    if (value === "") {
      toast.warn("Please fill out all fields");
      return;
    }

    const data = {
      title: title,
      content: value,
      user_id: userId,
    };

    mutate(data);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess === true) {
      toast.success("Saved");

      // Pass createdDoxData as state
      navigate(`/dashboard/edit-dox/${createdDoxData.id}`, {
        replace: true,
        state: { createdDoxData },
      });
    }
  }, [isSuccess]);

  return (
    <div className={style.container} dir="ltr">
      {isPending && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      <Box
        dir="rtl"
        ref={formRef}
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ m: "auto", mt: 0, mb: 3 }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Grid item xs={12} sm={8} md={9}>
            <TextField
              type="text"
              name="title"
              placeholder="العنوان"
              required
              fullWidth
              disabled={isPending}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
          <Grid item xs={12} sm={4} md={3}>
            <LoadingButton
              type="submit"
              variant="contained"
              disableRipple
              loading={isPending}
              sx={{ mr: 4, transition: "0.1s", width: "100%" }} // Add margin-left for spacing
            >
              حفظ
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>

      <ReactQuill
        value={value}
        onChange={setValue}
        modules={modules}
        theme="snow"
        readOnly={isPending}
      />

      {/* <h2>Output</h2> */}
      {/* <div dangerouslySetInnerHTML={{ __html: editorHtml }} /> */}
    </div>
  );
}
