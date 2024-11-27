import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { User } from "@/types";
import { twMerge } from 'tailwind-merge'
import { Link, router } from "@inertiajs/react";
import { usePrevious } from "react-use";
import { pickBy, sortBy } from "lodash";
import useSwal from "@/utils/useSwal";
import Pagination from "../Shared/Pagination";
import LinkButton from "../Shared/LinkButton";

// components


export default function CardTablePermissions({ color = "light", permissions, className = "", meta, labelLinks }: { color: "dark" | "light", permissions: User[], className?: string, meta: { links: [], per_page: number, total: number }, labelLinks: any }) {
    const params = new URLSearchParams(window.location.search);
    const prevValues = usePrevious({ sortBy: '', sortDir: '' });
    const [values, setValues] = useState({ sortBy: params.get('sortBy'), sortDir: params.get('sortDir') });


    function handleSortLinkClick({ sortBy, sortDir }: { sortBy: string, sortDir: string }) {

        setValues({ sortBy, sortDir });

    }
    const IconSort = ({ sortBy, sortDir }: { sortBy: any, sortDir: string }) => {
        if (values.sortBy === sortBy && sortDir === 'asc') {
            return <i className="fa-solid fa-sort-up"></i>
        } else if (values.sortBy === sortBy && sortDir === 'desc') {
            return <i className="fa-solid fa-sort-down"></i>
        }
        return <i className="fa-solid fa-sort"></i>
    }

    const handleRemoveData = (id: number) => {
        router.delete(route('admin.permissions.destroy', id))
    }
    console.log(meta)
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
                    twMerge("relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-md py-2 shadow-slate-600 ",
                        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"), className)
                }
            >
                <div className="rounded-t mb-2 px-2 py-1 border-0">
                    <div className="text-center flex justify-between">
                        <h1 className={"text-blueGray-700 text-lg font-bold uppercase " + (color === "light" ? "text-blueGray-700" : "text-white")}>Permissions</h1>
                        <LinkButton theme="blue" href={route('admin.permissions.create')} >
                            New Permission
                        </LinkButton>
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
                                    <Link href="#" onClick={(e) => handleSortLinkClick({ sortBy: 'name', sortDir: values.sortDir === 'asc' ? 'desc' : 'asc' })} >
                                        <div className="flex flex-row justify-between">
                                            <span>Name</span>
                                            <IconSort sortBy='name' sortDir={values.sortDir || ''} />
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
                                    Email
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
                                permissions.map(({ id, name, email }, index) => (
                                    <tr key={index}>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {id}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            {name}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                                            <i className="fas fa-circle text-orange-500 mr-2"></i> {email}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2 ">
                                            <div className="flex justify-start gap-1 ">
                                                <Link href={route('admin.permissions.edit', id)} className="text-lightBlue-500 background-transparent font-bold px-3 py-1 text-xs outline-none focus:outline-none hover:text-lightBlue-100 hover:scale-105 mr-1 mb-1 ease-linear transition-all duration-150" type="button">
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
                    {meta.total > meta.per_page ?
                        <div className={"flex justify-end px-2 py-1  " + (color === "light"
                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>
                            <Pagination links={meta.links} labelLinks={labelLinks} />
                        </div>
                        : null}

                </div>
            </div >
        </>
    );
}

