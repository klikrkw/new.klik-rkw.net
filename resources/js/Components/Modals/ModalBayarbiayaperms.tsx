import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import apputils from "@/bootstrap";
import { Bayarbiayaperm } from "@/types";
import { Lightbox } from "react-modal-image";

type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
    biayaperm_id: string;
};

const ModalBayarbiayaperms = ({
    showModal,
    setShowModal,
    biayaperm_id,
}: Props) => {
    const [bayarbiayaperms, setBayarbiayaperms] = useState<Bayarbiayaperm[]>(
        []
    );
    const getBayarbiayaperms = async (biayaperm_id: string) => {
        let xlink = `/transaksi/bayarbiayaperms/api/list?biayaperm_id=${biayaperm_id}`;
        const response = await apputils.backend.get(xlink);
        const data = response.data;
        setBayarbiayaperms(data.data);
    };
    useEffect(() => {
        if (biayaperm_id && showModal) {
            getBayarbiayaperms(biayaperm_id);
        }
    }, [showModal]);

    const [viewImage, setViewImage] = useState<boolean>(false);
    const [image, setImage] = useState<string | null>(null);

    return (
        <Modal
            show={showModal}
            maxWidth="2xl"
            closeable={true}
            onClose={() => setShowModal(false)}
        >
            <div className="p-4 bg-blueGray-100 rounded-md text-xs">
                <div className="w-full absolute right-1 top-1 flex justify-between items-center px-1">
                    <h1 className="text-lg mb-1 font-semibold text-blueGray-500 ml-4">
                        List Pembayaran
                    </h1>
                    <button
                        className="text-lightBlue-500 background-transparent font-bold uppercase px-0 py-0 text-xl outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={(e) => setShowModal(false)}
                    >
                        <i
                            className="fa fa-times-circle"
                            aria-hidden="true"
                        ></i>
                    </button>
                </div>
                <table className="w-full shadow-md bottom-2 mt-5">
                    <thead>
                        <tr className="border-y-2 font-semibold bg-slate-300">
                            <td className="px-1 py-2" width="5%">
                                No
                            </td>
                            <td className="px-1 py-2" width="15%">
                                Tanggal
                            </td>
                            <td className="px-1 py-2" width="15%">
                                Metode Bayar
                            </td>
                            <td className="px-1 py-2" width="10%">
                                Info Rekening
                            </td>
                            <td className="px-1 py-2" width="10%">
                                Image
                            </td>
                            <td className="px-1 py-2" width="15%" align="right">
                                Saldo Awal
                            </td>
                            <td className="px-1 py-2" width="15%" align="right">
                                Jumlah Bayar
                            </td>
                            <td className="px-1 py-2" width="15%" align="right">
                                Saldo Akhir
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {bayarbiayaperms &&
                            bayarbiayaperms.map((bayarbiayaperm, idx) => (
                                <tr key={bayarbiayaperm.id}>
                                    <td className="px-1 py-2">{idx + 1}</td>
                                    <td className="px-1 py-2">
                                        {bayarbiayaperm.tgl_bayarbiayaperm}
                                    </td>
                                    <td className="px-1 py-2">
                                        {
                                            bayarbiayaperm.metodebayar
                                                .nama_metodebayar
                                        }
                                    </td>
                                    <td className="px-1 py-2">
                                        {bayarbiayaperm.info_rekening}
                                    </td>
                                    <td className="px-1 py-2">
                                        {bayarbiayaperm.image_bayarbiayaperm && (
                                            <button
                                                onClick={() => {
                                                    setImage(
                                                        bayarbiayaperm.image_bayarbiayaperm
                                                    );
                                                    setViewImage(true);
                                                }}
                                            >
                                                <i
                                                    className={
                                                        "fas fa-image mr-2 text-sm cursor-pointer"
                                                    }
                                                ></i>
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-1 py-2" align="right">
                                        {bayarbiayaperm.saldo_awal}
                                    </td>
                                    <td className="px-1 py-2" align="right">
                                        {bayarbiayaperm.jumlah_bayar}
                                    </td>
                                    <td className="px-1 py-2" align="right">
                                        {bayarbiayaperm.saldo_akhir}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {viewImage && (
                    <div className="h-56 p-2">
                        <Lightbox
                            small={image ? image : ""}
                            medium={image ? image : ""}
                            large={image ? image : ""}
                            alt="View Image"
                            onClose={() => setViewImage(false)}
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ModalBayarbiayaperms;
