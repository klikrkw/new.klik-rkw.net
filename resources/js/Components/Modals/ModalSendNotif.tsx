import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { LoadingButton } from "../Shared/LoadingButton";
import LinkButton from "../Shared/LinkButton";
import {
    OptionSelect,
    Prosespermohonan,
    StatusprosespermProsespermohonan,
    Transpermohonan,
} from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import useSwal from "@/utils/useSwal";
import SelectSearch from "../Shared/SelectSearch";
import { GroupBase, MultiValue, OptionsOrGroups } from "react-select";
import apputils from "@/bootstrap";

type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
    userOpts: OptionSelect[];
    statusprosesperm: StatusprosespermProsespermohonan | null;
    transpermohonan: Transpermohonan;
    prosesperm: Prosespermohonan | null;
};
const ModalSendNotif = ({
    showModal,
    setShowModal,
    userOpts,
    statusprosesperm,
    transpermohonan,
    prosesperm,
}: Props) => {
    // const { rekenings, metodebayars, itemkegiatansOpts, instansiOpts } =
    // usePage<{
    //     metodebayars: OptionSelect[];
    //     rekenings: OptionSelect[];
    //     itemkegiatansOpts: OptionSelect[];
    //     instansiOpts: OptionSelect[];
    // }>().props;

    type FormValues = {
        users: OptionSelect[];
        _method: string;
    };
    const notifTypeOpts: OptionSelect[] = [
        { label: "Notification", value: "notification" },
        { label: "Whatsapp", value: "whatsapp" },
    ];

    const [allUser, setAllUser] = useState(true);
    const { data, setData, errors, post, processing, reset } =
        useForm<FormValues>({
            users: [],
            _method: "POST",
        });

    function handleSubmit(e: any) {
        e.preventDefault();
        if (!allUser && userOpts.length < 1) {
            return;
        }
        if (statusprosesperm) {
            sendMessageToMobile(
                prosesperm ? prosesperm.itemprosesperm.nama_itemprosesperm : "",
                `${transpermohonan.no_daftar} - [${
                    transpermohonan.jenispermohonan.nama_jenispermohonan
                } - ${transpermohonan.permohonan.nama_penerima}-${
                    transpermohonan.permohonan.nomor_hak
                },${transpermohonan.permohonan.letak_obyek}]${
                    statusprosesperm.nama_statusprosesperm
                } - ${
                    statusprosesperm.pivot.catatan_statusprosesperm
                        ? statusprosesperm.pivot.catatan_statusprosesperm
                        : ""
                }, Petugas : ${statusprosesperm.user.name}`,
                {
                    navigationId: "main",
                },
                pesan
            ).then(() => {
                setShowModal(false);
            });
        } else {
            console.log("error");
        }
    }

    const [notifType, setNotifType] = useState<OptionSelect>(notifTypeOpts[0]);
    const [users, setUsers] = useState<OptionSelect[]>([]);
    const [pesan, setPesan] = useState<string>("");
    const sendMessageToMobile = async (
        title: string,
        body: string,
        datas: { navigationId: string } & object,
        pesan: string
    ) => {
        let xlink = `/admin/messages/api/sendmessagetomobile`;
        if (notifType.value === "whatsapp") {
            xlink = `/admin/notifikasis/api/sendwhatsapp`;
        }
        let userids = users.map((usr) => usr.value);
        if (allUser) {
            userids = userOpts.map((usr) => usr.value);
        }
        if (userids.length < 1) {
            return;
        }
        const response = await apputils.backend.post(xlink, {
            user_ids: userids,
            title,
            body,
            datas,
            pesan,
            alluser: allUser,
        });
        const data = response.data;
    };
    return (
        <Modal
            show={showModal}
            maxWidth="md"
            closeable={false}
            onClose={() => setShowModal(false)}
        >
            <div className="p-4 bg-blueGray-100 rounded-md">
                <form onSubmit={handleSubmit}>
                    <h1 className="font-bold text-xl text-blueGray-700 mb-4">
                        KIRIM NOTIFIKASI
                    </h1>
                    <div className="w-full flex flex-col items-start gap-2">
                        <SelectSearch
                            name="notif_type"
                            label="Jenis Notifikasi"
                            value={notifType}
                            options={notifTypeOpts}
                            className="w-full md:w-1/2"
                            onChange={(e: any) => setNotifType(e ? e : {})}
                        />

                        <div className="flex items-center">
                            <input
                                // tabIndex={-1}
                                type="checkbox"
                                className="w-3 h-3 rounded-md text-sm text-gray-600 mx-2"
                                // disabled={isDisabledCheck}
                                onChange={() => {
                                    setUsers([]);
                                    setAllUser((prev) => !prev);
                                }}
                                defaultChecked={allUser}
                            />
                            <label className="text-md text-gray-800 mr-1">
                                All Petugas
                            </label>
                        </div>
                        <SelectSearch
                            name="user_id"
                            value={users}
                            isMulti
                            options={userOpts}
                            className="w-full"
                            onChange={(e: any) => setUsers(e ? e : {})}
                            isDisabled={allUser}
                        />
                        <div className="w-full flex flex-col">
                            <label className="text-md text-gray-800 mr-1">
                                Isi Pesan
                            </label>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md mt-1"
                                rows={3}
                                name="pesan"
                                value={pesan}
                                onChange={(e) => setPesan(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-4 w-full flex justify-between items-center">
                        <LoadingButton
                            theme="black"
                            loading={processing}
                            type="submit"
                        >
                            <span>Kirim</span>
                        </LoadingButton>
                        <LinkButton
                            href="#"
                            theme="blue"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowModal(false);
                            }}
                        >
                            <span>Close</span>
                        </LinkButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ModalSendNotif;
