import { RecentActivity } from "@/types";
import { Link } from "@inertiajs/react";
import React from "react";
import DashboardIcon from "../Shared/DashboardIcon";

// components
type Props = {
    baseRoute: string;
};
export default function CardMenus({ baseRoute }: Props) {
    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-slate-200 w-full shadow-lg rounded">
                <div className="block w-full overflow-x-auto">
                    <div className="flex flex-col p-4 ">
                        <div className="w-full p-2 mb-2 bg-slate-400 shadow-md">
                            <h1 className="font-bold text-blueGray-200">
                                Data Master
                            </h1>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 px-2 ">
                            <DashboardIcon
                                url={baseRoute + "users.index"}
                                title="User"
                                iconName="fa-users"
                            />
                            <DashboardIcon
                                url={baseRoute + "permohonans.index"}
                                title="Permohonan"
                                iconName="fa-address-card"
                            />
                            <DashboardIcon
                                url={baseRoute + "itemkegiatans.index"}
                                title="Item Kegiatan"
                                iconName="fa-list"
                            />
                            <DashboardIcon
                                url={baseRoute + "itemprosesperms.index"}
                                title="Item Proses"
                                iconName="fa-list"
                            />
                            <DashboardIcon
                                url={baseRoute + "statusprosesperms.index"}
                                title="Status Proses"
                                iconName="fa-list"
                            />
                            <DashboardIcon
                                url={baseRoute + "tempatarsips.index"}
                                title="Tempat Arsip"
                                iconName="fa-book"
                            />
                        </div>
                        <div className="w-full p-2 mb-2 bg-slate-400 shadow-md mt-3">
                            <h1 className="font-bold text-blueGray-200">
                                Transaksi Umum
                            </h1>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 px-2 ">
                            <DashboardIcon
                                url={
                                    baseRoute +
                                    "transaksi.prosespermohonans.create"
                                }
                                title="Proses Permohonan"
                                iconName="fa-gears"
                            />
                            <DashboardIcon
                                url={
                                    baseRoute +
                                    "transaksi.transpermohonans.tempatarsips.create"
                                }
                                title="Tempat Arsip"
                                iconName="fa-archive"
                            />
                            <DashboardIcon
                                url={baseRoute + "transaksi.events.index"}
                                title="Event"
                                iconName="fa-calendar"
                            />
                        </div>
                        <div className="w-full p-2 mb-2 bg-slate-400 shadow-md mt-3">
                            <h1 className="font-bold text-blueGray-200">
                                Transaksi Keuangan
                            </h1>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 px-2 ">
                            <DashboardIcon
                                url={
                                    baseRoute +
                                    "transaksi.rincianbiayaperms.index"
                                }
                                title="Rincian Biaya"
                                iconName="fa-list-ol"
                            />
                            <DashboardIcon
                                url={baseRoute + "transaksi.biayaperms.create"}
                                title="Biaya Permohonan"
                                iconName="fa-shopping-cart"
                            />
                            <DashboardIcon
                                url={baseRoute + "transaksi.kasbons.index"}
                                title="Kasbon"
                                iconName="fa-shopping-bag"
                            />
                            <DashboardIcon
                                url={baseRoute + "transaksi.keluarbiayas.index"}
                                title="Pengeluaran Umum"
                                iconName="fa-shopping-cart"
                            />
                            <DashboardIcon
                                url={
                                    baseRoute +
                                    "transaksi.keluarbiayapermusers.index"
                                }
                                title="Pengeluaran Permohonan"
                                iconName="fa-shopping-cart"
                            />
                            <DashboardIcon
                                url={
                                    baseRoute + "transaksi.postingjurnals.index"
                                }
                                title="Posting Jurnal"
                                iconName="fa-list-ul"
                            />
                        </div>
                        <div className="w-full p-2 mb-2 bg-slate-400 shadow-md mt-3">
                            <h1 className="font-bold text-blueGray-200">
                                Informasi
                            </h1>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 px-2 ">
                            <DashboardIcon
                                url={
                                    baseRoute +
                                    "informasi.prosespermohonans.index"
                                }
                                title="Proses Permohonan"
                                iconName="fa-list"
                            />
                            <DashboardIcon
                                url={
                                    baseRoute +
                                    "informasi.prosespermohonans.bypermohonan"
                                }
                                title="Proses By Permohonan"
                                iconName="fa-list"
                            />
                            <DashboardIcon
                                url={
                                    baseRoute +
                                    "informasi.keuangans.keluarbiayas"
                                }
                                title="Pengeluaran Umum"
                                iconName="fa-list"
                            />
                            <DashboardIcon
                                url={
                                    baseRoute +
                                    "informasi.keuangans.keluarbiayapermusers"
                                }
                                title="Pengeluaran Permohonan"
                                iconName="fa-users"
                            />
                            <DashboardIcon
                                url={baseRoute + "informasi.statusbiayaperms"}
                                title="Status Biaya Permohonan"
                                iconName="fa-users"
                            />
                            <DashboardIcon
                                url={
                                    baseRoute + "informasi.keuangans.bukubesar"
                                }
                                title="Buku Besar"
                                iconName="fa-users"
                            />
                            <DashboardIcon
                                url={baseRoute + "informasi.keuangans.neraca"}
                                title="Neraca"
                                iconName="fa-users"
                            />
                            <DashboardIcon
                                url={baseRoute + "permohonans.qrcode.create"}
                                title="Label Berkas dan Qr Qode"
                                iconName="fa-qrcode"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
