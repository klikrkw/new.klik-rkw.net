import Pagination from "@/Components/Shared/Pagination";
import useScreenSize from "@/Hooks/useScreenSize";
import { Dkeluarbiayapermuser, Keluarbiayapermuser } from "@/types";
import useSwal from "@/utils/useSwal";
import { router, usePage } from "@inertiajs/react";
import React from "react";

const CardDkeluarbiayapermuserList = ({
    keluarbiayapermuser,
}: {
    keluarbiayapermuser: Keluarbiayapermuser;
}) => {
    type Props = {
        dkeluarbiayapermusers: {
            data: Dkeluarbiayapermuser[];
            links: any;
            meta: {
                links: any;
            };
        };
    };
    const {
        dkeluarbiayapermusers: { data, links, meta },
    } = usePage<Props>().props;

    const handleRemoveData = (id: string) => {
        router.delete(
            route("admin.transaksi.dkeluarbiayapermusers.destroy", id)
        );
    };
    const screenSize = useScreenSize();
    const isMobile = screenSize.width < 768;

    return (
        <div className="w-full mt-4 flex flex-col mb-2">
            <ul className="list-none container-snap max-h-56 overflow-x-hidden">
                <li className="flex uppercase gap-1 flex-row w-full items-center rounded-t-md text-xs border justify-start bg-lightBlue-600 border-blueGray-400 px-2 py-2  text-lightBlue-50 font-semibold">
                    <div className="w-[5%]">No</div>
                    <div className="w-[35%]">Permohonan</div>
                    <div className="w-[30%] md:w-[20%]">Nama Kegiatan</div>
                    <div className="hidden md:block w-[20%]">Keterangan</div>
                    <div className="w-[20%] text-right pr-2">Jumlah</div>
                    <div className="w-[5%] text-center">
                        {isMobile ? "#" : "Menu"}
                    </div>
                </li>
            </ul>
            <ul className="list-none container-snap max-h-80 overflow-x-hidden rounded-b-md shadow-md">
                {data &&
                    data.map((item, index: number) => (
                        <li
                            key={item.id}
                            className="w-full flex flex-col overflow-hidden bg-lightBlue-300"
                        >
                            <div className="flex w-full gap-1 text-xs px-2 py-0 items-center justify-start text-lightBlue-900 border-b-2 border-lightBlue-200">
                                <div className="pb-1 w-[5%]">{index + 1}.</div>
                                <div className="pb-1 w-[35%]">
                                    {item.permohonan}
                                </div>
                                <div className="pb-1 w-[30%] md:w-[20%]">
                                    {item.nama_itemkegiatan}
                                </div>
                                <div className="pb-1 hidden md:block md:w-[20%]">
                                    {item.ket_biaya}
                                </div>
                                <div className="pb-1 w-[20%] text-right pr-2">
                                    {item.jumlah_biaya}
                                </div>
                                <div className="pb-1 w-[5%] flex justify-center items-center gap-2">
                                    <button
                                        disabled={
                                            keluarbiayapermuser.status_keluarbiayapermuser ==
                                            "approved"
                                        }
                                        onClick={(e) =>
                                            useSwal
                                                .confirm({
                                                    title: "Hapus Data",
                                                    text: "apakah akan menghapus?",
                                                })
                                                .then((result) => {
                                                    if (result.isConfirmed) {
                                                        handleRemoveData(
                                                            item.id
                                                        );
                                                    }
                                                })
                                        }
                                        className="text-lightBlue-500 background-transparent text-lg font-bold uppercase px-0 py-0 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                    >
                                        <i
                                            className="fa fa-trash"
                                            aria-hidden="true"
                                        ></i>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
            </ul>
            <ul className="list-none container-snap max-h-80 overflow-x-hidden rounded-b-md shadow-md">
                <li className="w-full flex flex-col overflow-hidden bg-lightBlue-600 px-2 py-1  font-semibold text-lightBlue-50">
                    <div className="flex w-full gap-1 text-xs px-2 py-1 items-center justify-start border-b-2 border-lightBlue-500">
                        <div className="w-[40%] md:w-[50%]"></div>
                        <div className="md:block w-[30%] md:w-[20%] text-right">
                            Total Biaya
                        </div>
                        <div className="w-[25%] text-right">
                            {keluarbiayapermuser.jumlah_biaya}
                        </div>
                        <div className="w-[5%] flex justify-start items-center gap-2"></div>
                    </div>
                    <div className="flex w-full gap-1 text-xs px-2 py-1 items-center justify-start border-b-2 border-lightBlue-500">
                        <div className="w-[40%] md:w-[50%]"></div>
                        <div className="md:block w-[30%] md:w-[20%] text-right">
                            Kasbon
                        </div>
                        <div className="w-[25%] text-right">
                            {keluarbiayapermuser.saldo_awal}
                        </div>
                        <div className="w-[5%] flex justify-start items-center gap-2"></div>
                    </div>
                    <div className="flex w-full gap-1 text-xs px-2 py-1 items-center justify-start border-b-2 border-lightBlue-500">
                        <div className="w-[40%] md:w-[50%]"></div>
                        <div className="md:block w-[30%] md:w-[20%] text-right">
                            Sisa Saldo
                        </div>
                        <div className="w-[25%] text-right">
                            {keluarbiayapermuser.saldo_akhir}
                        </div>
                        <div className="w-[5%] flex justify-start items-center gap-2"></div>
                    </div>
                </li>
            </ul>

            <Pagination links={meta.links} labelLinks={links} />
        </div>
    );
};

export default CardDkeluarbiayapermuserList;
