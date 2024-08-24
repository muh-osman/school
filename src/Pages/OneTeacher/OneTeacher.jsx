import style from "./OneTeacher.module.scss";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Copyright from "../../Components/Copyright";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
// Cookies
import { useCookies } from "react-cookie";
// Toastify
import { toast } from "react-toastify";
// Api
import useGetTeacherByIdApi from "../../API/useGetTeacherByIdApi";

export default function OneTeacher() {
  // Cookie
  const [cookies] = useCookies(["token"]);

  let { id } = useParams();

  const { data: teacher, fetchStatus, error } = useGetTeacherByIdApi({ id });

  useEffect(() => {
    if (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [error]);

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      {!cookies.token && (
        <h3 style={{ textAlign: "center" }}>يرجى تسجيل الدخول لعرض النتائج</h3>
      )}

      {teacher && (
        <>
          {/* <!-- header start --> */}
          <div id="header" className={`${style.section} ${style.header}`}>
            {teacher?.teacher?.image && (
              <div>
                <img
                  src={teacher?.teacher?.image}
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
                    <Link to={`/carousel/${teacher?.teacher?.id}/${id}`}>
                      <img src={image} alt={id} />
                    </Link>
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

          <div
            style={{
              marginTop: "24px",
              width: "100%",
            }}
          >
            <Copyright />
          </div>
        </>
      )}
    </div>
  );
}
