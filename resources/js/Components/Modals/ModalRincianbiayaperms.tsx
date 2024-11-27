import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import apputils from "@/bootstrap";
import { Rincianbiayaperm } from "@/types";

type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
    biayaperm_id: string;
};

const ModalRincianbiayaperms = ({
    showModal,
    setShowModal,
    biayaperm_id,
}: Props) => {
    const [rincianbiayaperms, setRincianbiayaperms] = useState<
        Rincianbiayaperm[]
    >([]);
    const getRincianbiayaperms = async (biayaperm_id: string) => {
        let xlink = `/transaksi/rincianbiayaperms/api/list?biayaperm_id=${biayaperm_id}`;
        const response = await apputils.backend.get(xlink);
        const data = response.data;
        setRincianbiayaperms(data);
    };
    useEffect(() => {
        if (biayaperm_id && showModal) {
            getRincianbiayaperms(biayaperm_id);
        }
    }, [showModal]);
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
                        RINCIAN BIAYA PERMOHONAN
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
                <div className="w-full mt-6 flex flex-col">
                    {rincianbiayaperms.length === 0 && (
                        <div className="w-full justify-center flex m-auto items-center h-80 p-4">
                            <div className="font-bold text-lg text-blue-500">
                                RINCIAN BIAYA TIDAK DIKETEMUKAN
                            </div>
                        </div>
                    )}
                    {rincianbiayaperms &&
                        rincianbiayaperms.map(
                            (rincianbiayaperm, index: number) => (
                                <div className="w-full flex flex-col">
                                    <ul className="list-none container-snap max-h-56 overflow-x-hidden">
                                        <li className="flex uppercase gap-1 flex-row w-full items-center rounded-t-md text-xs border justify-start bg-lightBlue-600 border-blueGray-400 px-2 py-2  text-lightBlue-50 font-semibold">
                                            <div className="w-[5%]">No</div>
                                            <div className="w-[35%] md:w-[35%]">
                                                Nama Kegiatan
                                            </div>
                                            <div className="hidden md:block w-[40%]">
                                                Keterangan
                                            </div>
                                            <div className="w-[15%] text-right pr-2">
                                                Jumlah
                                            </div>
                                        </li>
                                    </ul>
                                    <ul className="list-none container-snap max-h-80 overflow-x-hidden rounded-b-md shadow-md">
                                        <li className="w-full flex flex-col overflow-hidden bg-lightBlue-200">
                                            <div className="flex w-full gap-1 text-sm text-bold px-2 py-1 items-center justify-start text-lightBlue-900 border-b-2 border-lightBlue-200">
                                                PEMASUKAN
                                            </div>
                                        </li>
                                    </ul>
                                    <ul className="list-none container-snap max-h-80 overflow-x-hidden rounded-b-md shadow-md">
                                        {rincianbiayaperm &&
                                            rincianbiayaperm.drincianbiayaperms.map(
                                                (item, index: number) => {
                                                    if (
                                                        item
                                                            .itemrincianbiayaperm
                                                            .jenis_itemrincianbiayaperm ===
                                                        "pemasukan"
                                                    ) {
                                                        return (
                                                            <li
                                                                key={item.id}
                                                                className="w-full flex flex-col overflow-hidden bg-lightBlue-300 justify-center"
                                                            >
                                                                <div className="flex w-full gap-1 text-xs px-2 py-1 items-center justify-start text-lightBlue-900 border-b-2 border-lightBlue-200">
                                                                    <div className="pb-0 w-[5%]">
                                                                        {index +
                                                                            1}
                                                                        .
                                                                    </div>
                                                                    <div className="pb-0 w-[35%] md:w-[35%]">
                                                                        {
                                                                            item
                                                                                .itemrincianbiayaperm
                                                                                .nama_itemrincianbiayaperm
                                                                        }
                                                                    </div>
                                                                    <div className="pb-0 hidden md:block md:w-[40%]">
                                                                        {
                                                                            item.ket_biaya
                                                                        }
                                                                    </div>
                                                                    <div className="pb-0 w-[15%] text-right pr-2">
                                                                        {
                                                                            item.jumlah_biaya
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    }
                                                }
                                            )}
                                    </ul>
                                    <ul className="list-none container-snap max-h-80 overflow-x-hidden rounded-b-md shadow-md">
                                        <li className="w-full flex flex-col overflow-hidden bg-lightBlue-200">
                                            <div className="flex w-full gap-1 text-sm text-bold px-2 py-1 items-center justify-start text-lightBlue-900 border-b-2 border-lightBlue-200">
                                                PENGELUARAN
                                            </div>
                                        </li>
                                    </ul>
                                    <ul className="list-none container-snap max-h-80 overflow-x-hidden rounded-b-md shadow-md">
                                        {rincianbiayaperm &&
                                            rincianbiayaperm.drincianbiayaperms.map(
                                                (item, index: number) => {
                                                    if (
                                                        item
                                                            .itemrincianbiayaperm
                                                            .jenis_itemrincianbiayaperm ===
                                                        "pengeluaran"
                                                    ) {
                                                        return (
                                                            <li
                                                                key={item.id}
                                                                className="w-full flex flex-col overflow-hidden bg-lightBlue-300"
                                                            >
                                                                <div className="flex w-full gap-1 text-xs px-2 py-1 items-center justify-start text-lightBlue-900 border-b-2 border-lightBlue-200">
                                                                    <div className="pb-0 w-[5%]">
                                                                        {index +
                                                                            1}
                                                                        .
                                                                    </div>
                                                                    <div className="pb-0 w-[35%] md:w-[35%]">
                                                                        {
                                                                            item
                                                                                .itemrincianbiayaperm
                                                                                .nama_itemrincianbiayaperm
                                                                        }
                                                                    </div>
                                                                    <div className="pb-0 hidden md:block md:w-[40%]">
                                                                        {
                                                                            item.ket_biaya
                                                                        }
                                                                    </div>
                                                                    <div className="pb-0 w-[15%] text-right pr-2">
                                                                        {
                                                                            item.jumlah_biaya
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    }
                                                }
                                            )}
                                    </ul>
                                    <ul className="list-none container-snap max-h-80 overflow-x-hidden rounded-b-md shadow-md">
                                        <li className="w-full flex flex-col overflow-hidden bg-lightBlue-200">
                                            <div className="flex w-full gap-1 text-sm text-bold px-2 py-1 items-center justify-start text-lightBlue-900 border-b-2 border-lightBlue-200">
                                                PIUTANG
                                            </div>
                                        </li>
                                    </ul>
                                    <ul className="list-none container-snap max-h-80 overflow-x-hidden rounded-b-md shadow-md">
                                        {rincianbiayaperm &&
                                            rincianbiayaperm.drincianbiayaperms.map(
                                                (item, index: number) => {
                                                    if (
                                                        item
                                                            .itemrincianbiayaperm
                                                            .jenis_itemrincianbiayaperm ===
                                                        "piutang"
                                                    ) {
                                                        return (
                                                            <li
                                                                key={item.id}
                                                                className="w-full flex flex-col overflow-hidden bg-lightBlue-300"
                                                            >
                                                                <div className="flex w-full gap-1 text-xs px-2 py-1 items-center justify-start text-lightBlue-900 border-b-2 border-lightBlue-200">
                                                                    <div className="pb-0 w-[5%]">
                                                                        {index +
                                                                            1}
                                                                        .
                                                                    </div>
                                                                    <div className="pb-0 w-[35%] md:w-[35%]">
                                                                        {
                                                                            item
                                                                                .itemrincianbiayaperm
                                                                                .nama_itemrincianbiayaperm
                                                                        }
                                                                    </div>
                                                                    <div className="pb-0 hidden md:block md:w-[40%]">
                                                                        {
                                                                            item.ket_biaya
                                                                        }
                                                                    </div>
                                                                    <div className="pb-0 w-[15%] text-right pr-2">
                                                                        {
                                                                            item.jumlah_biaya
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    }
                                                }
                                            )}
                                    </ul>

                                    <ul className="list-none container-snap max-h-80 overflow-x-hidden rounded-b-md shadow-md">
                                        <li className="w-full flex flex-col overflow-hidden bg-lightBlue-600 px-2 py-1  font-semibold text-lightBlue-50">
                                            <div className="flex w-full gap-1 text-xs px-2 py-1 items-center justify-start border-b-2 border-lightBlue-500">
                                                <div className="w-[60%]"></div>
                                                <div className="hidden md:block md:w-[20%] text-right">
                                                    Total Pemasukan
                                                </div>
                                                <div className="w-[15%] text-right">
                                                    {
                                                        rincianbiayaperm.total_pemasukan
                                                    }
                                                </div>
                                            </div>
                                            <div className="flex w-full gap-1 text-xs px-2 py-1 items-center justify-start border-b-2 border-lightBlue-500">
                                                <div className="w-[60%]"></div>
                                                <div className="hidden md:block md:w-[20%] text-right">
                                                    Total Pengeluaran
                                                </div>
                                                <div className="w-[15%] text-right">
                                                    {
                                                        rincianbiayaperm.total_pengeluaran
                                                    }
                                                </div>
                                            </div>
                                            <div className="flex w-full gap-1 text-xs px-2 py-1 items-center justify-start border-b-2 border-lightBlue-500">
                                                <div className="w-[60%]"></div>
                                                <div className="hidden md:block md:w-[20%] text-right">
                                                    Total Piutang
                                                </div>
                                                <div className="w-[15%] text-right">
                                                    {
                                                        rincianbiayaperm.total_piutang
                                                    }
                                                </div>
                                            </div>
                                            <div className="flex w-full gap-1 text-xs px-2 py-1 items-center justify-start border-b-2 border-lightBlue-500">
                                                <div className="w-[60%]"></div>
                                                <div className="hidden md:block md:w-[20%] text-right">
                                                    Total Bayar
                                                </div>
                                                <div className="w-[15%] text-right">
                                                    {
                                                        rincianbiayaperm.sisa_saldo
                                                    }
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            )
                        )}
                </div>
            </div>
        </Modal>
    );
};

export default ModalRincianbiayaperms;
