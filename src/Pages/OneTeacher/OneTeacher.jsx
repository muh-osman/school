import style from "./OneTeacher.module.scss";
import { useParams } from "react-router-dom";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
// Api
import useGetTeachersByIdApi from "../../API/useGetTeachersByIdApi";

export default function OneTeacher() {
  const imgUrl = process.env.REACT_APP_IMAGE_URL;

  let { id } = useParams();

  const { data: teacher, fetchStatus } = useGetTeachersByIdApi({ id });

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      {/* <!-- header start --> */}
      <div id="header" className={`${style.section} ${style.header}`}>
        {teacher?.image && (
          <div>
            <img
              src={`${imgUrl}${teacher.image.replace("/storage/images", "")}`}
              alt={teacher.name}
              className={style.img_circle}
            />
          </div>
        )}
        <p>{teacher?.name}</p>
      </div>
      {/* <!-- header end --> */}

      {/* <!-- About Me section start --> */}
      <div className={style.section}>
        <h1>
          <span>نبذة شخصية</span>
        </h1>
        <p style={{ whiteSpace: "pre-wrap" }}>{teacher?.bio}</p>
      </div>
      {/* <!-- About Me section end --> */}

      {/* <!-- My Skills section start --> */}
      <div className={style.section}>
        <h1>
          <span>مهارات</span>
        </h1>

        <Stack
          className={style.stack}
          sx={{
            marginTop: "48px",
            marginBottom: "16px",
            flexWrap: "wrap",
            gap: "16px",
          }}
          direction="row"
          spacing={1}
          justifyContent="center"
        >
          {teacher?.skills?.split("-").map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              sx={{
                height: "40px",
                borderRadius: "160px",
                fontSize: "1rem",
                "& .MuiChip-label": {
                  padding: "0 16px",
                },
              }}
            />
          ))}
        </Stack>
      </div>
      {/* <!-- My Skills section end --> */}

      {/* <!-- Contacts section start --> */}
      <div className={style.section}>
        <h1>
          <span>تواصل</span>
        </h1>

        <div className={style.contact}>
          <a dir="ltr" href={`mailto:${teacher?.email}`}>
            {teacher?.email}
          </a>
        </div>
      </div>
      {/* <!-- Contacts section end --> */}
    </div>
  );
}
