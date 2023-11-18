/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

export function TakePhoto() {
  const videoRef = useRef<any>(null);
  const photoRef = useRef<any>(null);

  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const video = videoRef.current;

      if (video) {
        video.srcObject = stream;
        video.play();
      }

    } catch (error) {
      console.error("Error accessing camera: " + error);
    }
  };

  const handleClick = () => {
    const video = videoRef.current;
    const photo = photoRef.current;
    const context = photo.getContext("2d");
    const width = 414;
    const heigth = width / (16 / 9);

    if (video && context) {
      photo.width = width;
      photo.height = heigth;
      context.drawImage(video, 0, 0, width, heigth);
      const data = photo.toDataURL("image/png");
      console.log(data);
    }
  };

  useEffect(() => { getUserMedia() }, [videoRef]);

  return (
    <div>
      <video ref={videoRef}></video>
      <button onClick={handleClick}>Capture Photo</button>
      <canvas ref={photoRef}></canvas>
    </div>
  )
}