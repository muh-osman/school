import React, { useEffect, useRef, useState } from "react";
import style from "./Home.module.scss";
import { Link } from "react-router-dom";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
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
// Api
import useGetAllTeachersApi from "../../API/useGetAllTeachersApi";
import { useSearchTeacherByNameApi } from "../../API/useSearchTeacherByNameApi";

export default function Home() {
  const imgUrl = process.env.REACT_APP_IMAGE_URL;
  const { data: teachers, fetchStatus } = useGetAllTeachersApi();
  const cardContainerRef = useRef(null);

  useEffect(() => {
    if (teachers && teachers.length > 0) {
      equalizeCardHeights();
    }
  }, [teachers]);

  const equalizeCardHeights = () => {
    if (cardContainerRef.current) {
      const cards = cardContainerRef.current.querySelectorAll(
        `.${style.card_link}`
      );
      let maxHeight = 0;

      // Reset heights
      cards.forEach((card) => {
        card.style.height = "auto";
      });

      // Find the tallest card
      cards.forEach((card) => {
        maxHeight = Math.max(maxHeight, card.offsetHeight);
      });

      // Set all cards to the height of the tallest card
      cards.forEach((card) => {
        card.style.height = `${maxHeight}px`;
      });
    }
  };

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

      {/* {teachers === undefined && <h3>جاري التحميل...</h3>} */}
      {teachers?.length === 0 && <h3>لا يوجد بيانات لعرضها</h3>}

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
                <Link to={`/teacher/${id}`} key={id}>
                  {name}
                </Link>
              ))}

            {searchResultData?.length === 0 && searchQuery && (
              <div>لا يوجد نتائج</div>
            )}
          </div>
        </div>
      </div>

      <div className={style.card_container} ref={cardContainerRef}>
        {teachers !== undefined &&
          teachers?.length !== 0 &&
          teachers.map((teacher) => (
            <Link
              to={`/teacher/${teacher.id}`}
              key={teacher.id}
              className={style.card_link}
            >
              <Card className={style.card_inner}>
                <CardActionArea className={style.card_action_area}>
                  <CardMedia
                    className={style.card_media}
                    component="img"
                    image={`${imgUrl}${teacher.image.replace(
                      "/storage/images",
                      ""
                    )}`}
                    alt={teacher.name}
                  />
                  <CardContent className={style.card_content}>
                    <Typography gutterBottom variant="h5" component="div">
                      {teacher.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      className={style.card_text}
                    >
                      {teacher.bio.length > 100
                        ? `${teacher.bio.substring(0, 125)}...`
                        : teacher.bio}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
