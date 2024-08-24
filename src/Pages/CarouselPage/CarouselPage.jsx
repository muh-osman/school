import style from "./CarouselPage.module.scss";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
// Toastify
import { toast } from "react-toastify";
// API
import useGetAlbumImagesApi from "../../API/useGetAlbumImagesApi";
//
import Carousel from "react-bootstrap/Carousel";


export default function CarouselPage() {
  let { teacherId, imageId } = useParams();
  const {
    data: albumImages,
    fetchStatus,
    error,
  } = useGetAlbumImagesApi(teacherId);

  useEffect(() => {
    if (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [error]);

  // State to manage the active index
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (albumImages && albumImages.length > 0) {
      // Convert imageId to the same type as the IDs in albumImages
      const idToFind = Number(imageId); // Assuming IDs are numbers
      // console.log("Looking for imageId:", idToFind);

      // Find the index of the image with the matching imageId
      const index = albumImages.findIndex((image) => image.id === idToFind);
      // console.log("Found index:", index);

      if (index !== -1) {
        setActiveIndex(index); // Set the active index to the found index
      }
    }
  }, [albumImages, imageId]);

  // Debugging: Log the active index and album images
  // console.log("Active Index:", activeIndex);
  // console.log("Album Images:", albumImages);

  return (
    <div className={style.container}>
      {fetchStatus === "fetching" && (
        <div className={style.progressContainer}>
          <LinearProgress />
        </div>
      )}

      {albumImages && albumImages.length > 0 && (
        <Carousel
          className="carousel"
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          interval={null} // Disable autoplay
        >
          {albumImages.map(({ id, image }) => (
            <Carousel.Item key={id} className={style.image_box}>
              <img className="d-block" src={image} alt={`Slide ${id}`} />
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </div>
  );
}
