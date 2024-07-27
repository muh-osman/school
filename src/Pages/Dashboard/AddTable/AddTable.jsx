import style from "./AddTable.module.scss";
// React
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Dialog from "@mui/material/Dialog";
// Cookies
import { useCookies } from "react-cookie";
// Api
import { useAddTebleApi } from "../../../API/useAddTebleApi";
// Toastify
import { toast } from "react-toastify";
// Image
import privateGif from "../../../Assets/Gif/private.gif";
import publicGif from "../../../Assets/Gif/public.gif";

export default function AddTable() {
  const [showPrivateGif, setShowPrivateGif] = useState(false);
  const [showPublicGif, setShowPublicGif] = useState(false);

  // Cookie
  const [cookies, setCookie] = useCookies(["userId"]);

  const addFormRef = useRef();
  const [addFormData, setAddFormData] = useState({
    name: "",
    description: "",
    private_link: "",
    public_link: "",
  });

  const { mutate, data, isPending, isSuccess } = useAddTebleApi();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      // Reset the form after successful submission
      addFormRef.current.reset();
      setAddFormData({
        name: "",
        description: "",
        private_link: "",
        public_link: "",
      });

      toast.success("Created successfully");
      navigate(`/dashboard/edit-table/${data.id}`, { replace: true });
    }
  }, [isSuccess]);

  const handleInputChange = (e) => {
    setAddFormData({
      ...addFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = addFormRef.current.reportValidity();
    if (!validate) return;
    // Submit data

    const formData = new FormData();
    // Append all form data to the FormData object
    Object.keys(addFormData).forEach((key) => {
      formData.append(key, addFormData[key]);
    });

    // Append userId to the FormData object
    const userId = cookies.userId;
    formData.append("user_id", userId);

    mutate(formData);
  };

  return (
    <div className={style.container}>
      <Box
        ref={addFormRef}
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ m: "auto", mt: 3, maxWidth: "700px" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="اسم الجدول"
              type="text"
              name="name"
              required
              disabled={isPending}
              value={addFormData.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="الوصف"
              type="text"
              name="description"
              required
              disabled={isPending}
              value={addFormData.description}
              onChange={handleInputChange}
              dir="rtl"
              multiline
              rows={3}
              sx={{ backgroundColor: "#fff" }}
            />
          </Grid>
          <Grid item xs={12}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.google.com/spreadsheets/create?usp=sheets_home&ths=true"
            >
              انشاء جوجل شيت
            </a>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="رابط المدير"
              type="text"
              name="private_link"
              required
              disabled={isPending}
              value={addFormData.private_link}
              onChange={handleInputChange}
              dir="rtl"
              helperText="مشاركة > أي شخص لديه الرابط > محرر > نسخ الرابط"
              InputProps={{
                sx: { backgroundColor: "#fff" },
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => setShowPrivateGif((prev) => !prev)}
                      edge="start"
                    >
                      {<HelpOutlineIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              value={addFormData.public_link}
              onChange={handleInputChange}
              helperText="ملف > مشاركة > النشر على الويب > تضمين > نشر > نسخ الرابط"
              InputProps={{
                sx: { backgroundColor: "#fff" },
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => setShowPublicGif((prev) => !prev)}
                      edge="start"
                    >
                      {<HelpOutlineIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          disableRipple
          loading={isPending}
          sx={{ mt: 3, mb: 2, transition: "0.1s" }}
        >
          حفظ
        </LoadingButton>

        <Dialog open={showPrivateGif} onClose={() => setShowPrivateGif(false)}>
          <img src={privateGif} alt="Private GIF" />
        </Dialog>

        <Dialog open={showPublicGif} onClose={() => setShowPublicGif(false)}>
          <img src={publicGif} alt="Public GIF" />
        </Dialog>
      </Box>
    </div>
  );
}
