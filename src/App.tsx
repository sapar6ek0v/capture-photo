import { useRef, useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { MobileView } from 'react-device-detect';
import './App.css';

enum StreamTypes {
  FRONT_CAMERA = 'FRONT_CAMERA',
  BACK_CAMERA = 'BACK_CAMERA',
  ENVIRONMENT = 'ENVIRONMENT'
}

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const photoRef = useRef<HTMLCanvasElement | null>(null);
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [streamType, setStreamType] = useState<StreamTypes>(StreamTypes.ENVIRONMENT);

  const getVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const video = videoRef.current;

      if (video) {
        video.srcObject = stream;
        video.play();
        setStream(stream);
      }

    } catch (error) {
      console.error("Error accessing camera: " + error);
    }
  };

  const handleTakePhoto = () => {
    setHasPhoto(true);
    const video = videoRef.current;
    const photo = photoRef.current;
    const context = photo?.getContext("2d");

    const width = 414;
    const height = width / (16 / 9);
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

  useEffect(() => { getVideoStream() }, [videoRef]);

  const handleClearResult = () => {
    const photo = photoRef.current;
    if (!photo) return;

    const context = photo.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);

    getVideoStream();
  };

  const toggleStreamType = () => {
    if (streamType === StreamTypes.FRONT_CAMERA) {
      setStreamType(StreamTypes.FRONT_CAMERA);
      return;
    }
    if (streamType === StreamTypes.BACK_CAMERA) {
      setStreamType(StreamTypes.BACK_CAMERA);
      return;
    }
    setStreamType(StreamTypes.ENVIRONMENT);
  };

  return (
    <section
      className="relative w-full h-full min-h-[100vh] flex flex-col items-center justify-center gap-[20px]"
    >

      <MobileView>
        <div className="flex items-center justify-center">
          <button onClick={toggleStreamType}>
            {streamType === StreamTypes.FRONT_CAMERA
              ? 'Передная камера' : 'Заднея камера'}
          </button>
        </div>
      </MobileView>

      <div className="flex justify-center items-center">
        <video ref={videoRef} className="w-[80%] h-[50%]"></video>
      </div>

      <div className='w-full flex justify-center'>
        <button
          className="click-btn"
          onClick={handleTakePhoto}
        >
          <span className="text">скрин</span>
          <span>сделать снимок</span>
        </button>
      </div>

      <div
        className={`
          fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center 
          ${hasPhoto ? 'translate-x-0' : 'translate-x-[100%]'}
          transition-transform duration-300 ease-in-out
          }`
        }
      >
        <canvas ref={photoRef}></canvas>
        <button
          className="absolute top-[30.9%] left-[74%] w-[40px] h-[40px] text-[#fff] flex items-center justify-center rounded-[50%] border-[1px] border-solid border-[#18181a] bg-[#18181a] transition hover:bg-[#fff] hover:text-[#18181a]"
          onClick={handleClearResult}
        >
          <IoMdClose className="text-[20px]" />
        </button>
      </div>
    </section>
  )
}

export default App;
