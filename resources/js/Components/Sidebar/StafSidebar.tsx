/*eslint-disable*/
import React, { useEffect } from "react";
import NotificationDropdown from "../Dropdowns/NotificationDropdown";
import UserDropdown from "../Dropdowns/UserDropdown";
import { Link } from "@inertiajs/react";
import MenuItem from "./MenuItem";

export default function StafSidebar() {
    const [collapseShow, setCollapseShow] = React.useState("hidden");
    const currentRoute = route().current();
    // const isTransaksiRoute = currentRoute ? currentRoute.includes('transaksi') : false;
    // const isInformasiRoute = currentRoute ? currentRoute.includes('informasi') : false;
    return (
        <>
            <nav className="container-snap md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
                <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
                    {/* Toggler */}
                    <button
                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                        type="button"
                        onClick={() =>
                            setCollapseShow("bg-white m-2 py-3 px-6")
                        }
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                    {/* Brand */}
                    <Link
                        className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                        href=""
                    >
                        PPAT APP
                    </Link>
                    {/* User */}
                    <ul className="md:hidden items-center flex flex-wrap list-none">
                        <li className="inline-block relative">
                            <NotificationDropdown />
                        </li>
                        <li className="inline-block relative">
                            <UserDropdown />
                        </li>
                    </ul>
                    {/* Collapse */}
                    <div
                        className={
                            "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
                            collapseShow
                        }
                    >
                        {/* Collapse header */}
                        <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
                            <div className="flex flex-wrap">
                                <div className="w-6/12">
                                    <Link
                                        className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                                        href="/"
                                    >
                                        Ppat App
                                    </Link>
                                </div>
                                <div className="w-6/12 flex justify-end">
                                    <button
                                        type="button"
                                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                                        onClick={() =>
                                            setCollapseShow("hidden")
                                        }
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Form */}
                        <form className="mt-6 mb-4 md:hidden">
                            <div className="mb-3 pt-0">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="border-0 px-3 py-2 h-12 border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                                />
                            </div>
                        </form>

                        {/* Divider */}
                        <hr className="my-4 md:min-w-full" />
                        {/* Heading */}
                        <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                            Staf Menu
                        </h6>
                        {/* Navigation */}

                        <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                            <li className="items-center px-2">
                                <Link
                                    className={
                                        "text-xs uppercase py-3 font-bold block " +
                                        (currentRoute === "staf.index"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500")
                                    }
                                    href={route("staf.index")}
                                >
                                    <i
                                        className={
                                            "fas fa-tv mr-2 text-sm" +
                                            (window.location.href.indexOf(
                                                "/staf"
                                            ) !== -1
                                                ? "opacity-75"
                                                : "text-blueGray-300")
                                        }
                                    ></i>{" "}
                                    Dashboard
                                </Link>
                            </li>

                            {/* tambahan sub menu */}
                            <MenuItem
                                expanded={
                                    currentRoute
                                        ? currentRoute.includes("transaksi")
                                        : false
                                }
                                label="Pendataan"
                            >
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "staf.permohonans.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route("staf.permohonans.index")}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.permohonans.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Permohonan
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold flex items-center " +
                                            (currentRoute ===
                                            "staf.permohonans.qrcode.create"
                                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                : "text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "staf.permohonans.qrcode.create"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.permohonans.qrcode.create"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        <span className="flex flex-col">
                                            <span>Label Berkas</span>
                                            <span>Qr Code</span>
                                        </span>
                                    </Link>
                                </li>
                            </MenuItem>
                            <MenuItem
                                expanded={
                                    currentRoute
                                        ? currentRoute.includes("transaksi")
                                        : false
                                }
                                label="Transaksi"
                            >
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "staf.transaksi.prosespermohonans.create"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "staf.transaksi.prosespermohonans.create"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-gears mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.transaksi.prosespermohonans.create"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Proses Permohonan
                                    </Link>
                                </li>
                                <li className="items-center px-2 flex flex-row gap-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold flex items-center " +
                                            (currentRoute ===
                                            "staf.transaksi.transpermohonans.tempatarsips.create"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "staf.transaksi.transpermohonans.tempatarsips.create"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.transaksi.transpermohonans.tempatarsips.create"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>
                                        <span>
                                            <span className="inline-block">
                                                Tempat Arsip
                                            </span>
                                            <span className="inline-block">
                                                Permohonan
                                            </span>
                                        </span>
                                    </Link>
                                </li>

                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "staf.transaksi.rincianbiayaperms.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "staf.transaksi.rincianbiayaperms.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.transaksi.rincianbiayaperms.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Rincian Biaya
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "staf.transaksi.biayaperms.create"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "staf.transaksi.biayaperms.create"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.transaksi.biayaperms.create"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Biaya Permohonan
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "staf.transaksi.kasbons.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "staf.transaksi.kasbons.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.transaksi.kasbons.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Kasbon
                                    </Link>
                                </li>
                                {/* staf */}
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold flex items-center " +
                                            (currentRoute ===
                                            "staf.transaksi.keluarbiayapermusers.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "staf.transaksi.keluarbiayapermusers.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.transaksi.keluarbiayapermusers.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Pengeluaran Biaya Permohonan
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold flex items-center " +
                                            (currentRoute ===
                                            "staf.transaksi.keluarbiayas.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "staf.transaksi.keluarbiayas.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.transaksi.keluarbiayas.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>
                                        <span className="inline-block">
                                            Pengeluaran Biaya
                                        </span>
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold flex items-center " +
                                            (currentRoute ===
                                            "staf.transaksi.events.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "staf.transaksi.events.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.transaksi.events.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>
                                        <span className="inline-block">
                                            Event
                                        </span>
                                    </Link>
                                </li>
                                {/* end staf */}
                            </MenuItem>
                            <MenuItem
                                expanded={
                                    currentRoute
                                        ? currentRoute.includes("informasi")
                                        : false
                                }
                                label="Informasi"
                            >
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "staf.informasi.prosespermohonans.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                : " text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "staf.informasi.prosespermohonans.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-book mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.informasi.prosespermohonans.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Proses Permohonan
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "staf.informasi.prosespermohonans.bypermohonan"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                : " text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "staf.informasi.prosespermohonans.bypermohonan"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.informasi.prosespermohonans.bypermohonan"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Proses By Permohonan
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "staf.informasi.keuangans.keluarbiayas"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                : " text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "staf.informasi.keuangans.keluarbiayas"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.informasi.keuangans.keluarbiayas"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Pengeluaran Biaya
                                    </Link>
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold flex items-center" +
                                            (currentRoute ===
                                            "staf.informasi.keuangans.keluarbiayapermusers"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                : " text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "staf.informasi.keuangans.keluarbiayapermusers"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "staf.informasi.keuangans.keluarbiayapermusers"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        <span className="flex flex-col">
                                            <span>Pengeluaran</span>
                                            <span>Biaya Permohonan</span>
                                        </span>
                                    </Link>
                                </li>
                            </MenuItem>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
