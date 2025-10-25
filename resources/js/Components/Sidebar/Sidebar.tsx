/*eslint-disable*/
import React, { useEffect } from "react";
import NotificationDropdown from "../Dropdowns/NotificationDropdown";
import UserDropdown from "../Dropdowns/UserDropdown";
import { Link, usePage } from "@inertiajs/react";
import MenuItem from "./MenuItem";

export default function Sidebar() {
    const [collapseShow, setCollapseShow] = React.useState("hidden");
    const currentRoute = route().current();
    const isTransaksiRoute = currentRoute
        ? currentRoute.includes("transaksi")
        : false;
    const isInformasiRoute = currentRoute
        ? currentRoute.includes("informasi")
        : false;
    const isUtilityRoute = currentRoute
        ? currentRoute.includes("utils")
        : false;
    const {
        auth: { user },
    } = usePage<any>().props;
    return (
        <>
            <nav className="container-snap md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-[55] py-4 px-6">
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
                        className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase p-4 px-0"
                        href="/"
                    >
                        <div>
                            <div className="text-lg font-bold">PPAT APP</div>
                            <div className="text-md">{user.name}</div>
                        </div>
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
                            "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-50 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
                            collapseShow
                        }
                    >
                        {/* Collapse header */}
                        <div className="md:min-w-full md:hidden block pb-4 mb-2 border-b border-solid border-blueGray-200">
                            <div className="flex flex-wrap">
                                <div className="w-6/12">
                                    <Link
                                        className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                                        href="/"
                                    >
                                        PPAT APP
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
                        {/* <form className="mt-6 mb-4 md:hidden">
                            <div className="mb-3 pt-0">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="border-0 px-3 py-2 h-12 border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                                />
                            </div>
                        </form> */}

                        {/* Divider */}
                        <hr className="my-2 md:min-w-full" />
                        {/* Heading */}
                        <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                            MENU ADMIN
                        </h6>
                        {/* Navigation */}

                        <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                            <li className="items-center px-2">
                                <Link
                                    className={
                                        "text-xs uppercase py-3 font-bold block " +
                                        (currentRoute === "admin.index"
                                            ? "text-lightBlue-500 hover:text-lightBlue-600"
                                            : "text-blueGray-700 hover:text-blueGray-500")
                                    }
                                    href={route("admin.index")}
                                >
                                    <i
                                        className={
                                            "fas fa-tv mr-2 text-sm" +
                                            (window.location.href.indexOf(
                                                "/admin"
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
                                        ? currentRoute.includes("admin") &&
                                          isTransaksiRoute == false &&
                                          isInformasiRoute == false
                                        : false
                                }
                                label="Admin"
                            >
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.users.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route("admin.users.index")}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.users.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Users
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.pengaturans.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route("admin.pengaturans.index")}
                                    >
                                        <i
                                            className={
                                                "fas fa-cogs mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.pengaturans.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Pengaturans
                                    </Link>
                                </li>

                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.permissions.index"
                                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                : "text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route("admin.permissions.index")}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.permissions.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Permissions
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.roles.index"
                                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                : "text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route("admin.roles.index")}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.roles.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Roles
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.permohonans.index"
                                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                : "text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route("admin.permohonans.index")}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.permohonans.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Permohonans
                                    </Link>
                                </li>

                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold flex items-center " +
                                            (currentRoute ===
                                            "admin.permohonans.qrcode.create"
                                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                : "text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "admin.permohonans.qrcode.create"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.permohonans.qrcode.create"
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
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.jenispermohonans.index"
                                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                : "text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "admin.jenispermohonans.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.jenispermohonans.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Jenis Permohonan
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.itemprosesperms.index"
                                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                : "text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "admin.itemprosesperms.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.itemprosesperms.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Item Proses
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.statusprosesperms.index"
                                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                : "text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "admin.statusprosesperms.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.statusprosesperms.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Status Proses
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.akuns.index"
                                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                : "text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route("admin.akuns.index")}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.akuns.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Akun
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.itemkegiatans.index"
                                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                : "text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "admin.itemkegiatans.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.itemkegiatans.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Item Kegiatan
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.rekenings.index"
                                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                : "text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route("admin.rekenings.index")}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.rekenings.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Rekening
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.itemrincianbiayaperms.index"
                                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                : "text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "admin.itemrincianbiayaperms.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.itemrincianbiayaperms.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Item Rincian Biaya
                                    </Link>
                                </li>
                                <MenuItem expanded={true} label="Arsip">
                                    <li className="items-center px-2">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (currentRoute ===
                                                "admin.kantors.index"
                                                    ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                    : " text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            href={route("admin.kantors.index")}
                                        >
                                            <i
                                                className={
                                                    "fas fa-building mr-2 text-sm " +
                                                    (currentRoute ===
                                                    "admin.kantors.index"
                                                        ? "opacity-75"
                                                        : "text-blueGray-300")
                                                }
                                            ></i>{" "}
                                            Kantor
                                        </Link>
                                    </li>
                                    <li className="items-center px-2">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (currentRoute ===
                                                "admin.ruangs.index"
                                                    ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                    : " text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            href={route("admin.ruangs.index")}
                                        >
                                            <i
                                                className={
                                                    "fas fa-building mr-2 text-sm " +
                                                    (currentRoute ===
                                                    "admin.ruangs.index"
                                                        ? "opacity-75"
                                                        : "text-blueGray-300")
                                                }
                                            ></i>{" "}
                                            Ruang
                                        </Link>
                                    </li>
                                    <li className="items-center px-2">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (currentRoute ===
                                                "admin.tempatberkas.index"
                                                    ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                    : " text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            href={route(
                                                "admin.tempatberkas.index"
                                            )}
                                        >
                                            <i
                                                className={
                                                    "fas fa-building mr-2 text-sm " +
                                                    (currentRoute ===
                                                    "admin.tempatberkas.index"
                                                        ? "opacity-75"
                                                        : "text-blueGray-300")
                                                }
                                            ></i>{" "}
                                            Tempat Berkas
                                        </Link>
                                    </li>
                                </MenuItem>

                                {/* <MenuItem expanded={false} label="Sub Menu 2" >
                                    <li className="items-center px-2">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (window.location.href.indexOf("/admin/dashboard") !== -1
                                                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                                                    : "text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            href={route('admin.permissions.index')}
                                        >
                                            <i
                                                className={
                                                    "fas fa-tv mr-2 text-sm " +
                                                    (window.location.href.indexOf("/admin/dashboard") !== -1
                                                        ? "opacity-75"
                                                        : "text-blueGray-300")
                                                }
                                            ></i>{" "}
                                            Sub Sub Menu 1
                                        </Link>
                                    </li>
                                </MenuItem> */}
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
                                            "admin.transaksi.prosespermohonans.create"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "admin.transaksi.prosespermohonans.create"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.transaksi.prosespermohonans.create"
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
                                            "admin.transaksi.transpermohonans.posisiberkas.create"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "admin.transaksi.transpermohonans.posisiberkas.create"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.transaksi.transpermohonans.posisiberkas.create"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>
                                        <span>
                                            <span className="inline-block">
                                                Tempat Berkas
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
                                            "admin.transaksi.rincianbiayaperms.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "admin.transaksi.rincianbiayaperms.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.transaksi.rincianbiayaperms.index"
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
                                            "admin.transaksi.biayaperms.create"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "admin.transaksi.biayaperms.create"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.transaksi.biayaperms.create"
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
                                            "admin.transaksi.kasbons.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "admin.transaksi.kasbons.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.transaksi.kasbons.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Kasbon
                                    </Link>
                                </li>
                                {/* staf */}
                                <li className="items-center px-2 flex flex-row gap-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold flex items-center " +
                                            (currentRoute ===
                                            "admin.transaksi.keluarbiayapermusers.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "admin.transaksi.keluarbiayapermusers.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.transaksi.keluarbiayapermusers.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>
                                        <span>
                                            <span className="inline-block">
                                                Pengeluaran
                                            </span>
                                            <span className="inline-block">
                                                Biaya Permohonan
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold flex items-center " +
                                            (currentRoute ===
                                            "admin.transaksi.keluarbiayas.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "admin.transaksi.keluarbiayas.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.transaksi.keluarbiayas.index"
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
                                            "admin.transaksi.postingjurnals.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "admin.transaksi.postingjurnals.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.transaksi.postingjurnals.index"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>
                                        <span className="inline-block">
                                            Posting Jurnal
                                        </span>
                                    </Link>
                                </li>
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold flex items-center " +
                                            (currentRoute ===
                                            "admin.transaksi.events.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600 "
                                                : " text-blueGray-700 hover:text-blueGray-500 ")
                                        }
                                        href={route(
                                            "admin.transaksi.events.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.transaksi.events.index"
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
                                            "admin.informasi.prosespermohonans.index"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                : " text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "admin.informasi.prosespermohonans.index"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.informasi.prosespermohonans.index"
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
                                            "admin.informasi.prosespermohonans.bypermohonan"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                : " text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "admin.informasi.prosespermohonans.bypermohonan"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.informasi.prosespermohonans.bypermohonan"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Proses By Permohonan
                                    </Link>
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.informasi.keuangans.keluarbiayas"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                : " text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "admin.informasi.keuangans.keluarbiayas"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.informasi.keuangans.keluarbiayas"
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
                                            "admin.informasi.keuangans.keluarbiayapermusers"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                : " text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route(
                                            "admin.informasi.keuangans.keluarbiayapermusers"
                                        )}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.informasi.keuangans.keluarbiayapermusers"
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
                                <MenuItem expanded={true} label="Keuangan">
                                    <li className="items-center px-2">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (currentRoute ===
                                                "admin.informasi.keuangans.bukubesar"
                                                    ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                    : " text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            href={route(
                                                "admin.informasi.keuangans.bukubesar"
                                            )}
                                        >
                                            <i
                                                className={
                                                    "fas fa-tv mr-2 text-sm " +
                                                    (currentRoute ===
                                                    "admin.informasi.keuangans.bukubesar"
                                                        ? "opacity-75"
                                                        : "text-blueGray-300")
                                                }
                                            ></i>{" "}
                                            Buku Besar
                                        </Link>
                                    </li>

                                    <li className="items-center px-2">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (currentRoute ===
                                                "admin.informasi.keuangans.neraca"
                                                    ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                    : " text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            href={route(
                                                "admin.informasi.keuangans.neraca"
                                            )}
                                        >
                                            <i
                                                className={
                                                    "fas fa-tv mr-2 text-sm " +
                                                    (currentRoute ===
                                                    "admin.informasi.keuangans.neraca"
                                                        ? "opacity-75"
                                                        : "text-blueGray-300")
                                                }
                                            ></i>{" "}
                                            Neraca
                                        </Link>
                                    </li>
                                    <li className="items-center px-2">
                                        <Link
                                            className={
                                                "text-xs uppercase py-3 font-bold block " +
                                                (currentRoute ===
                                                "admin.informasi.statusbiayaperms"
                                                    ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                    : " text-blueGray-700 hover:text-blueGray-500")
                                            }
                                            href={route(
                                                "admin.informasi.statusbiayaperms"
                                            )}
                                        >
                                            <i
                                                className={
                                                    "fas fa-tv mr-2 text-sm " +
                                                    (currentRoute ===
                                                    "admin.informasi.statusbiayaperms"
                                                        ? "opacity-75"
                                                        : "text-blueGray-300")
                                                }
                                            ></i>{" "}
                                            Biaya Permohonan
                                        </Link>
                                    </li>
                                </MenuItem>
                            </MenuItem>
                            <MenuItem
                                expanded={
                                    currentRoute
                                        ? currentRoute.includes("utils")
                                        : false
                                }
                                label="Utility"
                            >
                                <li className="items-center px-2">
                                    <Link
                                        className={
                                            "text-xs uppercase py-3 font-bold block " +
                                            (currentRoute ===
                                            "admin.utils.backupdb"
                                                ? " text-lightBlue-500 hover:text-lightBlue-600"
                                                : " text-blueGray-700 hover:text-blueGray-500")
                                        }
                                        href={route("admin.utils.backupdb")}
                                    >
                                        <i
                                            className={
                                                "fas fa-tv mr-2 text-sm " +
                                                (currentRoute ===
                                                "admin.utils.backupdb"
                                                    ? "opacity-75"
                                                    : "text-blueGray-300")
                                            }
                                        ></i>{" "}
                                        Backup Database
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
