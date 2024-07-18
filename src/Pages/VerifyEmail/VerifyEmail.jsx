import style from "./VerifyEmail.module.scss";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// MUI
import Avatar from "@mui/material/Avatar";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import DoneIcon from "@mui/icons-material/Done";
// API
import { useVerifyEmailApi } from "../../API/useVerifyEmailApi";

export default function VerifyEmail() {
  // Parse the query parameters from the URL
  //   http://localhost:3000/verify-email?expires=XXX&hash=XXX&id=XXX&signature=XXX
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hash = searchParams.get("hash");
  const id = searchParams.get("id");

  const { mutate, data, isPending, isSuccess, isError, error } =
    useVerifyEmailApi();

  useEffect(() => {
    mutate({
      hash,
      id,
    });
  }, []);

  if (isPending) {
    return (
      <div className={style.container}>
        <h1>Verifying email address</h1>
        <div className={style.spinner}></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={style.container}>
        <Avatar sx={{ m: 1, bgcolor: "#07bc0c" }}>
          <DoneIcon />
        </Avatar>
        <h1>{data?.message}</h1>
        <Link to="/">Go home</Link>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={style.container}>
        <Avatar sx={{ m: 1, bgcolor: "#f1c40f" }}>
          <PriorityHighIcon />
        </Avatar>
        <h1>{error?.response?.data?.message}</h1>
        <Link to="/">Go home</Link>
      </div>
    );
  }
}
