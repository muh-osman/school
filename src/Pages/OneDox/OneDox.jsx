import style from "./OneDox.module.scss";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
// react-quill
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// Toastify
import { toast } from "react-toastify";
// API
import useGetDoxDataApi from "../../API/useGetDoxDataApi";
// html2pdf
import html2pdf from "html2pdf.js";

export default function OneDox() {
  const quillRef = useRef(null); // Create a ref for ReactQuill

  let { id } = useParams();
  const { data: dox, fetchStatus, error } = useGetDoxDataApi(id);

  useEffect(() => {
    if (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [error]);

  useEffect(() => {
    if (dox) {
      setTitle(dox.title);
      setBio(dox.bio);
      setValue(dox.content);
    }
  }, [dox]);

  // Text editor value
  const [value, setValue] = useState("");
  // Title & Bio
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");

  const modules = {
    toolbar: [],
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
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <h1
              style={{
                fontWeight: "800",
                fontSize: "24px",
                backgroundColor: "#f9fbfd",
                paddingBottom: "12px",
                borderBottom: "1px solid #000",
              }}
            >
              {title}
            </h1>

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

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="الوصف"
              type="text"
              name="bio"
              required
              disabled={false}
              value={bio}
              dir="rtl"
              multiline
              rows={3}
              sx={{ marginTop: "16px" }}
            />
          </Grid>
        </Grid>
      </Box>

      <ReactQuill
        ref={quillRef} // Assign the ref to ReactQuill
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
