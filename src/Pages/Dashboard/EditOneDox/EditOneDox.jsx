import style from "./EditOneDox.module.scss";
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
// react-quill
import ReactQuill, { Quill } from "react-quill";
import imageResize from "quill-image-resize-module-react";
import "quill/dist/quill.snow.css";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
// Toastify
import { toast } from "react-toastify";
// API
import useGetDoxDataApi from "../../../API/useGetDoxDataApi";
import { useEditDoxApi } from "../../../API/useEditDoxApi";

Quill.register("modules/imageResize", imageResize);

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

export default function EditOneDox() {
  const quillRef = useRef(null); // Create a ref for ReactQuill

  const location = useLocation();
  const { createdDoxData } = location.state || {}; // Use optional chaining to avoid errors if state is undefined
  // console.log(createdDoxData);

  let { id } = useParams();

  const { data: dox, fetchStatus } = useGetDoxDataApi(id);

  useEffect(() => {
    if (dox) {
      setValue(dox.content);
      setTitle(dox.title);
    }
  }, [dox]);

  // Text editor value
  const [value, setValue] = useState(createdDoxData?.content || "");

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
    keyboard: {
      bindings: CustomKeyboard, // Use the custom keyboard module
    },
    imageResize: {
      // Optional: You can customize the image resize options here
      modules: ["Resize", "DisplaySize"], // Enable resize and display size options
    },
  };

  // Title
  const [title, setTitle] = useState(createdDoxData?.title || "");
  const { mutate, data: editedDoxData, isPending, isSuccess } = useEditDoxApi();

  const formRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = formRef.current.reportValidity();
    if (!validate) return;

    if (
      value === "" ||
      value === "<p><br></p>" ||
      value === '<p class="ql-align-right ql-direction-rtl"><br></p>'
    ) {
      toast.warn("Please fill out all fields");
      return;
    }

    const data = {
      id: id,
      title: title,
      content: value,
    };

    mutate(data);
  };

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
              تعديل
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

      {/* <h2>Output</h2> */}
      {/* <div dangerouslySetInnerHTML={{ __html: editorHtml }} /> */}
    </div>
  );
}
