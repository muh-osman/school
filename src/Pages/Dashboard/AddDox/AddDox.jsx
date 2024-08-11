import style from "./AddDox.module.scss";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import ReactQuill, { Quill } from 'react-quill';
import imageResize from 'quill-image-resize-module-react';
import "quill/dist/quill.snow.css";

import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useAddDoxApi } from "../../../API/useAddDoxApi";

Quill.register('modules/imageResize', imageResize);

// Custom keyboard handler
const Keyboard = Quill.import("modules/keyboard");
class CustomKeyboard extends Keyboard {
  constructor(quill, options) {
    super(quill, options);
    this.quill = quill;

    // Add custom handler for Enter key
    this.addBinding({ key: 13 }, this.handleEnter.bind(this));
  }

  handleEnter(range, context) {
    const currentFormat = this.quill.getFormat(range.index);
    this.quill.insertText(range.index, "\n", "user");
    if (currentFormat.header) {
      this.quill.format("header", currentFormat.header);
    }
    this.quill.setSelection(range.index + 1);
    return false; // Prevent default behavior
  }
}

export default function AddDox() {
  const [value, setValue] = useState("");
  const quillRef = useRef(null); // Create a ref for ReactQuill

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      ["link", "image"],
      ["clean"],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
    ],
    keyboard: {
      bindings: CustomKeyboard, // Use the custom keyboard module
    },
    imageResize: {
      // Optional: You can customize the image resize options here
      modules: ["Resize", "DisplaySize"], // Enable resize and display size options
    },
  };

  const [title, setTitle] = useState("");
  const { mutate, data: createdDoxData, isPending, isSuccess } = useAddDoxApi();
  const [cookies, setCookie] = useCookies(["userId"]);
  const userId = cookies.userId;

  const formRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
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
              sx={{ mr: 4, transition: "0.1s", width: "100%" }}
            >
              حفظ
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>

      <ReactQuill
        ref={quillRef} // Assign the ref to ReactQuill
        value={value}
        onChange={setValue}
        modules={modules}
        theme="snow"
        readOnly={isPending}
      />
    </div>
  );
}
