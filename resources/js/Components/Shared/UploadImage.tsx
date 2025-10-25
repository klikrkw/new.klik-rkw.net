import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import {
    deleteObject,
    getDownloadURL,
    ref as fbRef,
    uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/firebase";
import { resizeImage } from "@/utils/images";
import { useAuth } from "@/Contexts/AuthContext";
import { usePage } from "@inertiajs/react";
import ModalTakePicture from "../Modals/ModalTakePicture";

// React.InputHTMLAttributes<HTMLInputElement>
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    name: string;
    className?: string;
    errors?: string | undefined;
    image: string | null;
    imagePath: string;
    setImage: (img: string) => void;
}
// type InputProps = React.HTMLProps<HTMLInputElement>
export const UploadImage = React.forwardRef<HTMLInputElement, InputProps>(
    (
        { label, errors, name, image, setImage, imagePath, ...props },
        ref: any
    ) => {
        const [imageUpload, setImageUpload] = useState<File | null>(null);
        const [uploadProgress, setUploadProgress] = useState<number | null>();
        const [showTakePicture, setShowTakePicture] = useState<boolean>(false);
        const uploadFile = async () => {
            if (imageUpload == null) return;
            const newImg = await resizeImage(imageUpload, 500, 500);
            let rand = Math.random() * 100000;
            const imageRef = fbRef(
                storage,
                `${imagePath}${rand.toFixed()}_${imageUpload.name}`
            );

            const uploadTask = uploadBytesResumable(imageRef, newImg);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log("Upload is " + progress + "% done");
                    setUploadProgress(progress);
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                    }
                },
                (error) => {
                    // Handle unsuccessful uploads
                },
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            //   console.log('File available at', downloadURL);
                            setImage(downloadURL);
                            setUploadProgress(null);
                            setImageUpload(null);
                        }
                    );
                }
            );
        };

        const deleteFile = async (imageUrl: string) => {
            const imageRef = fbRef(storage, imageUrl);
            // Delete the file
            deleteObject(imageRef)
                .then(() => {
                    setImageUpload(null);
                    setImage("");
                    console.log("image deleted from firebase");
                    // File deleted successfully
                })
                .catch((error) => {
                    console.log("error delete : ", error);
                    // Uh-oh, an error occurred!
                });
        };
        const { currentUser, login, logout } = useAuth();
        const { fbtoken } = usePage().props;
        useEffect(() => {
            if (!currentUser) {
                login(fbtoken);
            }

            return () => {
                if (currentUser) {
                    console.log("logout firebase");
                    logout();
                    // getFcmToken()
                }
            };
        }, []);

        return (
            <div className="w-full grid grid-cols-2 grid-rows-1 gap-2 row-span-2 mb-2">
                <input
                    type="file"
                    ref={ref}
                    tabIndex={-1}
                    name="imageUpload"
                    className="h-9 w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-0 file:px-3 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded file:h-full"
                    onChange={
                        (e: BaseSyntheticEvent) =>
                            setImageUpload(e.target.files[0])
                        // setData("image_biayaperm", e.target.files[0])
                    }
                />

                <div className="flex flex-col justify-start gap-1 items-start ">
                    <Button
                        tabIndex={-1}
                        name="takePictureBtn"
                        type="button"
                        theme="blueGrey"
                        className="h-9"
                        onClick={() => setShowTakePicture(true)}
                    >
                        <i className="fas fa-camera"></i>
                    </Button>
                    {imageUpload ? (
                        <Button
                            tabIndex={-1}
                            name="upload"
                            type="button"
                            theme="blueGrey"
                            className="h-9"
                            onClick={uploadFile}
                        >
                            <i className="fas fa-upload"></i>
                        </Button>
                    ) : null}
                    {image ? (
                        <div className="flex flex-col justify-between items-start">
                            <div className="flex flex-wrap justify-center">
                                <div className="w-full group rounded-lg bg-gray-400 overflow-hidden border-2 cursor-pointer">
                                    <img
                                        src={image}
                                        alt="..."
                                        className="shadow rounded max-w-full h-auto align-middle border-none transition-all group-hover:scale-110 group-hover:bg-gray-600"
                                    />
                                </div>
                            </div>
                            <Button
                                name="upload"
                                type="button"
                                tabIndex={-1}
                                className="h-9 mt-2 absolute ml-2"
                                theme="black"
                                onClick={() => deleteFile(image)}
                            >
                                <i className="fas fa-trash"></i>
                            </Button>
                        </div>
                    ) : null}
                </div>
                {uploadProgress && (
                    <progress value={uploadProgress} max="100">
                        {uploadProgress}%
                    </progress>
                )}
                <ModalTakePicture
                    showModal={showTakePicture}
                    setShowModal={setShowTakePicture}
                    uploadImage={setImageUpload}
                />
            </div>
        );
    }
);

export default UploadImage;
