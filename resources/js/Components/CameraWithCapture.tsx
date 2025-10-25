import React, { useRef, useEffect, useState } from "react";
import Button from "./Shared/Button";
import { get, set } from "lodash";

export type CameraColumn = {
    picture?: string;
    label: string;
    deviceId: string;
};
const CameraWithCapture: React.FC<{
    uploadImage: (imgfile: File) => void;
    getMediaStream: (videoStream: MediaStream) => void;
}> = ({ uploadImage, getMediaStream }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);
    const [videoStream, setVideoStream] = useState<MediaStream>();
    const [columns, setColumns] = useState<
        { label: string; deviceId: string }[]
    >([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(
        null
    );
    // const stopCamera = async () => {
    //     if (videoStream) {
    //         videoStream.getTracks().forEach((track: any) => {
    //             console.log(track.readyState);
    //             if (track.readyState === "live") {
    //                 track.stop();
    //             }
    //         });
    //     }
    // };
    async function startCamera(deviceId: string) {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId,
            },
            audio: false,
        });

        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            getMediaStream(stream);
            setVideoStream(stream);
        }
    }
    async function getDevices(
        devices: MediaDeviceInfo[]
    ): Promise<CameraColumn[]> {
        const cols: CameraColumn[] = [];
        // const devices = await navigator.mediaDevices.enumerateDevices();
        devices.forEach((device) => {
            if (device.kind === "videoinput") {
                cols.push({
                    label: device.label,
                    deviceId: device.deviceId,
                });
            }
        });
        setColumns(cols);
        if (!selectedDeviceId) {
            setSelectedDeviceId(cols[0].deviceId);
        }
        return cols;
    }

    useEffect(() => {
        // const startCamera = async () => {
        //     try {
        //         const stream = await navigator.mediaDevices.getUserMedia({
        //             video: true,
        //         });
        //         if (videoRef.current) {
        //             videoRef.current.srcObject = stream;
        //             setVideoStream(stream);
        //         }
        //     } catch (err) {
        //         console.error("Gagal mengakses kamera:", err);
        //     }
        // };
        // getDevices().then((cols) => {
        //     if (cols.length > 0) {
        //         startCamera(cols[0].deviceId);
        //     }
        // });\
        (async () => {
            await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true,
            });
            let devices = await navigator.mediaDevices.enumerateDevices();
            getDevices(devices);
        })();
        if (selectedDeviceId) {
            startCamera(selectedDeviceId);
        }

        return () => {
            // if (videoRef.current && videoRef.current.srcObject) {
            //     (videoRef.current.srcObject as MediaStream)
            //         .getTracks()
            //         .forEach((track) => track.stop());
            // }
        };
    }, [selectedDeviceId]);

    const capturePhoto = () => {
        if (!canvasRef.current || !videoRef.current) return;

        const context = canvasRef.current.getContext("2d");
        if (context) {
            context.drawImage(videoRef.current, 0, 0, 640, 480);
            const dataUrl = canvasRef.current.toDataURL("image/png");
            // setImageData(dataUrl);
            const byteString = atob(dataUrl.split(",")[1]);
            const mimeString = dataUrl
                .split(",")[0]
                .split(":")[1]
                .split(";")[0];

            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([ab], { type: mimeString });
            const imgfile = blobToFile(blob, "photo.png");
            uploadImage(imgfile);
        }
    };

    const downloadPhoto = () => {
        if (!imageData) return;
        const link = document.createElement("a");
        link.href = imageData;
        link.download = "photo.png";
        link.click();
    };

    function blobToFile(blob: Blob, fileName: string): File {
        return new File([blob], fileName, { type: blob.type });
    }
    const handleUploadImage = () => {
        if (!imageData) return;

        // Convert base64 to Blob
        const byteString = atob(imageData.split(",")[1]);
        const mimeString = imageData.split(",")[0].split(":")[1].split(";")[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });
        const imgfile = blobToFile(blob, "photo.png");
        uploadImage(imgfile);
    };

    const uploadPhoto = async () => {
        if (!imageData) return;

        // Convert base64 to Blob
        const byteString = atob(imageData.split(",")[1]);
        const mimeString = imageData.split(",")[0].split(":")[1].split(";")[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });

        const formData = new FormData();
        formData.append("file", blob, "photo.png");

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            alert("Upload berhasil: " + result.message);
        } catch (error) {
            console.error("Gagal upload:", error);
            alert("Upload gagal");
        }
    };

    return (
        <div>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                // width={640}
                // height={480}
                className="object-cover border-2 border-black w-full h-full"
            />

            <div className="p-2 flex flex-col md:flex-row justify-between gap-2">
                <select
                    className="block w-full md:w-2/3 appearance-none text-sm bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    value={selectedDeviceId ?? ""}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                >
                    {columns &&
                        columns.map((col) => (
                            <option key={col.deviceId} value={col.deviceId}>
                                {col.label}
                            </option>
                        ))}
                </select>

                <Button
                    theme="black"
                    className="w-full md:w-1/3"
                    onClick={capturePhoto}
                >
                    Ambil Foto
                </Button>
            </div>

            <canvas
                ref={canvasRef}
                width={640}
                height={480}
                style={{ display: "none" }}
            />

            {imageData && (
                <div style={{ marginTop: "20px" }}>
                    {/* <h3>📸 Hasil Foto:</h3>
                    <img
                        src={imageData}
                        alt="Captured"
                        width={640}
                        height={480}
                    /> */}

                    <div style={{ marginTop: "10px" }}>
                        {/* <button onClick={downloadPhoto}>⬇️ Download</button> */}
                        <button
                            onClick={handleUploadImage}
                            style={{ marginLeft: "10px" }}
                        >
                            ☁️ Upload
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraWithCapture;
