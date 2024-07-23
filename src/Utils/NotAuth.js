import { Outlet, Navigate } from "react-router-dom";
// Cookies
import { useCookies } from "react-cookie";

export default function NotAuth() {
  const [cookies, setCookie] = useCookies(["token", "pinStatus"]);

  // console.log(cookies.token);

  return !cookies.token ? (
    <Outlet />
  ) : cookies.pinStatus === true ? (
    <Navigate to="dashboard" />
  ) : (
    <Outlet />
  );
}
