import style from "./Dashboard.module.scss";
// React router
import { Link } from "react-router-dom";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default function Dashboard() {
  return (
    <div className={style.container}>
      <Stack
        sx={{ pt: 4, pb: 4, maxWidth: "617px", margin: "auto" }}
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Link to={"add-teacher"} style={{ flex: 1 }}>
          <Button sx={{ width: "100%" }} size="large" variant="outlined">
            اضافة
          </Button>
        </Link>

        <Link to={"edit-teacher"} style={{ flex: 1 }}>
          <Button
            sx={{ width: "100%" }}
            size="large"
            color="secondary"
            variant="outlined"
          >
            تعديل
          </Button>
        </Link>

        <Link to={"delete-teacher"} style={{ flex: 1 }}>
          <Button
            sx={{ width: "100%" }}
            size="large"
            color="error"
            variant="outlined"
          >
            حذف
          </Button>
        </Link>
      </Stack>
    </div>
  );
}
