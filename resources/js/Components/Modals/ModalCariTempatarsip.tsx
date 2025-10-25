import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { LoadingButton } from "../Shared/LoadingButton";
import LinkButton from "../Shared/LinkButton";
import { OptionSelect, Rincianbiayaperm } from "@/types";

type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
    id: string;
};
type OptionSelectExt = {
    rincianbiayaperm: Rincianbiayaperm;
} & OptionSelect;

const ModalCariTempatarsip = ({ showModal, setShowModal, id }: Props) => {
    let buttons: string[] = new Array(12).fill("");
    return (
        <Modal
            show={showModal}
            maxWidth="md"
            closeable={false}
            onClose={() => setShowModal(false)}
        >
            <div className="p-4 bg-blueGray-100 rounded-md ">
                <div className="flex flex-col justify-between items-start">
                    <h1 className="font-bold text-xl text-blueGray-700 mb-4">
                        CARI TEMPAT ARSIP
                    </h1>
                    <div className="w-52 h-auto flex justify-between items-center p-1 flex-wrap gap-1 border border-gray-300 rounded-md bg-gray-100 ">
                        {buttons.map((item, index) => (
                            <button
                                className="bg-gray-300 hover:bg-gray-600 text-gray-800 font-bold py-2 px-2 rounded flex justify-center items-center w-[31%]"
                                key={index}
                                onClick={() => {}}
                            >
                                <div className="p-1 rounded-full w-10 h-10 bg-gray-800 flex items-center justify-center">
                                    <span className="text-white text-lg">
                                        {index + 1}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4 w-full flex justify-between items-center">
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

export default ModalCariTempatarsip;
