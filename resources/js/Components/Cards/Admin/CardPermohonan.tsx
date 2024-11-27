import ModalAddPermohonan from "@/Components/Modals/ModalAddPermohonan";
import { Permohonan, User } from "@/types";
import { divide } from "lodash";
import React, { useState } from "react";

type Props = {
    permohonan: Permohonan | undefined;
};

function CardPermohonan({ permohonan }: Props) {
    const [showModalEditPermohonan, setShowModalEditPermohonan] =
        useState<boolean>(false);
    const [permohonanId, setPermohonanId] = useState<string>("");
    return (
        <>
            {permohonan ? (
                <div className="relative flex flex-col min-w-0 break-words w-full mb-2 mt-2 shadow-md rounded-md bg-blueGray-50 border-0 text-xs">
                    <div className="flex-auto px-2 lg:px-4 py-4 pt-0">
                        <div className="relative w-full mt-2 grid grid-cols-2 md:grid-cols-4">
                            <span className="font-bold">No Daftar</span>
                            <span> {permohonan.no_daftar}</span>
                            <span className="font-bold">Tgl Daftar</span>
                            <span> {permohonan.tgl_daftar}</span>
                            <span className="font-bold">Nama Pelepas</span>
                            <span> {permohonan.nama_pelepas}</span>
                            <span className="font-bold">Nama Penerima</span>
                            <span> {permohonan.nama_penerima}</span>
                            <span className="font-bold">Alas Hak</span>
                            <span> {permohonan.nomor_hak}</span>
                            <span className="font-bold">Atas Nama</span>
                            <span> {permohonan.atas_nama}</span>
                            <span className="font-bold">Luas Tanah</span>
                            <span> {permohonan.luas_tanah} M2</span>
                            <span className="font-bold">Letak Obyek</span>
                            <span> {permohonan.letak_obyek}</span>
                            <span className="font-bold">Jenis Permohonan</span>
                            {permohonan.transpermohonan && (
                                <span>
                                    {
                                        permohonan.transpermohonan
                                            .jenispermohonan
                                            .nama_jenispermohonan
                                    }
                                </span>
                            )}
                            <span className="font-bold">Users</span>
                            <span>
                                {permohonan.users &&
                                    permohonan.users.map(
                                        (user: User, i: number) => (
                                            <span key={i}>
                                                {i > 0 ? ", " : ""}
                                                {user.name}
                                            </span>
                                        )
                                    )}
                            </span>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default CardPermohonan;
