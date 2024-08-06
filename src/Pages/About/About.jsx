import style from "./About.module.scss";
import { useState } from "react";
// react-quill
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";

export default function About() {
  const [value, setValue] = useState('');


  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }], // Header options
      ["bold", "italic", "underline", "strike"], // Text formatting
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      [{ script: "sub" }, { script: "super" }], // Subscript and superscript
      [{ indent: "-1" }, { indent: "+1" }], // Indent
      [{ direction: "rtl" }], // Text direction
      ["link", "image",], // Links, images, and videos
      ["clean"], // Remove formatting button
      [{ color: [] }, { background: [] }], // Text color and background color
      [{ font: [] }], // Font options
      [{ align: [] }], // Text alignment
    ],
  };

  return (
    <div className={style.container} dir="ltr">
      <ReactQuill
        value={value}
        onChange={setValue}
        modules={modules}
        theme="snow"
      />

      {/* <h2>Output</h2> */}
      {/* <div dangerouslySetInnerHTML={{ __html: editorHtml }} /> */}
    </div>
  );
}
