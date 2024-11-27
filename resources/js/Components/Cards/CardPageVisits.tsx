import { RecentActivity } from "@/types";
import React from "react";

// components
type Props = {
    recentActivities: RecentActivity[];
};
export default function CardPageVisits({ recentActivities }: Props) {
    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div className="rounded-t mb-0 px-4 py-3 border-2">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-2 max-w-full flex-grow flex-1">
                            <h3 className="font-semibold text-base text-blueGray-700">
                                Recent Activities
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    {/* Projects table */}
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                            <tr className="border-2">
                                <th className="p-2 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                    Proses
                                </th>
                                <th className="p-2 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                    Permohonan
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivities &&
                                recentActivities.map(
                                    (
                                        {
                                            nama_itemprosesperm,
                                            identitas,
                                            tanggal,
                                            catatan_proses_perm,
                                            nama_penerima,
                                        },
                                        idx
                                    ) => (
                                        <tr key={idx} className="border-2">
                                            <td className="border-t-0 px-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap ">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">
                                                        {nama_itemprosesperm}
                                                    </span>
                                                    <span className="text-xs italic">
                                                        {tanggal}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="border-t-0 p-2 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap ">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">
                                                        {nama_penerima}
                                                    </span>
                                                    <span className="text-xs italic">
                                                        {identitas}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
