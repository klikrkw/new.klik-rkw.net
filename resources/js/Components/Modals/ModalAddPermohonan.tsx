import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import apputils from "@/bootstrap";
import { ThreeDots } from "react-loader-spinner";
import { usePage } from "@inertiajs/react";
import { hide } from "@popperjs/core";
import { Permohonan } from "@/types";
import ModalAutosize from "./ModalAutosize";

type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
    src: string;
    setPermohonan: (permohonan: Permohonan | undefined) => void;
};
declare const window: {
    parentCallback: (permohonan: Permohonan | undefined) => void;
} & Window;

const ModalAddPermohonan = ({
    showModal,
    setShowModal,
    src,
    setPermohonan,
}: Props) => {
    const { flash } = usePage<any>().props;

    // useEffect(() => {
    //     if (biayaperm_id && showModal) {
    //         getBayarbiayaperms(biayaperm_id)
    //     }
    // }, [showModal])

    const [dataBase64, setDataBase64] = useState<string>();
    const [isLoading, setisLoading] = useState(false);
    const base64toBlob = (data: string) => {
        // Cut the prefix `data:application/pdf;base64` from the raw base 64
        const base64WithoutPrefix = data.substring(
            "data:application/pdf;base64,".length
        );

        const bytes = atob(base64WithoutPrefix);
        let length = bytes.length;
        let out = new Uint8Array(length);

        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }

        return new Blob([out], { type: "application/pdf" });
    };
    useEffect(() => {
        setisLoading(true);
        const getLaporan = async () => {
            // setIsloading(true)
            const response = await apputils.backend.get(src);
            const data = response.data;
            // setDataBase64(URL.createObjectURL(base64toBlob(data)));
            setisLoading(false);
        };
        if (showModal) {
            getLaporan();
        }
    }, [showModal]);
    const iframe = useRef<any>(null);

    // const clickMe = () => {
    //     iframe.current.contentWindow.childCallback();
    // };

    window.parentCallback = (perm) => {
        setPermohonan(perm);
        setShowModal(false);
    };
    const [loadingIframe, setLoadingIframe] = useState(true);
    return (
        <ModalAutosize
            show={showModal}
            maxWidth="2xl"
            closeable={false}
            onClose={() => setShowModal(false)}
        >
            <div className="p-2 bg-white rounded-md text-xs z-40 h-full">
                <div className="w-full h-full relative flex flex-col m-auto justify-center items-center rounded-md mt-4">
                    {loadingIframe || isLoading ? (
                        <div className="absolute top-7">
                            <ThreeDots
                                visible={true}
                                height="100"
                                width="100"
                                color="#4fa94d"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div>
                    ) : null}
                    <iframe
                        src={src}
                        title="Add Permohonan"
                        ref={iframe}
                        className="w-full h-full rounded-md"
                        onLoad={() => setLoadingIframe(false)}
                        loading="lazy"
                    />
                </div>
            </div>

            <div className="w-full absolute right-1 top-1 flex justify-end items-center px-1 ">
                <button
                    className="text-blueGray-700 background-transparent font-bold uppercase px-0 py-0 text-xl outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={(e) => setShowModal(false)}
                >
                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                </button>
            </div>
        </ModalAutosize>
    );
};

export default ModalAddPermohonan;
