import style from "./Dashboard.module.scss";
// React router
import { Link } from "react-router-dom";
// React
import { useEffect, useState } from "react";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
// API
import useGetAllTeachersApi from "../../API/useGetAllTeachersApi";
import { useSearchTeacherByNameApi } from "../../API/useSearchTeacherByNameApi";
// Toastify
import { toast } from "react-toastify";

export default function Dashboard() {
  // useEffect(() => {
  //   if (isError) {
  //     console.error(error);
  //     const errorMessage =
  //       error?.response?.data?.message || error?.message || "An error occurred";
  //     // Toastify
  //     toast.error(errorMessage);
  //   }
  // }, [error]);

  const imgUrl = process.env.REACT_APP_IMAGE_URL;
  const { data: teachers, fetchStatus } = useGetAllTeachersApi();

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [timer, setTimer] = useState(null);

  const {
    mutate,
    data: searchResultData,
    isPending,
  } = useSearchTeacherByNameApi();

  const handleInputChange = (e) => {
    setSearchQuery("");
    setSearchQuery(e.target.value);

    // Clear the previous timer
    if (timer) {
      clearTimeout(timer);
    }

    // Set a new timer to delay the fetch by 1 second
    const newTimer = setTimeout(() => {
      if (e.target.value !== "") {
        mutate(e.target.value);
      }
    }, 500); // 1000 milliseconds = 1 second

    setTimer(newTimer);
  };

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      {/* Search */}
      <div className={style.search_container}>
        <div className={style.search_box}>
          <div>
            <TextField
              sx={{ backgroundColor: "#fff" }}
              dir="rtl"
              fullWidth
              id="search-bar"
              className="text"
              onInput={handleInputChange}
              type="text"
              variant="outlined"
              placeholder="بحث"
              InputProps={{
                autoComplete: "off",
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => searchQuery && mutate(searchQuery)}
                    >
                      {isPending ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <SearchIcon size={24} style={{ fill: "#757575" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className={style.search_result_box} dir="rtl">
            {searchQuery &&
              searchResultData?.map(({ id, name }) => (
                <Link to={`teacher/${id}`} key={id}>
                  {name}
                </Link>
              ))}

            {searchResultData?.length === 0 && searchQuery && (
              <div>لا يوجد نتائج</div>
            )}
          </div>
        </div>
      </div>

      <Stack
        sx={{ pt: 0, pb: 4, maxWidth: "617px", margin: "auto" }}
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

      {/* {teachers === undefined && <h3>جاري التحميل...</h3>} */}
      {teachers?.length === 0 && <h3>لا يوجد بيانات لعرضها</h3>}

      <div className={style.card_container}>
        {teachers !== undefined &&
          teachers?.length !== 0 &&
          teachers.map((teacher) => (
            <Card sx={{ width: 253 }} key={teacher.id}>
              <CardActionArea
                component={Link}
                to={`teacher/${teacher.id}`}
                sx={{ height: "100%" }}
              >
                <CardMedia
                  component="img"
                  height="265"
                  image={`${imgUrl}${teacher.image.replace(
                    "/storage/images",
                    ""
                  )}`}
                  alt={teacher.name}
                />

                <CardContent>
                  <Typography variant="h5" component="div">
                    {teacher.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
      </div>
    </div>
  );
}
