import { useRef, useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { TbLoader3 } from "react-icons/tb";
import { isMobile } from 'react-device-detect';
import './App.css';

// enum StreamTypes {
//   FRONT_CAMERA = 'FRONT_CAMERA',
//   BACK_CAMERA = 'BACK_CAMERA',
// }

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const photoRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  // const [streamType, setStreamType] = useState<StreamTypes>(StreamTypes.BACK_CAMERA);

  const getVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });

      // if (isMobile) {
      //   stream = streamType === StreamTypes.FRONT_CAMERA ? stream : await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'environment' } } });
      // }

      const video = videoRef.current;

      if (video) {
        video.srcObject = stream;
        video.play();
        setStream(stream);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error accessing camera: " + error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVideoStream();
  }, [videoRef]);

  const handleTakePhoto = () => {
    setHasPhoto(true);
    const video = videoRef.current;
    const photo = photoRef.current;
    const context = photo?.getContext("2d");

    let width = 414;
    let height = width / (16 / 11);

    if (isMobile) {
      width = 300;
      height = width / (16 / 11);
    }

    if (video && context && photo) {
      photo.width = width;
      photo.height = height;

      context.drawImage(video, 0, 0, photo.width, photo.height);
    }

    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleClearResult = () => {
    const photo = photoRef.current;
    if (!photo) return;

    const context = photo.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
    setIsLoading(false);

    getVideoStream();
  };

  // const toggleStreamType = () => {
  //   if (streamType === StreamTypes.FRONT_CAMERA) {
  //     setStreamType(StreamTypes.BACK_CAMERA);
  //   } else {
  //     setStreamType(StreamTypes.FRONT_CAMERA);
  //   }
  // };
  console.log(videoRef)
  return (
    <section
      className="relative w-full h-full min-h-[100vh] flex flex-col items-center justify-center gap-[20px]"
    >
      {/* <MobileView>
        <div className="flex items-center justify-center">
          <button
            onClick={toggleStreamType}
            className="border-[1px] border-solid border-[#18181a] bg-[#18181a] py-[5px] px-[10px] text-[#fff] transition hover:bg-[#fff] hover:text-[#18181a]"
          >
            {streamType === StreamTypes.FRONT_CAMERA
              ? 'Заднея камера' : 'Передная камера'}
          </button>
        </div>
      </MobileView> */}

      <div className="flex justify-center items-center">
        {!isLoading ?
          <video ref={videoRef} className="w-[80%] h-[50%]"></video> :
          <div>
            <TbLoader3 className="text-[#18181a] text-[50px] animate-spin" />
          </div>}
      </div>

      <div className='w-full flex justify-center'>
        <button
          className="click-btn"
          onClick={handleTakePhoto}
          disabled={isLoading}
        >
          <span className="text">скрин</span>
          <span>сделать снимок</span>
        </button>
      </div>

      <div
        className={`
          fixed inset-0 z-[100] bg-black bg-opacity-50 flex justify-center items-center 
          ${hasPhoto ? 'translate-x-0' : 'translate-x-[100%]'}
          transition-transform duration-300 ease-in-out
          }`
        }
      >
        <div className="relative">
          <canvas ref={photoRef}></canvas>
          <button
            className="absolute top-[-26%] right-0 w-[40px] h-[40px] text-[#fff] flex items-center justify-center rounded-[50%] border-[1px] border-solid border-[#18181a] bg-[#18181a] transition hover:bg-[#fff] hover:text-[#18181a]"
            onClick={handleClearResult}
          >
            <IoMdClose className="text-[20px]" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default App;
