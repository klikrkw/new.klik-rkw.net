import React, { useEffect, useState } from "react";
import { OptionSelect, Permohonan } from "@/types";
import { twMerge } from "tailwind-merge";
import { Link, router, usePage } from "@inertiajs/react";
import { usePrevious } from "react-use";
import { pickBy } from "lodash";
import useSwal from "@/utils/useSwal";
import Pagination from "../../Shared/Pagination";
import LinkButton from "../../Shared/LinkButton";
import AsyncSelectSearch from "@/Components/Shared/AsyncSelectSearch";
import PopupMenu from "@/Components/Hero/PopupMenu";
import SelectSearch from "@/Components/Shared/SelectSearch";
import InputWithSelect from "@/Components/Shared/InputWithSelect";
import { DateRange } from "react-number-format/types/types";
import MonthRangeInput from "@/Components/Shared/MonthRangeInput";
import moment from "moment";

// components

export default function CardTablePermohonans({
    color = "light",
    jenishaks,
    permohonans,
    className = "",
    meta,
    labelLinks,
}: {
    color: "dark" | "light";
    jenishaks: OptionSelect[];
    permohonans: Permohonan[];
    className?: string;
    meta: { links: []; per_page: number; total: number };
    labelLinks: any;
}) {
    const params = new URLSearchParams(window.location.search);
    const {
        jenistanahs,
        jenispermohonans,
        desa,
        inactive,
        date1,
        date2,
        userOpts,
    } = usePage<any>().props;

    // const jenishak_id = params.get('jenishak_id')
    // const jenishak = jenishaks.find((e: any) => e.value === jenishak_id)
    const [values, setValues] = useState({
        date1: params.get("date1") ? params.get("date1") : date1,
        date2: params.get("date2") ? params.get("date2") : date2,
        inactive: params.get("inactive"),
        search_key: params.get("search_key"),
        jenis_tanah: params.get("jenis_tanah"),
        search: params.get("search"),
        jenishak_id: params.get("jenishak_id"),
        jenispermohonan_id: params.get("jenispermohonan_id"),
        sortBy: params.get("sortBy"),
        sortDir: params.get("sortDir"),
        user_id: params.get("user_id"),
    });
    const xuser = userOpts.find((usr: any) => usr.value == values.user_id);
    const [cuser, setCuser] = useState(xuser);
    const prevValues = usePrevious(values);
    // const [dates, setDates] = useState<DateRange>({ date1: params.get('date1'), date2: params.get('date2') ? moment(params.get('date2')).toDate() : new Date() })
    // const prevDates = usePrevious(dates);
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
    const jenishak = jenishaks.find((e) => e.value === values.jenishak_id);
    const selectedDesa = desa ? desa : {};
    const jenispermohonan = jenispermohonans.find(
        (e: any) => e.value === values.jenispermohonan_id
    );
    const jenistanah = jenistanahs.find(
        (e: any) => e.value === values.jenis_tanah
    );
    const handleRemoveData = (id: string) => {
        router.delete(route("staf.permohonans.destroy", id));
    };
    const [isChecked, setIsChecked] = useState(inactive);

    const handleDateChange = (dates: DateRange) => {
        // setDates((d: any) => ({ ...d, [field]: date }))
        setValues((v) => ({ ...v, date1: dates.date1, date2: dates.date2 }));
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
                        <div className="relative w-full max-w-full flex-grow flex-1 ">
                            <h3
                                className={
                                    "font-semibold text-lg " +
                                    (color === "light"
                                        ? "text-blueGray-700"
                                        : "text-white")
                                }
                            >
                                Permohonan List
                            </h3>
                        </div>
                        <div className="flex justify-center gap-2 flex-row items-start">
                            <PopupMenu caption="Filter">
                                <MonthRangeInput
                                    label="Rentang Waktu"
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
                                <SelectSearch
                                    className="text-blueGray-900"
                                    isClearable
                                    value={jenishak ? jenishak : ""}
                                    options={jenishaks}
                                    label="Jenis Hak"
                                    onChange={(e: any) =>
                                        setValues((v) => ({
                                            ...v,
                                            jenishak_id: e ? e.value : "",
                                        }))
                                    }
                                />
                                <SelectSearch
                                    className="text-blueGray-900"
                                    isClearable
                                    value={jenistanah}
                                    options={jenistanahs}
                                    label="Jenis Tanah"
                                    onChange={(e: any) =>
                                        setValues((v) => ({
                                            ...v,
                                            jenis_tanah: e ? e.value : "",
                                        }))
                                    }
                                />
                                <AsyncSelectSearch
                                    url="/admin/desas/api/list"
                                    className="text-blueGray-900"
                                    value={selectedDesa}
                                    optionLabels={[
                                        "nama_desa",
                                        "nama_kecamatan",
                                    ]}
                                    optionValue="id"
                                    isClearable
                                    label="Letak Obyek"
                                    onChange={(e: any) =>
                                        setValues((v) => ({
                                            ...v,
                                            desa_id: e ? e.value : "",
                                        }))
                                    }
                                />
                                <div className="p-2 flex items-center text-blueGray-900 gap-2">
                                    <span>Active</span>
                                    <input
                                        type="checkbox"
                                        name="inactive"
                                        checked={isChecked}
                                        onChange={(e: any) =>
                                            setValues((v: any) => {
                                                setIsChecked(!isChecked);
                                                return {
                                                    ...v,
                                                    inactive: isChecked,
                                                };
                                            })
                                        }
                                    />
                                </div>
                            </PopupMenu>
                            {/* <AsyncSelectSearch
                                placeholder="Pilih User"
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
                                className="text-blueGray-900"
                            /> */}
                            <SelectSearch
                                name="user_id"
                                value={cuser}
                                options={userOpts}
                                placeholder="Pilih Petugas"
                                className="text-gray-800"
                                onChange={(e: any) => {
                                    setValues((v) => ({
                                        ...v,
                                        user_id: e ? e.value : "",
                                    }));
                                    setCuser(e);
                                }}
                            />

                            <InputWithSelect
                                comboboxValue={
                                    values.search_key ? values.search_key : ""
                                }
                                onSelecChange={(e) =>
                                    setValues((v) => ({
                                        ...v,
                                        search_key: e.value,
                                        search: "",
                                    }))
                                }
                                value={values.search ? values.search : ""}
                                onInputChange={(e, s) => {
                                    setValues((v) => ({
                                        ...v,
                                        search_key: s,
                                        search: e.target.value,
                                    }));
                                }}
                            />
                            <LinkButton
                                theme="blue"
                                href={route("staf.permohonans.create")}
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
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
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
                                            <span>No Daftar</span>
                                            <IconSort
                                                sortBy="id"
                                                sortDir={values.sortDir || ""}
                                            />
                                        </div>
                                    </Link>
                                </th>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <Link
                                        href="#"
                                        onClick={(e) =>
                                            handleSortLinkClick({
                                                sortBy: "nama_pelepas",
                                                sortDir:
                                                    values.sortDir === "asc"
                                                        ? "desc"
                                                        : "asc",
                                            })
                                        }
                                    >
                                        <div className="flex flex-row justify-between">
                                            <span>Nama Pelepas</span>
                                            <IconSort
                                                sortBy="nama_pelepas"
                                                sortDir={values.sortDir || ""}
                                            />
                                        </div>
                                    </Link>
                                </th>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <Link
                                        href="#"
                                        onClick={(e) =>
                                            handleSortLinkClick({
                                                sortBy: "nama_penerima",
                                                sortDir:
                                                    values.sortDir === "asc"
                                                        ? "desc"
                                                        : "asc",
                                            })
                                        }
                                    >
                                        <div className="flex flex-row justify-between">
                                            <span>Nama Penerima</span>
                                            <IconSort
                                                sortBy="nama_penerima"
                                                sortDir={values.sortDir || ""}
                                            />
                                        </div>
                                    </Link>
                                </th>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    No Hak
                                </th>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Luas M2
                                </th>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Letak Obyek
                                </th>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Transaksi
                                </th>
                                <th
                                    className={
                                        "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Menu
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {permohonans.map(
                                (
                                    {
                                        id,
                                        no_daftar,
                                        nama_pelepas,
                                        nama_penerima,
                                        nomor_hak,
                                        letak_obyek,
                                        luas_tanah,
                                        transpermohonans,
                                    },
                                    index
                                ) => (
                                    <tr key={index}>
                                        <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {no_daftar}
                                        </td>
                                        <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            <i className="fas fa-circle text-orange-500 mr-2"></i>{" "}
                                            {nama_pelepas}
                                        </td>
                                        <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {nama_penerima}
                                        </td>
                                        <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {nomor_hak}
                                        </td>
                                        <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {luas_tanah}
                                        </td>
                                        <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {letak_obyek}
                                        </td>
                                        <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            <ol>
                                                {transpermohonans.map(
                                                    (tp, idx) => (
                                                        <li
                                                            className="rounded-full bg-white/50 text-center mb-1"
                                                            key={idx}
                                                        >
                                                            {tp.no_daftar} -{" "}
                                                            {
                                                                tp
                                                                    .jenispermohonan
                                                                    .nama_jenispermohonan
                                                            }
                                                        </li>
                                                    )
                                                )}
                                            </ol>
                                        </td>
                                        <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 ">
                                            <div className="flex justify-start gap-1 ">
                                                <Link
                                                    href={route(
                                                        "staf.permohonans.edit",
                                                        id
                                                    )}
                                                    className="text-lightBlue-500 background-transparent font-bold px-3 py-1 text-xs outline-none focus:outline-none hover:text-lightBlue-100 hover:scale-105 mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="button"
                                                >
                                                    Edit
                                                </Link>
                                                {/* <button
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
                                                </button> */}
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
            </div>
        </>
    );
}
