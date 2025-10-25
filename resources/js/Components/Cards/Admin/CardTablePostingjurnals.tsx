import React, { useEffect, useState } from "react";
import { OptionSelect, Postingjurnal } from "@/types";
import { twMerge } from "tailwind-merge";
import { Link, router, usePage } from "@inertiajs/react";
import { usePrevious } from "react-use";
import { pickBy } from "lodash";
import useSwal from "@/utils/useSwal";
import Pagination from "../../Shared/Pagination";
import InputSearch from "../../Shared/InputSearch";
import LinkButton from "../../Shared/LinkButton";
import { DateRange } from "react-number-format/types/types";
import SelectSearch from "@/Components/Shared/SelectSearch";
import DateRangeInput from "@/Components/Shared/DateRangeInput";
import moment from "moment";
import { Lightbox } from "react-modal-image";

// components
export default function CardTablePostingjurnals({
    color = "light",
    postingjurnals,
    className = "",
    meta,
    labelLinks,
}: {
    color: "dark" | "light";
    postingjurnals: Postingjurnal[];
    className?: string;
    meta: { links: []; per_page: number; total: number };
    labelLinks: any;
}) {
    const { periodOpts, period, date1, date2 } = usePage<{
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

    const handleRemoveData = (id: string) => {
        router.delete(route("admin.transaksi.postingjurnals.destroy", id));
    };

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
    const cperiod = periodOpts.find((e) => e.value == values.period);
    const [periode, setPeriode] = useState<OptionSelect | null>(
        cperiod ? cperiod : null
    );
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
                    <div className="flex justify-between w-full flex-col md:flex-row">
                        <div className="relative w-full md:w-1/3 max-w-full flex-grow flex-1 ">
                            <h3
                                className={
                                    "font-semibold text-lg " +
                                    (color === "light"
                                        ? "text-blueGray-700"
                                        : "text-white")
                                }
                            >
                                Posting Jurnal List
                            </h3>
                        </div>
                        <div className="flex flex-col justify-center gap-2 md:flex-row items-start w-full md:w-2/3">
                            <div className="w-full md:w-4/5  text-blueGray-800 flex flex-col md:flex-row justify-between items-center gap-2">
                                {period === "tanggal" ? (
                                    <DateRangeInput
                                        className="w-3/5"
                                        onDataChange={(d) =>
                                            handleDateChange(d)
                                        }
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
                                    <div className="w-4/5"></div>
                                )}

                                <SelectSearch
                                    name="period"
                                    className="w-full md:w-1/3"
                                    value={periode}
                                    options={periodOpts}
                                    placeholder="Periode"
                                    onChange={(e: any) => {
                                        setValues((prev) => ({
                                            ...prev,
                                            period: e.value,
                                        }));
                                        setPeriode(e ? e : {});
                                    }}
                                />
                            </div>

                            <InputSearch
                                value={values.search ? values.search : ""}
                                onChange={(e: any) =>
                                    setValues((v) => ({
                                        ...v,
                                        search: e.target.value,
                                    }))
                                }
                            />
                            <LinkButton
                                theme="blue"
                                href={route(
                                    "admin.transaksi.postingjurnals.create"
                                )}
                            >
                                <span className="flex items-center gap-1">
                                    <i className="fa-solid fa-plus"></i> New
                                </span>
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
                                    <Link
                                        href="#"
                                        onClick={(e) =>
                                            handleSortLinkClick({
                                                sortBy: "id",
                                                sortDir:
                                                    values.sortDir === "asc"
                                                        ? "desc"
                                                        : "asc",
                                            })
                                        }
                                    >
                                        <div className="flex flex-row justify-between">
                                            <span>Id</span>
                                            <IconSort
                                                sortBy="id"
                                                sortDir={values.sortDir || ""}
                                            />
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
                                    <Link
                                        href="#"
                                        onClick={(e) =>
                                            handleSortLinkClick({
                                                sortBy: "created_at",
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
                                                sortBy="created_at"
                                                sortDir={values.sortDir || ""}
                                            />
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
                                    <Link
                                        href="#"
                                        onClick={(e) =>
                                            handleSortLinkClick({
                                                sortBy: "uraian",
                                                sortDir:
                                                    values.sortDir === "asc"
                                                        ? "desc"
                                                        : "asc",
                                            })
                                        }
                                    >
                                        <div className="flex flex-row justify-between">
                                            <span>Uraian</span>
                                            <IconSort
                                                sortBy="uraian"
                                                sortDir={values.sortDir || ""}
                                            />
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
                                        <span>Jumlah</span>
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
                                        <span>User</span>
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
                                        <span>Image</span>
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
                                    Options
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {postingjurnals.map(
                                (
                                    {
                                        id,
                                        uraian,
                                        user,
                                        jumlah,
                                        created_at,
                                        image,
                                    },
                                    index
                                ) => (
                                    <tr key={index}>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {id}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {created_at}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            <i className="fas fa-circle text-orange-500 mr-2"></i>{" "}
                                            {uraian}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {jumlah}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {user.name}
                                        </td>
                                        <td className="border-t-0 px-3 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                                            {image && (
                                                <button
                                                    onClick={() => {
                                                        setImage(image);
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
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 ">
                                            <div className="flex justify-start gap-1 ">
                                                <Link
                                                    href={route(
                                                        "admin.transaksi.postingjurnals.edit",
                                                        id
                                                    )}
                                                    className="text-lightBlue-500 background-transparent font-bold px-3 py-1 text-xs outline-none focus:outline-none hover:text-lightBlue-100 hover:scale-105 mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="button"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={(e) =>
                                                        useSwal
                                                            .confirm({
                                                                title: "Hapus Data",
                                                                text: "apakah akan menghapus?",
                                                            })
                                                            .then((result) => {
                                                                if (
                                                                    result.isConfirmed
                                                                ) {
                                                                    handleRemoveData(
                                                                        id
                                                                    );
                                                                }
                                                            })
                                                    }
                                                    className="text-lightBlue-500 background-transparent font-bold px-3 py-1 text-xs outline-none focus:outline-none hover:text-lightBlue-100 hover:scale-105 mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="button"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
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
