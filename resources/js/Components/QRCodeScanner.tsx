import React, { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { Result } from "@zxing/library";
export type CameraColumn = {
    picture?: string;
    label: string;
    deviceId: string;
};

const QRCodeScanner: React.FC<{
    onReadQRCode: (text: Result | undefined) => void;
}> = ({ onReadQRCode }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    // const [qrResult, setQrResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const controlsRef = useRef<IScannerControls | null>();
    const [columns, setColumns] = useState<
        { label: string; deviceId: string }[]
    >([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(
        null
    );

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
        const codeReader = new BrowserQRCodeReader();
        let isActive = true;

        const startScanner = async () => {
            try {
                // const devices =
                //     await BrowserQRCodeReader.listVideoInputDevices();

                // if (devices.length === 0) {
                //     setError("Tidak ada kamera ditemukan");
                //     return;
                // }
                // getDevices(devices);
                // const selectedDeviceId = devices[0].deviceId;
                (async () => {
                    await navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: true,
                    });
                    let devices =
                        await navigator.mediaDevices.enumerateDevices();
                    getDevices(devices);
                })();
                if (selectedDeviceId) {
                    await codeReader.decodeFromVideoDevice(
                        selectedDeviceId,
                        videoRef.current!,
                        (result: Result | undefined, err, control) => {
                            if (result && isActive) {
                                // setQrResult(result.getText());
                                onReadQRCode(result);
                            }
                            if (err) {
                                setError(err.message);
                            }
                            if (control) {
                                controlsRef.current = control;
                            }
                        }
                    );
                }
            } catch (err: any) {
                setError("Gagal memulai kamera: " + err.message);
            }
        };

        startScanner();

        return () => {
            isActive = false;
            if (controlsRef.current) {
                controlsRef.current.stop();
            }
        };
    }, [selectedDeviceId]);

    return (
        <div>
            <video
                ref={videoRef}
                style={{
                    width: "100%",
                    maxWidth: 480,
                    border: "1px solid #ccc",
                }}
            />

            {error && (
                <div style={{ marginTop: "10px", color: "red" }}>
                    ⚠️ {error}
                </div>
            )}
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
            </div>
        </div>
    );
};

export default QRCodeScanner;
