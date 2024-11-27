import React, { useEffect, useState } from "react";
import { Kasbon, OptionSelect, Rincianbiayaperm } from "@/types";
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
import ModalCetakLaporan from "@/Components/Modals/ModalCetakLaporan";
import Button from "@/Components/Shared/Button";
import MenuDropdown from "@/Components/Dropdowns/MenuDropdown";
import SelectSearch from "@/Components/Shared/SelectSearch";

// components
export default function CardTableRincianbiayaperms({
    color = "light",
    rincianbiayaperms,
    className = "",
    meta,
    labelLinks,
}: {
    color: "dark" | "light";
    rincianbiayaperms: Rincianbiayaperm[];
    className?: string;
    meta: { links: []; per_page: number; total: number };
    labelLinks: any;
}) {
    const { isAdmin, user, base_route, statusOpts, curstatus } = usePage<{
        isAdmin: boolean;
        user: OptionSelect;
        base_route: string;
        statusOpts: OptionSelect[] | [];
        curstatus: string;
    }>().props;
    const params = new URLSearchParams(window.location.search);
    const [values, setValues] = useState({
        search: params.get("search"),
        sortBy: params.get("sortBy"),
        sortDir: params.get("sortDir"),
        status: curstatus,
    });
    const prevValues = usePrevious(values);
    const [rincianbiayapermId, setKasbonId] = useState<string>();
    const [showModalLaporan, setShowModalLaporan] = useState<boolean>(false);

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
        router.delete(route("admin.transaksi.rincianbiayaperms.destroy", id));
    };

    function prosesLaporan(e: any, rincianbiayapermId: string) {
        e.preventDefault();
        setKasbonId(rincianbiayapermId);
        setShowModalLaporan(true);
    }
    const cstatus = statusOpts.find((e) => e.value == values.status);
    const [curStatus, setCurStatus] = useState<OptionSelect | null>(
        cstatus ? cstatus : null
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
        <div
            className={twMerge(
                "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-700 rounded-md py-1 ",
                color === "light" ? "bg-white" : "bg-lightBlue-900 text-white",
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
                            Rincian Biaya List
                        </h3>
                    </div>
                    <div className="flex justify-center gap-2 flex-row items-start w-full md:w-3/4">
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
                                className="text-blueGray-900 w-1/2"
                            />
                        ) : null}
                        <SelectSearch
                            name="status"
                            className="text-gray-800 w-1/2"
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
                            className="w-1/3"
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
                                "admin.transaksi.rincianbiayaperms.create"
                            )}
                        >
                            <span className="flex items-center gap-1">
                                <i className="fa-solid fa-plus"></i> New
                            </span>
                        </LinkButton>
                    </div>
                </div>
            </div>
            <div className="block w-full overflow-x-auto overflow-y-visible md:overflow-auto">
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
                                    "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                <div className="flex flex-row justify-between">
                                    <span>Pemasukan</span>
                                </div>
                            </th>
                            <th
                                className={
                                    "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                <div className="flex flex-row justify-between">
                                    <span>Pengeluaran</span>
                                </div>
                            </th>
                            <th
                                className={
                                    "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                <div className="flex flex-row justify-between">
                                    <span>Sisa Saldo</span>
                                </div>
                            </th>
                            <th
                                className={
                                    "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                <div className="flex flex-row justify-between">
                                    <span>Keterangan</span>
                                </div>
                            </th>
                            <th
                                className={
                                    "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                <div className="flex flex-row justify-between">
                                    <span>Transaksi</span>
                                </div>
                            </th>
                            <th
                                className={
                                    "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                            >
                                <div className="flex flex-row justify-between">
                                    <span>Permohonan</span>
                                </div>
                            </th>
                            <th
                                className={
                                    "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
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
                                    "px-2 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
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
                        {rincianbiayaperms.map(
                            (
                                {
                                    id,
                                    tgl_rincianbiayaperm,
                                    total_pemasukan,
                                    total_pengeluaran,
                                    sisa_saldo,
                                    ket_rincianbiayaperm,
                                    user,
                                    status_rincianbiayaperm,
                                    permohonan,
                                    letak_obyek,
                                    nama_jenispermohonan,
                                },
                                index
                            ) => (
                                <tr key={index}>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                        {tgl_rincianbiayaperm}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                        {total_pemasukan}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                        {total_pengeluaran}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                        {sisa_saldo}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                        {ket_rincianbiayaperm}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                        {nama_jenispermohonan}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                        <div className="flex flex-col items-start justify-start">
                                            <div>{permohonan}</div>
                                            <div>{letak_obyek}</div>
                                        </div>
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                        {user.name}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                        {status_rincianbiayaperm}
                                    </td>
                                    <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-4">
                                        <MenuDropdown>
                                            <Link
                                                href={route(
                                                    "admin.transaksi.rincianbiayaperms.edit",
                                                    id
                                                )}
                                                className={
                                                    "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                                                }
                                            >
                                                <i className="fas fa-edit"></i>
                                                <span> Edit</span>
                                            </Link>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
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
                                                        });
                                                }}
                                                className={
                                                    "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:text-blue-400 transition hover:scale-110 origin-top-left"
                                                }
                                            >
                                                <i className="fas fa-trash"></i>
                                                <span> Hapus</span>
                                            </a>
                                        </MenuDropdown>
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
                    <Pagination links={meta.links} labelLinks={labelLinks} />
                </div>
            ) : null}
            {/* {rincianbiayapermId && (
                <ModalCetakLaporan
                    showModal={showModalLaporan}
                    setShowModal={setShowModalLaporan}
                    src={route(
                        base_route +
                            "transaksi.rincianbiayaperms.lap.rincianbiayaperm",
                        rincianbiayapermId
                    )}
                />
            )} */}
        </div>
    );
}
