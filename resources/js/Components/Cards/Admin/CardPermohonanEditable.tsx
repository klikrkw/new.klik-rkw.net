import ModalAddPermohonan from "@/Components/Modals/ModalAddPermohonan";
import { Permohonan, User } from "@/types";
import { Link } from "@inertiajs/react";
import { divide } from "lodash";
import React, { useEffect, useState } from "react";

type Props = {
    permohonan: Permohonan | undefined;
    base_route?: string;
    setPermohonan?: (permohonan: Permohonan | undefined) => void;
};

function CardPermohonanEditable({
    permohonan,
    base_route,
    setPermohonan,
}: Props) {
    const [showModalEditPermohonan, setShowModalEditPermohonan] =
        useState<boolean>(false);
    const [permohonanId, setPermohonanId] = useState<string>("");
    const [newpermohonan, setNewpermohonan] = useState<
        Permohonan | undefined
    >();

    const setCPermohonan = (perm: Permohonan | undefined) => {
        setPermohonan ? setPermohonan(perm) : null;
        setNewpermohonan(perm);
    };
    useEffect(() => {
        setNewpermohonan(permohonan);
    }, [permohonan]);

    return (
        <>
            {newpermohonan ? (
                <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg rounded-lg bg-blueGray-50 border-0 text-xs mt-2">
                    <div className="flex-auto px-2 lg:px-4 py-4 pt-0">
                        <div className="relative w-full mt-2 grid grid-cols-2 md:grid-cols-4">
                            <span className="font-bold">No Daftar</span>
                            <span>
                                {" "}
                                {
                                    newpermohonan.transpermohonan
                                        .nodaftar_transpermohonan
                                }
                                /
                                {
                                    newpermohonan.transpermohonan
                                        .thdaftar_transpermohonan
                                }
                            </span>
                            <span className="font-bold">Tgl Daftar</span>
                            <span> {newpermohonan.tgl_daftar}</span>
                            <span className="font-bold">Nama Pelepas</span>
                            <span> {newpermohonan.nama_pelepas}</span>
                            <span className="font-bold">Nama Penerima</span>
                            <span> {newpermohonan.nama_penerima}</span>
                            <span className="font-bold">Alas Hak</span>
                            <span> {newpermohonan.nomor_hak}</span>
                            <span className="font-bold">Atas Nama</span>
                            <span> {newpermohonan.atas_nama}</span>
                            <span className="font-bold">Luas Tanah</span>
                            <span> {newpermohonan.luas_tanah} M2</span>
                            <span className="font-bold">Letak Obyek</span>
                            <span> {newpermohonan.letak_obyek}</span>
                            <span className="font-bold">Jenis Permohonan</span>
                            {newpermohonan.transpermohonan && (
                                <span>
                                    {
                                        newpermohonan.transpermohonan
                                            .jenispermohonan
                                            .nama_jenispermohonan
                                    }
                                </span>
                            )}
                            <span className="font-bold">Users</span>
                            <span>
                                {newpermohonan.users &&
                                    newpermohonan.users.map(
                                        (user: User, i: number) => (
                                            <span key={i}>
                                                {i > 0 ? ", " : ""}
                                                {user.name}
                                            </span>
                                        )
                                    )}
                            </span>
                            <Link
                                href="#"
                                tabIndex={-1}
                                className="z-30 w-8 h-8 px-2 py-2 text-center rounded-full bg-blue-600/20 shadow-xl mb-1 absolute -bottom-2 -right-2 "
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPermohonanId(newpermohonan.id);
                                    setShowModalEditPermohonan(true);
                                }}
                            >
                                <i className="fas fa-edit text-md text-center text-gray-700"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            ) : null}
            <ModalAddPermohonan
                showModal={showModalEditPermohonan}
                setShowModal={setShowModalEditPermohonan}
                setPermohonan={setCPermohonan}
                src={route(base_route + "permohonans.modal.edit", permohonanId)}
            />
        </>
    );
}

export default CardPermohonanEditable;
