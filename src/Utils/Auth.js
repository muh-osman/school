import { Outlet, Navigate } from "react-router-dom";
// Cookies
import { useCookies } from "react-cookie";

export default function Auth() {
  const [cookies, setCookie] = useCookies(["token", "pinStatus"]);

  // console.log(cookies.token);




  return cookies.token && cookies.pinStatus === true ? <Outlet /> : <Navigate to="dashboard-login" />;
}
