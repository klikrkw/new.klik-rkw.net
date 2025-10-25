import React, { useEffect, useState } from "react";
import {
    Dkeluarbiaya,
    Keluarbiaya,
    Keluarbiayapermuser,
    OptionSelect,
} from "@/types";
import { twMerge } from "tailwind-merge";
import { Link, router, usePage } from "@inertiajs/react";
import { usePrevious } from "react-use";
import { pickBy } from "lodash";
import Pagination from "../../Shared/Pagination";
import InputSearch from "../../Shared/InputSearch";
import LinkButton from "../../Shared/LinkButton";
import useSwal from "@/utils/useSwal";
import DropdownMenu from "@/Components/Shared/DropdownMenu";
import { Menu } from "@headlessui/react";
import { EditActiveIcon, EditInactiveIcon } from "@/Components/Icon";
import AsyncSelectSearch from "@/Components/Shared/AsyncSelectSearch";
import SelectSearch from "@/Components/Shared/SelectSearch";
import DateRangeInput from "@/Components/Shared/DateRangeInput";
import moment from "moment";
import { DateRange } from "react-number-format/types/types";
import { Lightbox } from "react-modal-image";

// components
export default function CardTableInfoKeluarbiayas({
    color = "light",
    dkeluarbiayas,
    className = "",
    meta,
    labelLinks,
}: {
    color: "dark" | "light";
    dkeluarbiayas: Dkeluarbiaya[];
    className?: string;
    meta: { links: []; per_page: number; total: number };
    labelLinks: any;
}) {
    const {
        isAdmin,
        user,
        base_route,
        itemkegiatanOpts,
        period,
        date1,
        date2,
        periodOpts,
    } = usePage<{
        isAdmin: boolean;
        user: OptionSelect;
        base_route: string;
        itemkegiatanOpts: OptionSelect[] | [];
        periodOpts: OptionSelect[] | [];
        period: string;
        date1: string;
        date2: string;
    }>().props;

    const params = new URLSearchParams(window.location.search);
    const [values, setValues] = useState({
        search: params.get("search"),
        sortBy: params.get("sortBy"),
        sortDir: params.get("sortDir"),
        itemkegiatan_id: params.get("itemkegiatan_id"),
        period: period,
        date1: params.get("date1") ? params.get("date1") : date1,
        date2: params.get("date2") ? params.get("date2") : date2,
    });
    const prevValues = usePrevious(values);

    function handleSortLinkClick({
        sortBy,
        sortDir,
    }: {
        sortBy: string;
        sortDir: string;
    }) {
        setValues((values) => ({ ...values, sortBy, sortDir }));
    }
    const IconSort = ({
        sortBy,
        sortDir,
    }: {
        sortBy: any;
        sortDir: string;
    }) => {
        if (values.sortBy === sortBy && sortDir === "asc") {
            return <i className="fa-solid fa-sort-up"></i>;
        } else if (values.sortBy === sortBy && sortDir === "desc") {
            return <i className="fa-solid fa-sort-down"></i>;
        }
        return <i className="fa-solid fa-sort"></i>;
    };

    // const handleRemoveData = (id: string) => {
    //     router.delete(route('transaksi.dkeluarbiayas.destroy', id))
    // }

    const citemkegiatan = itemkegiatanOpts.find(
        (e) => e.value == values.itemkegiatan_id
    );
    const [curItemkegiatan, setCurItemkegiatan] = useState<OptionSelect | null>(
        citemkegiatan ? citemkegiatan : null
    );
    const cperiod = periodOpts.find((e) => e.value == values.period);
    const [periode, setPeriode] = useState<OptionSelect | null>(
        cperiod ? cperiod : null
    );

    useEffect(() => {
        // https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state

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

    const handleDateChange = (dates: DateRange) => {
        // setDates((d: any) => ({ ...d, [field]: date }))
        setValues((v) => ({ ...v, date1: dates.date1, date2: dates.date2 }));
    };
    const [viewImage, setViewImage] = useState<boolean>(false);
    const [image, setImage] = useState<string | null>(null);

    return (
        <>
            <div
                className={twMerge(
                    "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-700 rounded-md py-1 ",
                    color === "light"
                        ? "bg-white"
                        : "bg-lightBlue-900 text-white",
                    className
                )}
            >
                <div className="rounded-full mb-0 px-4 py-3 border-0 ">
                    <div className="flex justify-between w-full flex-col">
                        <div className="relative w-full max-w-full flex-grow flex-1 ">
                            <h3
                                className={
                                    "font-semibold text-lg " +
                                    (color === "light"
                                        ? "text-blueGray-700"
                                        : "text-white")
                                }
                            >
                                PENGELUARAN BIAYA
                            </h3>
                        </div>
                        <div className="flex justify-center gap-2 flex-row items-start w-full">
                            {period === "tanggal" ? (
                                <DateRangeInput
                                    className="w-3/5"
                                    onDataChange={(d) => handleDateChange(d)}
                                    value={{
                                        date1: values.date1
                                            ? values.date1
                                            : moment().format("YYYY-MM-DD"),
                                        date2: values.date2
                                            ? values.date2
                                            : moment().format("YYYY-MM-DD"),
                                    }}
                                />
                            ) : (
                                <div className="w-3/5"></div>
                            )}
                            <SelectSearch
                                name="period"
                                value={periode}
                                options={periodOpts}
                                placeholder="Periode"
                                className="text-gray-800 w-1/3"
                                onChange={(e: any) => {
                                    setValues((prev) => ({
                                        ...prev,
                                        period: e.value,
                                    }));
                                    setPeriode(e ? e : {});
                                }}
                            />
                            <AsyncSelectSearch
                                placeholder="Pilih User"
                                value={user}
                                name="users"
                                url="/admin/users/api/list/"
                                onChange={(e: any) =>
                                    setValues((v) => ({
                                        ...v,
                                        user_id: e ? e.value : "",
                                    }))
                                }
                                isClearable
                                optionLabels={["name"]}
                                optionValue="id"
                                className="text-blueGray-800 w-1/3"
                            />

                            <SelectSearch
                                name="kegiatan"
                                className="text-gray-800 w-1/2"
                                value={citemkegiatan}
                                options={itemkegiatanOpts}
                                placeholder="Kegiatan"
                                onChange={(e: any) => {
                                    setValues((prev) => ({
                                        ...prev,
                                        itemkegiatan_id: e.value,
                                    }));
                                    setCurItemkegiatan(e ? e : {});
                                }}
                            />

                            <InputSearch
                                className="w-1/3"
                                value={values.search ? values.search : ""}
                                onChange={(e: any) =>
                                    setValues((v) => ({
                                        ...v,
                                        search: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                            <tr>
                                <th
                                    className={
                                        "px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <Link
                                        href="#"
                                        onClick={(e) =>
                                            handleSortLinkClick({
                                                sortBy: "dkeluarbiayas.created_at",
                                                sortDir:
                                                    values.sortDir === "asc"
                                                        ? "desc"
                                                        : "asc",
                                            })
                                        }
                                    >
                                        <div className="flex flex-row justify-between">
                                            <span>Tanggal</span>
                                            <IconSort
                                                sortBy="dkeluarbiayas.created_at"
                                                sortDir={values.sortDir || ""}
                                            />
                                        </div>
                                    </Link>
                                </th>
                                <th
                                    className={
                                        "px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <div className="flex flex-row justify-between">
                                        <span>Nama Kegiatan</span>
                                    </div>
                                </th>
                                <th
                                    className={
                                        "px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <div className="flex flex-row justify-between">
                                        <span>Rekening</span>
                                    </div>
                                </th>
                                <th
                                    className={
                                        "px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <Link
                                        href="#"
                                        onClick={(e) =>
                                            handleSortLinkClick({
                                                sortBy: "dkeluarbiayas.ket_biaya",
                                                sortDir:
                                                    values.sortDir === "asc"
                                                        ? "desc"
                                                        : "asc",
                                            })
                                        }
                                    >
                                        <div className="flex flex-row justify-between">
                                            <span>Keterangan</span>
                                            <IconSort
                                                sortBy="dkeluarbiayas.ket_biaya"
                                                sortDir={values.sortDir || ""}
                                            />
                                        </div>
                                    </Link>
                                </th>
                                <th
                                    className={
                                        "px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <div className="flex flex-row justify-between">
                                        <span>Image</span>
                                    </div>
                                </th>
                                <th
                                    className={
                                        "px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <div className="flex flex-row justify-between">
                                        <span>User</span>
                                    </div>
                                </th>

                                <th
                                    className={
                                        "px-3 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <div className="flex flex-row justify-end ">
                                        <span>Jumlah</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dkeluarbiayas.map(
                                (
                                    {
                                        id,
                                        created_at,
                                        itemkegiatan,
                                        keluarbiaya,
                                        ket_biaya,
                                        jumlah_biaya,
                                        image_dkeluarbiaya,
                                    },
                                    index
                                ) => (
                                    <tr key={index}>
                                        <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                                            {created_at}
                                        </td>
                                        <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                                            {itemkegiatan.nama_itemkegiatan}
                                        </td>
                                        <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                                            {
                                                keluarbiaya?.rekening
                                                    ?.nama_rekening
                                            }
                                        </td>
                                        <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                                            {ket_biaya}
                                        </td>
                                        <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                                            {image_dkeluarbiaya && (
                                                <button
                                                    onClick={() => {
                                                        setImage(
                                                            image_dkeluarbiaya
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
                                        <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                                            {keluarbiaya.user.name}
                                        </td>
                                        <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2 text-right">
                                            {jumlah_biaya}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
                {meta.total > meta.per_page ? (
                    <div
                        className={
                            "flex justify-end px-2 py-1  " +
                            (color === "light"
                                ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                        }
                    >
                        <Pagination
                            links={meta.links}
                            labelLinks={labelLinks}
                        />
                    </div>
                ) : null}
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
        </>
    );
}
