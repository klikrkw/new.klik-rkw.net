import ModalCetakLaporan from "@/Components/Modals/ModalCetakLaporan";
import SelectSearch from "@/Components/Shared/SelectSearch";
import AdminLayout from "@/Layouts/AdminLayout";
import { OptionSelect } from "@/types";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useEffect, useState } from "react";
import { usePrevious } from "react-use";
type Props = {
    neracas: never[] | undefined;
    totDebet: string | undefined;
    totKredit: string | undefined;
    year: string;
    yearOpts: OptionSelect[] | [];
};

const Neraca = ({ neracas, totDebet, totKredit, year, yearOpts }: Props) => {
    const [values, setValues] = useState({ year: year });
    const cyear = yearOpts.find((e) => e.value == values.year);
    const [curYear, setCurYear] = useState<OptionSelect | null>(
        cyear ? cyear : null
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
        // const params = new URLSearchParams(window.location.search);
        setUrl(route(route().current() + "") + `?year=${year}&media=print`);
        setShowModalLaporan(true);
        console.log(
            route(route().current() + "") + `?year=${year}&media=print`
        );
    };

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center relative -top-2">
                <div className="w-full px-2">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-100 border-0">
                        <div className="rounded-t mb-2 px-4 pt-4 ">
                            <div className="w-full flex flex-col gap-2 md:flex-row justify-between bg-lightBlue-800 text-lightBlue-100 px-2 py-2 shadow-md rounded-lg">
                                <div className="text-left w-full md:w-1/3">
                                    <h1 className="font-semibold">NERACA</h1>
                                </div>
                                <div className="w-full md:w-1/2 text-blueGray-800 flex flex-row justify-between items-center gap-2">
                                    <SelectSearch
                                        name="year"
                                        value={curYear}
                                        options={yearOpts}
                                        placeholder="Pilih Tahun"
                                        onChange={(e: any) => {
                                            setValues((prev) => ({
                                                ...prev,
                                                year: e.value,
                                            }));
                                            setCurYear(e ? e : {});
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
                            {neracas ? (
                                <div className="p-1 w-full flex-col">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-y-2 font-semibold bg-slate-300">
                                                <td width="10%">Kode</td>
                                                <td width="50%">Nama Akun</td>
                                                <td width="20%" align="right">
                                                    Debet
                                                </td>
                                                <td width="20%" align="right">
                                                    Kredit
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {neracas.map((neraca, i) => (
                                                <tr
                                                    key={i}
                                                    className="border-b-2"
                                                >
                                                    {Object.keys(neraca).map(
                                                        (item, idx) => (
                                                            <td
                                                                className={`${
                                                                    idx > 1
                                                                        ? "text-right"
                                                                        : ""
                                                                }`}
                                                                key={idx}
                                                            >
                                                                {neraca[item]}
                                                            </td>
                                                        )
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
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
                                        </tfoot>
                                    </table>
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

export default Neraca;
