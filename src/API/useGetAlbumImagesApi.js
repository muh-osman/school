import { useQuery } from "@tanstack/react-query";
// API
import API from "./Api";

export const fetchAlbumImages = async (teacherId) => {
  const res = await API.get(`api/albums/teacher/${teacherId}`);
  return res.data;
};

export default function useGetAlbumImagesApi(teacherId) {
  return useQuery({
    queryKey: ["albumImages", teacherId],
    queryFn: () => fetchAlbumImages(teacherId),
  });
}
