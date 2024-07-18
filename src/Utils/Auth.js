import { Outlet, Navigate } from "react-router-dom";
// Cookies
import { useCookies } from "react-cookie";

export default function Auth() {
  const [cookies, setCookie] = useCookies(["token"]);

  // console.log(cookies.token);

  return cookies.token ? <Outlet /> : <Navigate to="login" />;
}
