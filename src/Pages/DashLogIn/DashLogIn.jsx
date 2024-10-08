import style from "../../Layout/layout.module.scss";

// React router
import { Link as RouterLink } from "react-router-dom";
// Mui
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Copyright from "../../Components/Copyright";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// API
import { useLoginApi } from "../../API/useLoginApi";
// Images
import dashBg from "../../Assets/Images/dashBg.webp";

export default function DashLogIn() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPin, setShowPin] = React.useState(false);

  const formRef = React.useRef();

  const { mutate, isPending } = useLoginApi();

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
    <Grid
      className={style.container}
      container
      component="main"
      sx={{ height: "100vh" }}
    >
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${dashBg})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
            justifyContent: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            الدخول كمدير
          </Typography>
          <Box
            ref={formRef}
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="البريد الالكتروني"
              name="email"
              autoComplete="email"
              autoFocus
              disabled={isPending}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="كلمة المرور"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              disabled={isPending}
              InputLabelProps={{
                shrink: true, // This keeps the label fixed
              }}
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

            <TextField
              margin="normal"
              required
              fullWidth
              name="pin"
              label="رمز الدخول"
              type={showPin ? "text" : "password"}
              disabled={isPending}
              InputLabelProps={{
                shrink: true, // This keeps the label fixed
              }}
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

            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              disableRipple
              loading={isPending}
              sx={{ mt: 3, mb: 2, transition: "0.1s" }}
            >
              تسجيل الدخول
            </LoadingButton>

            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/login" variant="body2">
                  الدخول كضيف
                </Link>
              </Grid>
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                >
                  نسيت كلمة المرور؟
                </Link>
              </Grid>
            </Grid>

            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
