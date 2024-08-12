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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// Toastify
import { toast } from "react-toastify";
// API
import useGetDoxDataApi from "../../../API/useGetDoxDataApi";
import { useEditDoxApi } from "../../../API/useEditDoxApi";
// html2pdf
import html2pdf from "html2pdf.js";

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
      setTitle(dox.title);
      setBio(dox.bio);
      setValue(dox.content);
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

  // Title & Bio
  const [title, setTitle] = useState(createdDoxData?.title || "");
  const [bio, setBio] = useState(createdDoxData?.bio || "");
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
      bio: bio,
      content: value,
    };

    mutate(data);
  };

  const handleSaveAsPDF = () => {
    handleClose();
    const element = quillRef.current.getEditor().root; // Get the editor's root element
    const opt = {
      margin: 1,
      filename: "document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };

    // Use html2pdf to convert the content to PDF
    html2pdf()
      .from(element)
      .set(opt)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();

        // Loop through each page and add page numbers
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.text(
            `Page ${i} of ${totalPages}`,
            pdf.internal.pageSize.getWidth() - 50,
            pdf.internal.pageSize.getHeight() - 10,
            { align: "right" }
          );
        }

        // Save the PDF
        pdf.save("document.pdf");
      });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = () => {
    handleClose(); // Close the menu

    // Get the plain text content from the ReactQuill editor
    const content = quillRef.current.getEditor().getText();

    // Use the Clipboard API to copy the content
    navigator.clipboard
      .writeText(content)
      .then(() => {
        toast.success("Content copied to clipboard!"); // Show success message
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy content."); // Show error message
      });
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

          <Grid item xs={12} sm={4} md={3} sx={{ display: "flex" }}>
            <LoadingButton
              type="submit"
              variant="contained"
              disableRipple
              loading={isPending}
              sx={{ transition: "0.1s", width: "100%" }}
            >
              تعديل
            </LoadingButton>

            <div dir="rtl">
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <MoreVertIcon />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem dir="rtl" onClick={handleSaveAsPDF}>
                  حفظ كـ pdf
                </MenuItem>
                <MenuItem dir="rtl" onClick={handleCopy}>
                  نسخ المستند
                </MenuItem>
              </Menu>
            </div>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="الوصف"
            type="text"
            name="bio"
            required
            disabled={isPending}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            dir="rtl"
            multiline
            rows={3}
            sx={{ marginTop: "16px" }}
          />
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
