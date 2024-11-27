import ModalCetakLaporan from "@/Components/Modals/ModalCetakLaporan";
import SelectSearch from "@/Components/Shared/SelectSearch";
import AdminLayout from "@/Layouts/AdminLayout";
import { BiayapermStatus, OptionSelect } from "@/types";
import { Link, router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useEffect, useState } from "react";
import { usePrevious } from "react-use";
type Props = {
    biayaperms: {
        data: BiayapermStatus[] | [];
        links: {
            first: string;
            last: string;
            prev: string;
            next: string;
        };
    };

    lunas: string;
    lunasOpts: OptionSelect[] | [];
    user_id: string;
    userOpts: OptionSelect[] | [];
};

const StatusBiayaperm = ({
    biayaperms: {
        data,
        links: { first, last, prev, next },
    },
    lunas,
    lunasOpts,
    user_id,
    userOpts,
}: Props) => {
    const [values, setValues] = useState({ lunas: lunas, user_id: user_id });
    const clunas = lunasOpts.find((e) => e.value == values.lunas);
    const cuser = userOpts.find((e) => e.value == values.user_id);
    const [curLunas, setCurLunas] = useState<OptionSelect | null>(
        clunas ? clunas : null
    );
    const [curUser, setCurUser] = useState<OptionSelect | null>(
        cuser ? cuser : null
    );
    const [showModalLaporan, setShowModalLaporan] = useState<boolean>(false);
    const [url, setUrl] = useState<any>();

    const prevValues = usePrevious(values);
    useEffect(() => {
        if (prevValues) {
            const query = Object.keys(pickBy(values)).length
                ? pickBy(values)
                : {};
            router.get(
                route(route().current() ? route().current() + "" : ""),
                query,
                {
                    replace: true,
                    preserveState: true,
                }
            );
        }
    }, [values]);

    const handlePrint = () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get("page") ? params.get("page") : 1;
        const lunas = params.get("lunas") ? params.get("lunas") : 0;
        const user_id = params.get("user_id") ? params.get("user_id") : null;
        setUrl(
            route(route().current() + "") +
                `?lunas=${lunas}&page=${page}&media=print${
                    user_id ? "&user_id=" + user_id : ""
                }`
        );
        setShowModalLaporan(true);
    };
    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center relative -top-2">
                <div className="w-full px-2">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-100 border-0">
                        <div className="rounded-t mb-2 px-4 pt-4 ">
                            <div className="w-full flex  justify-between bg-lightBlue-800 text-lightBlue-100 px-2 py-2 shadow-md rounded-lg">
                                <div className="text-left">
                                    <h1 className="font-semibold">
                                        BIAYA PERMOHONAN
                                    </h1>
                                </div>
                                <div className="w-1/2 lg:w-1/2 text-blueGray-800 flex flex-col md:flex-row justify-between items-center gap-2">
                                    <SelectSearch
                                        name="lunas"
                                        value={curUser}
                                        options={userOpts}
                                        placeholder="Pilih Petugas"
                                        onChange={(e: any) => {
                                            setValues((prev) => ({
                                                ...prev,
                                                user_id: e.value,
                                            }));
                                            setCurUser(e ? e : {});
                                        }}
                                    />

                                    <SelectSearch
                                        name="lunas"
                                        value={curLunas}
                                        options={lunasOpts}
                                        placeholder="Pilih Status"
                                        onChange={(e: any) => {
                                            setValues((prev) => ({
                                                ...prev,
                                                lunas: e.value,
                                            }));
                                            setCurLunas(e ? e : {});
                                        }}
                                    />
                                    <button
                                        onClick={(e) => {
                                            handlePrint();
                                        }}
                                        className="text-lightBlue-300 background-transparent font-bold uppercase px-3 py-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                    >
                                        <i className="fas fa-print"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex-auto px-2 lg:px-4 py-6 pt-0">
                            {data.length > 0 ? (
                                <div className="p-1 w-full flex-col">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-y-2 font-semibold bg-slate-300">
                                                <td
                                                    className="pl-2"
                                                    width="10%"
                                                >
                                                    No Daftar
                                                </td>
                                                <td width="10%">Tanggal</td>
                                                <td width="10%" align="left">
                                                    Transaksi
                                                </td>
                                                <td width="30%" align="left">
                                                    Permohonan
                                                </td>
                                                <td
                                                    className="pl-2"
                                                    width="10%"
                                                    align="left"
                                                >
                                                    Petugas
                                                </td>
                                                <td width="10%" align="right">
                                                    Jumlah Biaya
                                                </td>
                                                <td width="10%" align="right">
                                                    Jumlah Bayar
                                                </td>
                                                <td
                                                    className="pr-2 py-2"
                                                    width="10%"
                                                    align="right"
                                                >
                                                    Kurang Bayar
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((biayaperm, i) => (
                                                <tr
                                                    key={i}
                                                    className="border-b-2"
                                                >
                                                    <td className="pl-2">
                                                        {biayaperm.no_daftar}
                                                    </td>
                                                    <td>
                                                        {
                                                            biayaperm.tgl_biayaperm
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            biayaperm.nama_jenispermohonan
                                                        }
                                                    </td>
                                                    <td>
                                                        {biayaperm.permohonan}
                                                    </td>
                                                    <td className="pl-2">
                                                        {biayaperm.users.map(
                                                            (user, i) => {
                                                                return (
                                                                    <span
                                                                        className="text-blue-600 bg-sky-200 font-bold text-xs px-2 py-1 rounded-full"
                                                                        key={i}
                                                                    >
                                                                        {
                                                                            user.name
                                                                        }
                                                                    </span>
                                                                );
                                                            }
                                                        )}
                                                    </td>
                                                    <td align="right">
                                                        {
                                                            biayaperm.jumlah_biayaperm
                                                        }
                                                    </td>
                                                    <td align="right">
                                                        {biayaperm.jumlah_bayar}
                                                    </td>
                                                    <td
                                                        className="pr-2"
                                                        align="right"
                                                    >
                                                        {biayaperm.kurang_bayar}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        {/* <tfoot>
                                            <tr className="font-semibold border-b-2 bg-slate-300">
                                                <td width="10%">&nbsp;</td>
                                                <td width="50%">Total</td>
                                                <td width="20%" align="right">
                                                    {totDebet}
                                                </td>
                                                <td width="20%" align="right">
                                                    {totKredit}
                                                </td>
                                            </tr>
                                        </tfoot> */}
                                    </table>
                                    <div className="w-full mt-4 flex justify-end items-start">
                                        <div className="w-36 grid grid-cols-2 gap-2 ">
                                            <Link
                                                href={prev}
                                                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-2 py-1 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="Link"
                                            >
                                                <i
                                                    className="fa fa-chevron-left"
                                                    aria-hidden="true"
                                                ></i>{" "}
                                                Prev
                                            </Link>
                                            <Link
                                                href={next}
                                                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-2 py-1 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="Link"
                                            >
                                                <i
                                                    className="fa fa-chevron-right"
                                                    aria-hidden="true"
                                                ></i>{" "}
                                                Next
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <ModalCetakLaporan
                showModal={showModalLaporan}
                setShowModal={setShowModalLaporan}
                src={url}
            />
        </AdminLayout>
    );
};

export default StatusBiayaperm;
