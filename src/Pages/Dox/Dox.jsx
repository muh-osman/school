import style from "./Dox.module.scss";
//
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Copyright from "../../Components/Copyright";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
// Sheet Logo
// import doxLogo from "../../Assets/Images/docs-logo.png";
// Cookies
import { useCookies } from "react-cookie";
// Api
import useGetAllDoxesTitleApi from "../../API/useGetAllDoxesTitleApi";
import { useSearchDoxByNameApi } from "../../API/useSearchDoxByNameApi";

export default function Dox() {
  // Cookie
  const [cookies] = useCookies(["token"]);

  const { data: doxesTitle, fetchStatus } = useGetAllDoxesTitleApi();

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [timer, setTimer] = useState(null);

  const { mutate, data: searchResultData, isPending } = useSearchDoxByNameApi();

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
      {!cookies.token ? (
        <h3 style={{ textAlign: "center" }}>يرجى تسجيل الدخول لعرض النتائج</h3>
      ) : (
        <>
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
                  searchResultData?.map(({ id, title }) => (
                    <Link to={`/dox/${id}`} key={id}>
                      {title}
                    </Link>
                  ))}

                {searchResultData?.length === 0 && searchQuery && (
                  <div>لا يوجد نتائج</div>
                )}
              </div>
            </div>
          </div>

          {/* {doxesTitle === undefined && <h3>جاري التحميل...</h3>} */}
          {doxesTitle?.length === 0 && (
            <h3 style={{ textAlign: "center" }}>لا يوجد بيانات لعرضها</h3>
          )}

          <div className={style.card_container}>
            {doxesTitle !== undefined &&
              doxesTitle?.length !== 0 &&
              doxesTitle.map((doxTitle) => (
                <Card sx={{ width: 300 }} key={doxTitle.id}>
                  <CardActionArea
                    component={Link}
                    to={`/dox/${doxTitle.id}`}
                    sx={{ height: "100%", padding: "16px" }}
                  >
                    {/* <CardMedia
                      component="img"
                      height="265"
                      image={doxLogo}
                      alt={doxTitle.title}
                      sx={{ objectFit: "contain" }}
                    /> */}

                    <CardContent>
                      <Typography variant="h5" component="div">
                        {doxTitle.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
          </div>
        </>
      )}

      <div
        style={{
          marginTop: "24px",
          width: "100%",
        }}
      >
        <Copyright />
      </div>
    </div>
  );
}
