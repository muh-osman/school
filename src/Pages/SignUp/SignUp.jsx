import style from "../../Layout/layout.module.scss";

// React router
import { Link as RouterLink } from "react-router-dom";
// Mui
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LoadingButton from "@mui/lab/LoadingButton";
import Copyright from "../../Components/Copyright";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// API
import { useSignUpApi } from "../../API/useSignUpApi";

export default function SignUp() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPin, setShowPin] = React.useState(false);
  const formRef = React.useRef();

  const { mutate, isPending } = useSignUpApi();

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
      className={style.container}
      component="main"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <Avatar
          sx={{
            margin: "auto",
            marginBottom: "8px",
            bgcolor: "secondary.main",
          }}
        >
          <ExitToAppIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          إنشاء حساب
        </Typography>
        <Box
          ref={formRef}
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                label="البريد الالكتروني"
                name="email"
                autoComplete="email"
                autoFocus
                required
                disabled={isPending}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                label="كلمة المرور"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                required
                disabled={isPending}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="pin"
                label="رمز دخول لوحة التحكم"
                type={showPin ? "text" : "password"}
                disabled={isPending}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPin((prev) => !prev)}
                        edge="end"
                      >
                        {showPin ? <VisibilityOff /> : <Visibility />}
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
            إنشاء حساب
          </LoadingButton>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                هل لديك حساب؟ تسجيل الدخول
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
