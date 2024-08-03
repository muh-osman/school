import style from "./Tables.module.scss";
// React router
import { Link } from "react-router-dom";
// MUI
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TableChartIcon from "@mui/icons-material/TableChart";

export default function Tables() {
  return (
    <div className={style.container}>
      <Stack
        sx={{ pt: 4, pb: 4, maxWidth: "617px", margin: "auto" }}
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <TableChartIcon sx={{ fontSize: "55px", color: "#757575" }} />
      </Stack>

      <Stack
        sx={{ pt: 4, pb: 4, maxWidth: "617px", margin: "auto" }}
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Link to={"/dashboard/add-table"} style={{ flex: 1 }}>
          <Button sx={{ width: "100%" }} size="large" variant="outlined">
            اضافة
          </Button>
        </Link>

        <Link to={"/dashboard/edit-table"} style={{ flex: 1 }}>
          <Button
            sx={{ width: "100%" }}
            size="large"
            color="secondary"
            variant="outlined"
          >
            تعديل
          </Button>
        </Link>

        <Link to={"/dashboard/delete-table"} style={{ flex: 1 }}>
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
