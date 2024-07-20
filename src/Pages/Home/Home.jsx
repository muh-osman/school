import React, { useEffect, useRef } from "react";
import style from "./Home.module.scss";
import { Link } from "react-router-dom";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
// Api
import useGetAllTeachersApi from "../../API/useGetAllTeachersApi";

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

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      {teachers === undefined && <h3>جاري التحميل...</h3>}
      {teachers?.length === 0 && <h3>لا يوجد بيانات لعرضها</h3>}

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
