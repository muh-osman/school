// React router
import { useLocation } from "react-router-dom";
// Mui
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PasswordIcon from "@mui/icons-material/Password";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LoadingButton from "@mui/lab/LoadingButton";
import Copyright from "../../Components/Copyright";
// Toastify
import { toast } from "react-toastify";
// API
import { useResetPasswordApi } from "../../API/useResetPasswordApi";

export default function ResetPassword() {
  //
  const formRef = React.useRef();

  // Parse the query parameters from the URL
  //   http://localhost:3000/reset-password?token=...&email=...
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const { mutate, isPending, isSuccess } = useResetPasswordApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = formRef.current.reportValidity();
    if (!validate) return;

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const password_confirmation = formData.get("password_confirmation");

    if (password !== password_confirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    mutate({
      token,
      email,
      password,
      password_confirmation,
    });
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Avatar
          sx={{
            margin: "auto",
            marginBottom: "8px",
            bgcolor: "secondary.main",
          }}
        >
          <PasswordIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          إعادة تعيين كلمة المرور
        </Typography>
        <Box
          ref={formRef}
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="password"
                label="كلمة المرور الجديدة"
                type="password"
                name="password"
                autoComplete="new-password"
                autoFocus
                disabled={isPending || isSuccess}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="confirm-password"
                label="تأكيد كلمة المرور الجديدة"
                type="password"
                name="password_confirmation"
                autoComplete="password"
                disabled={isPending || isSuccess}
              />
            </Grid>
          </Grid>

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            disableRipple
            loading={isPending}
            disabled={isSuccess}
            sx={{ mt: 3, mb: 2, transition: "0.1s" }}
          >
            إعادة تعيين
          </LoadingButton>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
