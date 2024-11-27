import Pagination from "@/Components/Shared/Pagination";
import { Prosespermohonan } from "@/types";
import moment from "moment";

type Props = {
    prosespermohonans: {
        data: Prosespermohonan[];
        links: any;
    };
};
const CardListProsesbyPermohonan = ({
    prosespermohonans: { data, links },
}: Props) => {
    return (
        <div className="p-4 flex flex-col text-xs bg-blueGray-200 rounded-md shadow-lg shadow-gray-400">
            <h1 className="font-bold text-lg text-lightBlue-700">
                Proses Permohonan
            </h1>
            <ul className="list-none">
                {data &&
                    data.map((p, i: number) => (
                        <li key={i}>
                            <div className="relative w-full flex flex-row justify-between rounded-t-md mt-2 px-2 pt-2 bg-white text-lightBlue-700 font-bold text-xs">
                                <span>
                                    {p.itemprosesperm.nama_itemprosesperm}
                                </span>
                                <span>
                                    {
                                        p.transpermohonan.jenispermohonan
                                            .nama_jenispermohonan
                                    }{" "}
                                    (
                                    {p.transpermohonan.nodaftar_transpermohonan}
                                    /
                                    {p.transpermohonan.thdaftar_transpermohonan}
                                    )
                                </span>
                            </div>
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 mt-0 bg-white px-2 shadow">
                                <div className="w-full flex items-start flex-wrap">
                                    <div className="w-1/4">Pelepas</div>
                                    <div className="w-3/4">
                                        {
                                            p.transpermohonan.permohonan
                                                .nama_pelepas
                                        }
                                    </div>
                                    <div className="w-1/4">Penerima</div>
                                    <div className="w-3/4">
                                        {
                                            p.transpermohonan.permohonan
                                                .nama_penerima
                                        }
                                    </div>
                                    <div className="w-1/4">Alas Hak</div>
                                    <div className="w-3/4">
                                        {
                                            p.transpermohonan.permohonan
                                                .jenishak.singkatan
                                        }
                                        .
                                        {p.transpermohonan.permohonan.nomor_hak}
                                        ,{" "}
                                        {p.transpermohonan.permohonan.jenishak
                                            .singkatan == "C"
                                            ? "Ps " +
                                              p.transpermohonan.permohonan
                                                  .persil +
                                              ", " +
                                              p.transpermohonan.permohonan.klas
                                            : null}{" "}
                                        L.
                                        {
                                            p.transpermohonan.permohonan
                                                .luas_tanah
                                        }
                                        M2
                                    </div>
                                </div>
                                <div className="w-full flex items-start flex-wrap">
                                    <div className="w-1/4">Atas Nama</div>
                                    <div className="w-3/4">
                                        {p.transpermohonan.permohonan.atas_nama}
                                    </div>
                                    <div className="w-1/4">Lokasi</div>
                                    <div className="w-3/4">
                                        Desa{" "}
                                        {
                                            p.transpermohonan.permohonan.desa
                                                .nama_desa
                                        }
                                        ,{" "}
                                        {
                                            p.transpermohonan.permohonan.desa
                                                .kecamatan.nama_kecamatan
                                        }
                                    </div>
                                    <div className="w-1/4">User</div>
                                    <div className="w-3/4">
                                        {p.transpermohonan.permohonan.users &&
                                            p.transpermohonan.permohonan.users
                                                .length > 0 &&
                                            p.transpermohonan.permohonan.users.map(
                                                (u, i) => (
                                                    <span key={i}>
                                                        {i > 0 ? ", " : ""}
                                                        {u.name}
                                                    </span>
                                                )
                                            )}
                                    </div>
                                </div>
                            </div>
                            <div className="relative w-full rounded-b-md px-2 py-2 pb-2 bg-white text-red-700 text-xs shadow">
                                {p.statusprosesperms &&
                                    p.statusprosesperms.map((e, i) => (
                                        <ol
                                            className="flex flex-wrap w-full list-disc ml-3 gap-1"
                                            key={i}
                                        >
                                            <li>
                                                {moment(
                                                    e.pivot.created_at
                                                ).format("DD MMM YYYY HH:mm")}
                                            </li>
                                            <li className="ml-4">
                                                {e.nama_statusprosesperm}
                                            </li>
                                            {e.pivot
                                                .catatan_statusprosesperm ? (
                                                <li className="ml-4">
                                                    {
                                                        e.pivot
                                                            .catatan_statusprosesperm
                                                    }
                                                </li>
                                            ) : null}
                                        </ol>
                                    ))}
                            </div>
                        </li>
                    ))}
            </ul>
            <Pagination links={links} />
        </div>
    );
};

export default CardListProsesbyPermohonan;
