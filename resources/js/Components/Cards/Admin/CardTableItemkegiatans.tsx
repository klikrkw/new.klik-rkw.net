import React, { useEffect, useState } from "react";
import { Itemkegiatan } from "@/types";
import { twMerge } from 'tailwind-merge'
import { Link, router } from "@inertiajs/react";
import { usePrevious } from "react-use";
import { pickBy } from "lodash";
import useSwal from "@/utils/useSwal";
import Pagination from "../../Shared/Pagination";
import InputSearch from "../../Shared/InputSearch";
import LinkButton from "../../Shared/LinkButton";
import AsyncSelectSearch from "@/Components/Shared/AsyncSelectSearch";

// components
export default function CardTableItemkegiatans({ color = "light", itemkegiatans, className = "", meta, labelLinks }: { color: "dark" | "light", itemkegiatans: Itemkegiatan[], className?: string, meta: { links: [], per_page: number, total: number }, labelLinks: any }) {
    const params = new URLSearchParams(window.location.search);
    const [values, setValues] = useState({ search: params.get('search'), sortBy: params.get('sortBy'), sortDir: params.get('sortDir') });
    const prevValues = usePrevious(values);


    function handleSortLinkClick({ sortBy, sortDir }: { sortBy: string, sortDir: string }) {
        setValues(values => ({ ...values, sortBy, sortDir }));

    }
    const IconSort = ({ sortBy, sortDir }: { sortBy: any, sortDir: string }) => {
        if (values.sortBy === sortBy && sortDir === 'asc') {
            return <i className="fa-solid fa-sort-up"></i>
        } else if (values.sortBy === sortBy && sortDir === 'desc') {
            return <i className="fa-solid fa-sort-down"></i>
        }
        return <i className="fa-solid fa-sort"></i>
    }

    const handleRemoveData = (id: string) => {
        router.delete(route('admin.itemkegiatans.destroy', id))
    }

    useEffect(() => {
        // https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state

        if (prevValues) {
            const query = Object.keys(pickBy(values)).length
                ? pickBy(values)
                : {};
            router.get(route(route().current() ? route().current() + '' : ''), query, {
                replace: true,
                preserveState: true
            });
        }
    }, [values]);

    return (
        <>
            <div
                className={
                    twMerge("relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-700 rounded-md py-1 ",
                        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"), className)
                }
            >
                <div className="rounded-full mb-0 px-4 py-3 border-0 ">
                    <div className="flex justify-between w-full flex-col md:flex-row">
                        <div className="relative w-full max-w-full flex-grow flex-1 ">
                            <h3
                                className={
                                    "font-semibold text-lg " +
                                    (color === "light" ? "text-blueGray-700" : "text-white")
                                }
                            >
                                Item Kegiatan List
                            </h3>
                        </div>
                        <div className="flex justify-center gap-2 flex-row items-start">
                            <InputSearch value={values.search ? values.search : ""} onChange={(e: any) => setValues(v => ({ ...v, search: e.target.value }))} />
                            <LinkButton
                                theme='blue'
                                href={route('admin.itemkegiatans.create')}
                            >
                                <span className="flex items-center gap-1"><i className="fa-solid fa-plus"></i> Tambah</span>
                            </LinkButton>
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                            <tr>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <Link href="#" onClick={(e) => handleSortLinkClick({ sortBy: 'id', sortDir: values.sortDir === 'asc' ? 'desc' : 'asc' })} >
                                        <div className="flex flex-row justify-between">
                                            <span>Id</span>
                                            <IconSort sortBy='id' sortDir={values.sortDir || ''} />
                                        </div>
                                    </Link>
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <Link href="#" onClick={(e) => handleSortLinkClick({ sortBy: 'nama_itemkegiatan', sortDir: values.sortDir === 'asc' ? 'desc' : 'asc' })} >
                                        <div className="flex flex-row justify-between">
                                            <span>Nama Item Kegiatan</span>
                                            <IconSort sortBy='nama_itemkegiatan' sortDir={values.sortDir || ''} />
                                        </div>
                                    </Link>
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <div className="flex flex-row justify-between">
                                        <span>Instansi</span>
                                    </div>
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <div className="flex flex-row justify-between">
                                        <span>Akun</span>
                                    </div>
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <span>Grup Item</span>
                                </th>
                                <th className={
                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }>
                                    Options
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                itemkegiatans.map(({ id, nama_itemkegiatan, grupitemkegiatans, instansi, akun }, index) => (
                                    <tr key={index}>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {id}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            <i className="fas fa-circle text-orange-500 mr-2"></i> {nama_itemkegiatan}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {instansi.nama_instansi}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {akun.nama_akun}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            <ul className="list-none flex gap-2">
                                                {grupitemkegiatans && grupitemkegiatans.map((item, i) => (
                                                    <li className="rounded-full text-xs py-1 px-2 bg-lightBlue-800 text-lightBlue-200 border-lightBlue-700" key={item.id}>{item.nama_grupitemkegiatan}</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 ">
                                            <div className="flex justify-start gap-1 ">
                                                <Link href={route('admin.itemkegiatans.edit', id)} className="text-lightBlue-500 background-transparent font-bold px-3 py-1 text-xs outline-none focus:outline-none hover:text-lightBlue-100 hover:scale-105 mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={(e) => useSwal.confirm({
                                                        title: 'Hapus Data', text: 'apakah akan menghapus?'
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            handleRemoveData(id)
                                                        }
                                                    })}
                                                    className="text-lightBlue-500 background-transparent font-bold px-3 py-1 text-xs outline-none focus:outline-none hover:text-lightBlue-100 hover:scale-105 mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {meta.total > meta.per_page ?
                    <div className={"flex justify-end px-2 py-1  " + (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>
                        <Pagination links={meta.links} labelLinks={labelLinks} />
                    </div>
                    : null}
            </div >
        </>
    );
}

