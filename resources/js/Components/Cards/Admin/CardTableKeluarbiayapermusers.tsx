import React, { useEffect, useState } from "react";
import { Keluarbiayapermuser, OptionSelect } from "@/types";
import { twMerge } from "tailwind-merge";
import { Link, router, usePage } from "@inertiajs/react";
import { usePrevious } from "react-use";
import { pickBy } from "lodash";
import Pagination from "../../Shared/Pagination";
import InputSearch from "../../Shared/InputSearch";
import LinkButton from "../../Shared/LinkButton";
import AsyncSelectSearch from "@/Components/Shared/AsyncSelectSearch";
import { formatNumber, toRupiah } from "@/utils";
import SelectSearch from "@/Components/Shared/SelectSearch";

// components
export default function CardTableKeluarbiayapermusers({
    color = "light",
    keluarbiayapermusers,
    className = "",
    meta,
    labelLinks,
}: {
    color: "dark" | "light";
    keluarbiayapermusers: Keluarbiayapermuser[];
    className?: string;
    meta: { links: []; per_page: number; total: number };
    labelLinks: any;
}) {
    const { isAdmin, user, base_route, statusOpts, status } = usePage<{
        isAdmin: boolean;
        user: OptionSelect;
        base_route: string;
        statusOpts: OptionSelect[] | [];
        status: string;
    }>().props;

    const params = new URLSearchParams(window.location.search);
    const [values, setValues] = useState({
        search: params.get("search"),
        sortBy: params.get("sortBy"),
        sortDir: params.get("sortDir"),
        status: status,
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
    //     router.delete(route('transaksi.keluarbiayapermusers.destroy', id))
    // }

    const curstatus = statusOpts
        ? statusOpts.find((e) => e.value == values.status)
        : null;
    const [curStatus, setCurStatus] = useState<OptionSelect | null>(
        curstatus ? curstatus : null
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
                                PENGELUARAN BIAYA PERMOHONAN
                            </h3>
                        </div>
                        <div className="flex justify-center gap-2 flex-row items-start">
                            {isAdmin ? (
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
                                    className="text-blueGray-900"
                                />
                            ) : null}
                            <SelectSearch
                                name="status"
                                className="text-gray-800"
                                value={curStatus}
                                options={statusOpts}
                                placeholder="Pilih Status"
                                onChange={(e: any) => {
                                    setValues((prev) => ({
                                        ...prev,
                                        status: e.value,
                                    }));
                                    setCurStatus(e ? e : {});
                                }}
                            />

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
                                    base_route +
                                        "transaksi.keluarbiayapermusers.create"
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
                                        "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
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
                                        "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
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
                                        "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <div className="flex flex-row justify-between">
                                        <span>Metode Bayar</span>
                                    </div>
                                </th>
                                <th
                                    className={
                                        "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
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
                                        "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <div className="flex flex-row justify-between">
                                        <span>Kasbon</span>
                                    </div>
                                </th>
                                <th
                                    className={
                                        "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
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
                                        "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <div className="flex flex-row justify-between">
                                        <span>Saldo Akhir</span>
                                    </div>
                                </th>

                                <th
                                    className={
                                        "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    <div className="flex flex-row justify-between">
                                        <span>Status</span>
                                    </div>
                                </th>
                                <th
                                    className={
                                        "px-4 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
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
                            {keluarbiayapermusers.map(
                                (
                                    {
                                        id,
                                        created_at,
                                        instansi,
                                        metodebayar,
                                        kasbons,
                                        user,
                                        status_keluarbiayapermuser,
                                        jumlah_biaya,
                                        saldo_akhir,
                                    },
                                    index
                                ) => (
                                    <tr key={index}>
                                        <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                            {created_at}
                                        </td>
                                        <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                            {instansi.nama_instansi}
                                        </td>
                                        <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                            {metodebayar.nama_metodebayar}
                                        </td>
                                        <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                            {user.name}
                                        </td>
                                        <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                            {kasbons.length > 0 ? (
                                                kasbons.map((e, i) => (
                                                    <span key={i}>
                                                        {formatNumber(
                                                            e.jumlah_kasbon
                                                        )}
                                                    </span>
                                                ))
                                            ) : (
                                                <span>No Kasbon</span>
                                            )}
                                        </td>
                                        <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                            {jumlah_biaya}
                                        </td>
                                        <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                            {saldo_akhir}
                                        </td>
                                        <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1">
                                            {status_keluarbiayapermuser}
                                        </td>
                                        <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 ">
                                            <Link
                                                href={route(
                                                    base_route +
                                                        "transaksi.keluarbiayapermusers.edit",
                                                    id
                                                )}
                                                className="text-lightBlue-500 background-transparent font-bold uppercase px-2 py-1 text-sm outline-none focus:outline-none ease-linear transition-all duration-150"
                                                type="button"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Link>
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
