import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import LinkButton from "../Shared/LinkButton";
import { OptionSelect, Rincianbiayaperm } from "@/types";
import CameraWithCapture from "../CameraWithCapture";
import { QRCodeReader, Result } from "@zxing/library";
import QRCodeScanner from "../QRCodeScanner";

type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
    onReadQRCode: (text: Result | undefined) => void;
};
// type OptionSelectExt = {
//     rincianbiayaperm: Rincianbiayaperm;
// } & OptionSelect;

const ModalQRCode = ({ showModal, setShowModal, onReadQRCode }: Props) => {
    return (
        <Modal
            show={showModal}
            maxWidth="sm"
            closeable={true}
            onClose={() => setShowModal(false)}
        >
            <div className="p-2 bg-blueGray-100 rounded-md ">
                <div className="flex flex-col justify-between items-start">
                    <h1 className="font-bold text-sm text-blueGray-700 mb-2">
                        QRCode Scanner
                    </h1>
                    <div className="w-full h-auto flex justify-between items-center p-1 flex-wrap gap-1 border border-gray-300 rounded-md bg-gray-100 ">
                        <QRCodeScanner
                            onReadQRCode={(result) => {
                                onReadQRCode(result);
                                setShowModal(false);
                            }}
                        />
                    </div>
                </div>

                <div className="mt-2 w-full flex justify-between items-center">
                    <span></span>
                    <LinkButton
                        href="#"
                        theme="blue"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowModal(false);
                        }}
                    >
                        <span>Close</span>
                    </LinkButton>
                </div>
            </div>
        </Modal>
    );
};

export default ModalQRCode;
