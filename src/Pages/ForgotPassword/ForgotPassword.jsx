// Mui
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LoadingButton from "@mui/lab/LoadingButton";
import Copyright from "../../Components/Copyright";
// API
import { useForgotPasswordApi } from "../../API/useForgotPasswordApi";

export default function ForgotPassword() {
  //
  const formRef = React.useRef();
  //
  const { mutate, isPending, isSuccess } = useForgotPasswordApi();

  const handleSubmit = (e) => {
    e.preventDefault();
    // required input
    const validate = formRef.current.reportValidity();
    if (!validate) return;
    // Submit data
    const data = new FormData(e.currentTarget);
    mutate(data);
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
          <VpnKeyIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          نسيت كلمة المرور
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
                id="email"
                label="البريد الالكتروني"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
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
            استمرار
          </LoadingButton>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
