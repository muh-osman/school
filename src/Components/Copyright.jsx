import { Link as RouterLink } from "react-router-dom";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function Copyright(props) {
  return (
    <>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link
          color="inherit"
          component={RouterLink}
          to="/"
          onMouseOver={(e) => (e.target.style.color = "#7431fa")}
          onMouseOut={(e) => (e.target.style.color = "inherit")}
        >
          Noter
        </Link>{" "}
        {new Date().getFullYear()}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ marginTop: "0" }}
      >
        <Link
          sx={{ textDecoration: "none" }}
          color="inherit"
          component={RouterLink}
          to="/privacy-policy"
          onMouseOver={(e) => (e.target.style.color = "#7431fa")}
          onMouseOut={(e) => (e.target.style.color = "inherit")}
        >
          سياسة الخصوصية
        </Link>
      </Typography>
    </>
  );
}
