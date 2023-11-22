import {ChangeEvent, useState} from "react";
import {IoMdClose} from "react-icons/io";
import {centerCrop, Crop, makeAspectCrop, ReactCrop} from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css'

interface Props {
    imageSrc: string;
    onClear: () => void;
}

const ImageViewerModal = ({imageSrc, onClear}: Props) => {
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
    });
    const [croppedImageUrl, setCroppedImageUrl] = useState<string>();

    const handleImageLoad = (e: ChangeEvent<HTMLImageElement>) => {
        const {naturalWidth: width, naturalHeight: height} = e.currentTarget;

        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                16 / 9,
                width,
                height
            ),
            width,
            height
        );

        setCrop(crop);
    };

    const handleApplyCrop = () => {
        const canvas = document.createElement('canvas');
        const image = new Image();
        image.src = imageSrc;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.drawImage(
                image,
                crop.x,
                crop.y,
                crop.width,
                crop.height,
                0,
                0,
                crop.width,
                crop.height
            );

            setCroppedImageUrl(canvas.toDataURL('image/png'));
        }
    };

    const handleSubmit = async () => {
        const link = document.createElement('a');
        link.href = croppedImageUrl || imageSrc;
        link.download = 'passport.png';
        link.click();

        try {
            if (croppedImageUrl) {
                const api = `${import.meta.env.VITE_APP_API_URL}/pdf-to-images/imagesPassport`;
                const formData = new FormData();
                formData.append('file', croppedImageUrl);
                const response = await fetch(api, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    body: formData
                });

                console.log(response);
            }
            onClear();
        } catch (e) {
            console.error(e);
            onClear();
        }
    };

    return (
        <div
            className={`
                fixed inset-0 z-[100] bg-black bg-opacity-50 flex justify-center items-center 
               ${imageSrc ? 'translate-x-0' : 'translate-x-[100%]'}
              transition-transform duration-300 ease-in-out`}
        >
            <div className="relative flex flex-col items-center justify-center gap-[20px]">
                {imageSrc && (
                    <ReactCrop
                        onChange={(value) => setCrop(value)}
                        crop={crop}
                        aspect={16 / 9}
                        onComplete={handleApplyCrop}
                    >
                        <img src={imageSrc} alt="image" onLoad={handleImageLoad}/>
                    </ReactCrop>
                )}
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute top-[-16%] right-0 w-[40px] h-[40px] text-[#fff] flex items-center justify-center rounded-[50%] border-[1px] border-solid border-[#18181a] bg-[#18181a] transition hover:bg-[#fff] hover:text-[#18181a]"
                >
                    <IoMdClose className="text-[20px]"/>
                </button>
                <button
                    type="button"
                    className="bg-[#18181a] text-[#fff] py-[10px] px-[20px] transition ease-in hover:bg-[#fff] hover:text-[#18181a]"
                    onClick={handleSubmit}
                >
                    Отправить
                </button>
            </div>
        </div>
    )
};

export default ImageViewerModal;