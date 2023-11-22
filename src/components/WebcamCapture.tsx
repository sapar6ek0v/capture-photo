import Webcam from "react-webcam";
import {useCallback, useEffect, useRef, useState} from "react";
import { isMobile } from "react-device-detect";
import ImageViewerModal from "./ImageViewerModal.tsx";

const WebcamCapture = () => {
    const webcamRef = useRef<Webcam>(null);
    const [imageSrc, setImageSrc] = useState<string>('');
    const [videoConstraints, setVideoConstraints] = useState({
        width: 440,
        height: 250,
        facingMode: "user",
    });

    useEffect(() => {
        const changeVideoConstraints = () => {
            if (isMobile) {
                setVideoConstraints({
                    ...videoConstraints,
                    width: 320,
                    height: 200,
                });
            }
        };

        changeVideoConstraints();
    }, []);

    const captureImage = useCallback(
        () => {
            if (!webcamRef.current) {
                return;
            }

            const imageSrc = webcamRef.current.getScreenshot();

            if (imageSrc) {
                setImageSrc(imageSrc);
            }
        },
        [webcamRef]
    );

    const handleClearResult = () => {
        setImageSrc('');
    };

    return (
        <>
            {!imageSrc ?
                <>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        videoConstraints={videoConstraints}
                        imageSmoothing={true}
                        mirrored={true}
                        screenshotQuality={0.9}
                    />
                    <button className="click-btn" onClick={captureImage} type="button">
                        <span className="text">скрин</span>
                        <span>сделать снимок</span>
                    </button>
                </> :
                <ImageViewerModal imageSrc={imageSrc} onClear={handleClearResult}/>
            }
        </>
    )
};

export default WebcamCapture;