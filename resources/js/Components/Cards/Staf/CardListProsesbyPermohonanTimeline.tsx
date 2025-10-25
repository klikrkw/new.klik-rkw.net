import Pagination from "@/Components/Shared/Pagination";
import { Prosespermohonan, Transpermohonan } from "@/types";
import moment from "moment";
import "react-vertical-timeline-component/style.min.css";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { EditActiveIcon } from "@/Components/Icon";

type Props = {
    prosespermohonans: {
        data: Prosespermohonan[];
        links: any;
    };
    transpermohonan: Transpermohonan;
};
const CardListProsesbyPermohonanTimeline = ({
    prosespermohonans: { data, links },
    transpermohonan,
}: Props) => {
    return (
        <div className="p-4 flex flex-col text-xs bg-blueGray-200 rounded-md shadow-lg shadow-gray-400 ">
            <h1 className="font-bold text-lg text-lightBlue-700 mb-2">
                Proses Permohonan
            </h1>
            {transpermohonan && (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 mt-0 bg-white px-2 shadow-md rounded-md p-2 ">
                    <div className="w-full flex items-start flex-wrap">
                        <div className="w-1/4">Permohonan</div>
                        <div className="w-3/4">
                            {
                                transpermohonan.jenispermohonan
                                    .nama_jenispermohonan
                            }
                            {" - "}
                            {transpermohonan.no_daftar}
                        </div>{" "}
                        <div className="w-1/4">Pelepas</div>
                        <div className="w-3/4">
                            {transpermohonan.permohonan.nama_pelepas}
                        </div>
                        <div className="w-1/4">Penerima</div>
                        <div className="w-3/4">
                            {transpermohonan.permohonan.nama_penerima}
                        </div>
                        <div className="w-1/4">Alas Hak</div>
                        <div className="w-3/4">
                            {transpermohonan.permohonan.jenishak?.singkatan}
                            {transpermohonan.permohonan.nomor_hak},{" "}
                            {transpermohonan.permohonan.jenishak?.singkatan ==
                            "C"
                                ? "Ps " +
                                  transpermohonan.permohonan.persil +
                                  ", " +
                                  transpermohonan.permohonan.klas
                                : null}{" "}
                            L.
                            {transpermohonan.permohonan.luas_tanah}
                            M2
                        </div>
                    </div>
                    <div className="w-full flex items-start flex-wrap">
                        <div className="w-1/4">Atas Nama</div>
                        <div className="w-3/4">
                            {transpermohonan.permohonan.atas_nama}
                        </div>
                        <div className="w-1/4">Lokasi</div>
                        <div className="w-3/4">
                            Desa {transpermohonan.permohonan.letak_obyek}
                        </div>
                        <div className="w-1/4">User</div>
                        <div className="w-3/4">
                            {transpermohonan.permohonan.users &&
                                transpermohonan.permohonan.users.length > 0 &&
                                transpermohonan.permohonan.users.map((u, i) => (
                                    <span key={i}>
                                        {i > 0 ? ", " : ""}
                                        {u.name}
                                    </span>
                                ))}
                        </div>
                        <div className="w-1/4">&nbsp;</div>
                        <div className="w-3/4"></div>
                    </div>
                </div>
            )}
            {data &&
                data.map((p, i: number) => (
                    <VerticalTimeline key={p.id}>
                        {p.statusprosesperms &&
                            p.statusprosesperms.map((e, idx) => (
                                <VerticalTimelineElement
                                    key={e.id}
                                    className="vertical-timeline-element--work"
                                    position={`${
                                        i % 2 === 0 ? "left" : "right"
                                    }`}
                                    contentStyle={{
                                        background: "rgb(33, 150, 243)",
                                        color: "#fff",
                                    }}
                                    contentArrowStyle={{
                                        borderRight:
                                            "7px solid  rgb(33, 150, 243)",
                                    }}
                                    dateClassName="timeline-date"
                                    date={moment(e.pivot.created_at).format(
                                        "DD MMM YYYY HH:mm"
                                    )}
                                    iconStyle={{
                                        background: "rgba(168, 229, 245, 1)",
                                        color: "#fff",
                                    }}
                                    icon={
                                        <div className="rounded-full p-2">
                                            <img
                                                src={e.image_statusprosesperm}
                                                className="w-full"
                                            />
                                        </div>
                                    }
                                >
                                    <div className="w-full flex flex-col p-2 text-sm bg-white/30 shadow-md rounded-md">
                                        <h3 className="vertical-timeline-element-title font-bold">
                                            {e.nama_statusprosesperm}
                                        </h3>
                                        <h4 className="vertical-timeline-element-subtitle text-xs">
                                            {
                                                p.itemprosesperm
                                                    .nama_itemprosesperm
                                            }
                                        </h4>
                                        <div className="flex flex-row justify-between text-xs">
                                            {p.catatan_prosesperm}
                                        </div>
                                    </div>
                                </VerticalTimelineElement>
                            ))}
                    </VerticalTimeline>
                ))}
            {data && data.length > 0 && (
                <VerticalTimeline>
                    <VerticalTimelineElement
                        iconStyle={{
                            background: "rgb(16, 204, 82)",
                            color: "#fff",
                        }}
                        icon={
                            <svg
                                className="MuiSvgIcon-root"
                                focusable="false"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                            </svg>
                        }
                    />
                </VerticalTimeline>
            )}

            <Pagination links={links} />
        </div>
    );
};

export default CardListProsesbyPermohonanTimeline;
