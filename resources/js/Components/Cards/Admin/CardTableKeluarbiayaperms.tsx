import {
    OptionSelect,
    Biayaperm,
    OptionSelectDisabled,
    KeluarBiayaperm,
    Transpermohonan,
    Dkeluarbiayapermuser,
    DkeluarbiayapermuserStaf,
} from "@/types";
import React, { useEffect, useState } from "react";
import apputils from "@/bootstrap";
import { router } from "@inertiajs/react";
import useSwal from "@/utils/useSwal";
import {
    ChevronDoubleLeftIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    TrashIcon,
} from "@heroicons/react/20/solid";
import { Bars, Grid, ThreeDots } from "react-loader-spinner";
import Button from "@/Components/Shared/Button";
import { Tab } from "@headlessui/react";
import LinkButton from "@/Components/Shared/LinkButton";
import ModalKeluarBiayaperm from "@/Components/Modals/ModalKeluarBiayaperm";
import SubCardNeracaTableKeluarBiayaPermUser from "./SubCard/SubCardNeracaTblKeluarBiayaPermUser";
import { Lightbox } from "react-modal-image";

type Props = {
    transpermohonan: Transpermohonan;
};
function CardTableKeluarbiayaperms({ transpermohonan }: Props) {
    const [keluarbiayaperms, setKeluarbiayaperms] =
        useState<KeluarBiayaperm[]>();
    const [keluarbiayapermusers, setKeluarbiayapermusers] =
        useState<DkeluarbiayapermuserStaf[]>();
    const [isloading, setIsloading] = useState(false);
    const [isloadingTotal, setIsloadingTotal] = useState(false);
    const [isloadingNeraca, setIsloadingNeraca] = useState(false);
    const [totalPengeluaran, setTotalPengeluaran] = useState(null);
    const [nextLink, setNextLink] = useState(null);
    const [prevLink, setPrevLink] = useState(null);
    const [totalPengeluaranUser, setTotalPengeluaranUser] = useState(null);
    const [nextLinkUser, setNextLinkUser] = useState(null);
    const [prevLinkUser, setPrevLinkUser] = useState(null);
    const [neracas, setNeracas] = useState<never[]>();
    const [totDebet, setTotDebet] = useState<string>();
    const [totKredit, setTotKredit] = useState<string>();

    const handleRemoveData = (id: string) => {
        router.delete(route("transaksi.keluarbiayaperms.destroy", id));
    };
    const [showModalKeluarbiayaperm, setShowModalKeluarbiayaperm] =
        useState(false);
    const [viewImage, setViewImage] = useState<boolean>(false);
    const [image, setImage] = useState<string | null>(null);

    const getKeluarbiayaperms = async (
        transpermohonan_id: string,
        link = null
    ) => {
        setIsloading(true);
        let xlink = `/transaksi/keluarbiayaperms/api/list?transpermohonan_id=${transpermohonan_id}`;
        if (link) {
            xlink = link;
        }
        const response = await apputils.backend.get(xlink);
        const data = response.data;
        setNextLink(data.links.next);
        setPrevLink(data.links.prev);
        setKeluarbiayaperms(data.data);
        setIsloading(false);
    };
    const getTotalPengeluaran = async (transpermohonan_id: string) => {
        setIsloadingTotal(true);
        let xlink = `/transaksi/keluarbiayaperms/api/totalpengeluaran?transpermohonan_id=${transpermohonan_id}`;
        const response = await apputils.backend.get(xlink);
        const data = response.data;
        setTotalPengeluaran(data);
        setIsloadingTotal(false);
    };

    const getKeluarbiayapermusers = async (
        transpermohonan_id: string,
        link = null
    ) => {
        setIsloading(true);
        let xlink = `/transaksi/dkeluarbiayapermusers/api/list?transpermohonan_id=${transpermohonan_id}`;
        if (link) {
            xlink = link;
        }
        const response = await apputils.backend.get(xlink);
        const data = response.data;
        setNextLinkUser(data.links.next);
        setPrevLinkUser(data.links.prev);
        setKeluarbiayapermusers(data.data);
        setIsloading(false);
    };
    const getTotalPengeluaranusers = async (transpermohonan_id: string) => {
        setIsloadingTotal(true);
        let xlink = `/transaksi/dkeluarbiayapermusers/api/totalpengeluaran?transpermohonan_id=${transpermohonan_id}`;
        const response = await apputils.backend.get(xlink);
        const data = response.data;
        setTotalPengeluaranUser(data);
        // setIsloadingTotal(false)
    };

    const getNeracas = async (transpermohonan_id: string) => {
        setIsloadingNeraca(true);
        let xlink = `/transaksi/jurnalumums/api/neracapermohonan?transpermohonan_id=${transpermohonan_id}`;
        const response = await apputils.backend.get(xlink);
        const data = response.data;
        setNeracas(data.neracas);
        setTotDebet(data.totDebet);
        setTotKredit(data.totKredit);
        setIsloadingNeraca(false);
    };

    useEffect(() => {
        if (transpermohonan) {
            Promise.all([
                getKeluarbiayaperms(transpermohonan.id),
                getTotalPengeluaran(transpermohonan.id),
                getKeluarbiayapermusers(transpermohonan.id),
                getTotalPengeluaranusers(transpermohonan.id),
                getNeracas(transpermohonan.id),
            ]);
        }
    }, [transpermohonan]);

    // const doTotalKeluarbiayaperm = () => {
    //     const total = keluarbiayaperms ? keluarbiayaperms.reduce((prev, val) => {
    //         return prev += val.jumlah_keluarbiayaperm
    //     }, 0) : 0
    //     setTotalKeluarbiayaperm(total)
    // }
    function classNames(...classes: any) {
        return classes.filter(Boolean).join(" ");
    }
    return (
        <div className="w-full px-1 py-1 sm:px-0">
            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-2">
                    {/* <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                selected
                                    ? 'bg-white text-blue-700 shadow'
                                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                            )
                        }
                    >
                        Pengeluaran
                    </Tab> */}
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                                "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                selected
                                    ? "bg-white text-blue-700 shadow"
                                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                            )
                        }
                    >
                        Pengeluaran Biaya
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                                "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                selected
                                    ? "bg-white text-blue-700 shadow"
                                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                            )
                        }
                    >
                        Neraca
                    </Tab>
                </Tab.List>
                <Tab.Panels className="mt-2">
                    <Tab.Panel
                        className={
                            "rounded-xl bg-white p-3 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                        }
                    >
                        <ul>
                            <li className="relative rounded-md py-1 px-2 hover:bg-gray-100">
                                {/* pengeluaran user */}
                                <div className="w-full mt-2 flext flex-col">
                                    <div className="flex flex-row w-full px-4 justify-center items-center rounded-t-md text-xs bg-lightBlue-600 border-blueGray-400 py-2  text-lightBlue-50 font-semibold">
                                        <div className="w-[5%]">No</div>
                                        <div className="w-[15%]">Tanggal</div>
                                        <div className="w-[30%] md:w-[13%]">
                                            Instansi
                                        </div>
                                        <div className="w-[30%] md:w-[10%]">
                                            Metode
                                        </div>
                                        <div className="w-[35%] md:w-[15%]">
                                            Item Kegiatan
                                        </div>
                                        <div className="hidden md:flex md:w-[15%]">
                                            Ket Biaya
                                        </div>
                                        <div className="hidden md:flex md:w-[10%]">
                                            Image
                                        </div>
                                        <div className="md:block w-[15%]">
                                            Jumlah Biaya
                                        </div>
                                        <div className="w-[35%] md:w-[12%]">
                                            User
                                        </div>
                                    </div>
                                    <ul className="list-none container-snap max-h-80 overflow-x-hidden rounded-b-md">
                                        {isloading && (
                                            <div className="m-auto h-24 w-full flex justify-center items-center absolute">
                                                <ThreeDots
                                                    visible={true}
                                                    height="80"
                                                    width="80"
                                                    color="#4fa94d"
                                                    radius="9"
                                                    ariaLabel="three-dots-loading"
                                                    wrapperStyle={{}}
                                                    wrapperClass=""
                                                />
                                            </div>
                                        )}
                                        {keluarbiayapermusers &&
                                            keluarbiayapermusers.map(
                                                (
                                                    dkeluarbiayapermuser: DkeluarbiayapermuserStaf,
                                                    index: number
                                                ) => (
                                                    <li
                                                        key={
                                                            dkeluarbiayapermuser.id
                                                        }
                                                        className="w-full flex flex-col overflow-hidden bg-lightBlue-100 px-4 border-b-2 border-lightBlue-200"
                                                    >
                                                        <div className="flex text-xs py-1 items-center justify-center font-semibold text-lightBlue-600 ">
                                                            <div className="w-[5%] ">
                                                                {index + 1}
                                                            </div>
                                                            <div className="w-[15%]">
                                                                {
                                                                    dkeluarbiayapermuser.created_at
                                                                }
                                                            </div>
                                                            <div className="w-[30% md:w-[13%]">
                                                                {
                                                                    dkeluarbiayapermuser
                                                                        .instansi
                                                                        .nama_instansi
                                                                }
                                                            </div>
                                                            <div className="w-[30%] md:w-[10%]">
                                                                {
                                                                    dkeluarbiayapermuser
                                                                        .metodebayar
                                                                        .nama_metodebayar
                                                                }
                                                            </div>
                                                            <div className="w-[35%] md:w-[15%]">
                                                                {
                                                                    dkeluarbiayapermuser
                                                                        .itemkegiatan
                                                                        .nama_itemkegiatan
                                                                }
                                                            </div>
                                                            <div className="md:block md:w-[15%]">
                                                                {
                                                                    dkeluarbiayapermuser.ket_biaya
                                                                }
                                                            </div>
                                                            <div className="hidden md:block md:w-[9%]">
                                                                {dkeluarbiayapermuser.image_dkeluarbiayapermuser && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setImage(
                                                                                dkeluarbiayapermuser.image_dkeluarbiayapermuser
                                                                            );
                                                                            setViewImage(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        <i
                                                                            className={
                                                                                "fas fa-image mr-2 text-sm cursor-pointer"
                                                                            }
                                                                        ></i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className="w-[35%] md:w-[15%]">
                                                                {
                                                                    dkeluarbiayapermuser.jumlah_biaya
                                                                }
                                                            </div>
                                                            <div className="hidden md:flex md:w-[12%]">
                                                                <span>
                                                                    {
                                                                        dkeluarbiayapermuser
                                                                            .user
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            )}
                                    </ul>
                                </div>
                                <div className="flex justify-end items-center gap-2 mt-2">
                                    {isloadingTotal && (
                                        <div className="m-auto h-16 w-full flex justify-center items-center absolute">
                                            <ThreeDots
                                                visible={true}
                                                height="80"
                                                width="80"
                                                color="#4fa94d"
                                                radius="9"
                                                ariaLabel="three-dots-loading"
                                                wrapperStyle={{}}
                                                wrapperClass=""
                                            />
                                        </div>
                                    )}
                                    <div className="w-[79%] flex justify-between text-xs font-bold gap-2 text-blueGray-500">
                                        <span className="flex justify-start items-center">
                                            <LinkButton
                                                href="#"
                                                theme="black"
                                                className="shrink-0 py-1 mt-0 mb-0 text-xs"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setShowModalKeluarbiayaperm(
                                                        true
                                                    );
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="hidden md:block w-4 h-4 text-sm mr-1 "
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                                                    />
                                                </svg>
                                                <span> Tambah</span>
                                            </LinkButton>
                                        </span>
                                        {totalPengeluaranUser ? (
                                            <span className="flex items-center">
                                                Total : {totalPengeluaranUser}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="w-[30%] md:w-[21%] flex justify-end items-center">
                                        {prevLinkUser ? (
                                            <button
                                                className="text-lightBlue-500 background-transparent font-bold uppercase px-2 py-1 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={(e) =>
                                                    getKeluarbiayapermusers(
                                                        transpermohonan.id,
                                                        prevLinkUser
                                                    )
                                                }
                                            >
                                                <i
                                                    className="fa fa-chevron-left"
                                                    aria-hidden="true"
                                                ></i>
                                            </button>
                                        ) : (
                                            <span className="text-blueGray-500 background-transparent font-bold uppercase px-2 py-1 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                                                <i
                                                    className="fa fa-chevron-left"
                                                    aria-hidden="true"
                                                ></i>
                                            </span>
                                        )}

                                        {nextLinkUser ? (
                                            <button
                                                className="text-lightBlue-500 background-transparent font-bold uppercase px-2 py-1 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={(e) =>
                                                    getKeluarbiayapermusers(
                                                        transpermohonan.id,
                                                        nextLinkUser
                                                    )
                                                }
                                            >
                                                <i
                                                    className="fa fa-chevron-right"
                                                    aria-hidden="true"
                                                ></i>
                                            </button>
                                        ) : (
                                            <span className="text-blueGray-500 background-transparent font-bold uppercase px-2 py-1 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                                                <i
                                                    className="fa fa-chevron-right"
                                                    aria-hidden="true"
                                                ></i>
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* end pengeluaran user*/}
                            </li>
                        </ul>
                    </Tab.Panel>
                    <Tab.Panel
                        className={
                            "rounded-xl bg-white p-3 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                        }
                    >
                        <SubCardNeracaTableKeluarBiayaPermUser
                            transpermohonan_id={transpermohonan.id}
                            neracas={neracas}
                            totDebet={totDebet}
                            totKredit={totKredit}
                        />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
            {transpermohonan && (
                <>
                    <ModalKeluarBiayaperm
                        transpermohonan={transpermohonan}
                        showModal={showModalKeluarbiayaperm}
                        setShowModal={setShowModalKeluarbiayaperm}
                    />
                </>
            )}
            {viewImage && (
                <Lightbox
                    small={image ? image : ""}
                    medium={image ? image : ""}
                    large={image ? image : ""}
                    alt="View Image"
                    onClose={() => setViewImage(false)}
                />
            )}
        </div>
    );
}

export default CardTableKeluarbiayaperms;
