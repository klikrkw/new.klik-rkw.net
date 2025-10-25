import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import LinkButton from "../Shared/LinkButton";
import { OptionSelect, Rincianbiayaperm } from "@/types";
import CameraWithCapture from "../CameraWithCapture";

type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
    uploadImage: (imgfile: File) => void;
};
type OptionSelectExt = {
    rincianbiayaperm: Rincianbiayaperm;
} & OptionSelect;

const ModalTakePicture = ({ showModal, setShowModal, uploadImage }: Props) => {
    const [videoStream, setVideoStream] = useState<MediaStream | null>();
    const getMediaStream = (vs: MediaStream) => {
        setVideoStream(vs);
    };
    const stopCamera = async () => {
        if (videoStream) {
            videoStream.getTracks().forEach((track: any) => {
                if (track.readyState === "live") {
                    track.stop();
                }
            });
        }
    };
    const handleClose = () => {
        stopCamera();
        setShowModal(false);
    };
    return (
        <Modal
            show={showModal}
            maxWidth="md"
            closeable={true}
            onClose={handleClose}
        >
            <div className="p-2 bg-blueGray-100 rounded-md ">
                <div className="flex flex-col justify-between items-start">
                    <h1 className="font-bold text-sm text-blueGray-700 mb-2">
                        Capture Image
                    </h1>
                    <div className="w-full h-auto flex justify-between items-center p-1 flex-wrap gap-1 border border-gray-300 rounded-md bg-gray-100 ">
                        <CameraWithCapture
                            getMediaStream={getMediaStream}
                            uploadImage={(f) => {
                                stopCamera();
                                setShowModal(false);
                                uploadImage(f);
                            }}
                        />
                    </div>
                </div>

                <div className="mt-2 w-full flex justify-start items-center">
                    <span></span>
                    <LinkButton
                        href="#"
                        theme="blue"
                        onClick={(e) => {
                            e.preventDefault();
                            handleClose();
                        }}
                    >
                        <span>Close</span>
                    </LinkButton>
                </div>
            </div>
        </Modal>
    );
};

export default ModalTakePicture;
