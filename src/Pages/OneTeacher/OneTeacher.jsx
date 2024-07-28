import style from "./OneTeacher.module.scss";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
// import ImageList from "@mui/material/ImageList";
// import ImageListItem from "@mui/material/ImageListItem";
// Cookies
import { useCookies } from "react-cookie";
// Api
import useGetTeacherByIdApi from "../../API/useGetTeacherByIdApi";

export default function OneTeacher() {
  // Cookie
  const [cookies] = useCookies(["token"]);

  const imgUrl = process.env.REACT_APP_IMAGE_URL;

  let { id } = useParams();

  const { data: teacher, fetchStatus, refetch } = useGetTeacherByIdApi({ id });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      {!cookies.token && <h3>يرجى تسجيل الدخول لعرض النتائج</h3>}

      {teacher && (
        <>
          {/* <!-- header start --> */}
          <div id="header" className={`${style.section} ${style.header}`}>
            {teacher?.teacher?.image && (
              <div>
                <img
                  src={`${imgUrl}${teacher.teacher.image.replace(
                    "/storage/images",
                    ""
                  )}`}
                  alt={teacher.teacher.name}
                  className={style.img_circle}
                />
              </div>
            )}
            <p>{teacher?.teacher?.name}</p>
          </div>

          {/* <!-- About Me section start --> */}
          <div className={style.section}>
            <h1>
              <span>نبذة شخصية</span>
            </h1>
            <p style={{ whiteSpace: "pre-wrap" }}>{teacher?.teacher?.bio}</p>
          </div>

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
              {teacher?.teacher?.skills?.split("-").map((skill, index) => (
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

          {/* <!-- Images album --> */}
          {teacher?.albums.length > 0 && (
            <div className={style.section}>
              <h1>
                <span>البوم الصور</span>
              </h1>

              <div className={style.img_container}>
                {teacher?.albums?.map(({ id, image }) => (
                  <div className={style.img_box} key={id}>
                    <img src={image} alt={id} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* <!-- Contacts section start --> */}

          {teacher?.teacher?.email && (
            <div className={style.section} style={{ marginBottom: "8px" }}>
              <h1>
                <span>تواصل</span>
              </h1>

              <div className={style.contact}>
                <a dir="ltr" href={`mailto:${teacher?.teacher?.email}`}>
                  {teacher?.teacher?.email}
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
