import { useQuery } from "@tanstack/react-query";
// Cookies
// import { useCookies } from "react-cookie";
// API
import API from "./Api";

export const fetchAlbumImages = async (teacherId) => {
  const res = await API.get(`api/albums/teacher/${teacherId}`);
  return res.data;
};

export default function useGetAlbumImagesApi(teacherId) {
  // Cookie
  //   const [cookies, setCookie] = useCookies(["userId"]);
  //   const userId = cookies.userId;

  return useQuery({
    queryKey: ["albumImages", teacherId],
    queryFn: () => fetchAlbumImages(teacherId),
  });
}
