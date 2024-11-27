import Modal from "@/Components/Modals/Modal";
import Button from "@/Components/Shared/Button";
import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import SelectSearch from "@/Components/Shared/SelectSearch";
import {
    OptionSelect,
    Prosespermohonan,
    Statusprosesperm,
    StatusprosespermProsespermohonan,
    OptionSelectDisabled,
    Transpermohonan,
    User,
} from "@/types";
import useSwal from "@/utils/useSwal";
import { Link, router, useForm } from "@inertiajs/react";
import moment from "moment";
import React, { SyntheticEvent, useState } from "react";
import apputils from "@/bootstrap";
import { trim } from "lodash";

type Props = {
    prosespermohonans: Prosespermohonan[];
    statusprosesperms: OptionSelectDisabled[];
    transpermohonan: Transpermohonan;
};

function CardTableProsespermohonans({
    prosespermohonans,
    statusprosesperms,
    transpermohonan,
}: Props) {
    type FormValues = {
        prosespermohonan_id: string;
        prosespermohonan: Prosespermohonan | unknown;
        statusprosesperm_id: string;
        statusprosesperm: OptionSelect | unknown;
        catatan_statusprosesperm: string;
        _method: string;
    };

    const { data, setData, errors, post, processing, reset } =
        useForm<FormValues>({
            prosespermohonan_id: "",
            prosespermohonan: null,
            statusprosesperm_id: "",
            statusprosesperm: null,
            catatan_statusprosesperm: "",
            _method: "POST",
        });
    const [statuspermOpts, setstatusPermOpts] = useState<OptionSelect[]>([]);
    // const [statuspermOpts, setstatusPermOpts] = useState<
    //     OptionSelectDisabled[]
    // >([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalMessage, setShowModalMessage] = useState<boolean>(false);
    function handleSubmit(e: any) {
        e.preventDefault();
        post(
            route(
                "admin.transaksi.prosespermohonans.statusprosesperms.store",
                data.prosespermohonan_id
            ),
            {
                onSuccess: () => {
                    reset(
                        "prosespermohonan_id",
                        "statusprosesperm_id",
                        "catatan_statusprosesperm"
                    );
                    setShowModal(false);
                },
            }
        );
    }

    const sendMessageToMobile = async (
        users: User[],
        title: string,
        body: string,
        datas: { navigationId: string } & object
    ) => {
        let xlink = `/admin/messages/api/sendmessagetomobile`;
        const userids = users.map((usr) => usr.id);
        const response = await apputils.backend.post(xlink, {
            user_ids: userids,
            title,
            body,
            datas,
        });
        const data = response.data;
    };

    // const handleShowModal = (opts: StatusprosespermProsespermohonan[]) => {
    const handleShowModal = () => {
        // { value: number, label: string, isDisabled: boolean }
        // const ids = opts.map((a) => a.id);
        // const newStatusprosesperms = statusprosesperms.reduce<
        //     OptionSelectDisabled[]
        // >((p, s, i) => {
        //     p[i] = ids.includes(s.value)
        //         ? { value: s.value, label: s.label, isDisabled: true }
        //         : { value: s.value, label: s.label, isDisabled: false };
        //     return p;
        // }, []);
        // setstatusPermOpts(newStatusprosesperms);
        setstatusPermOpts(statusprosesperms);

        setShowModal(true);
    };
    const handleShowModalEdit = (
        e: SyntheticEvent,
        statusprosesperm: StatusprosespermProsespermohonan,
        prosespermohonan_id: string
    ) => {
        // { value: number, label: string, isDisabled: boolean }
        // const ids = opts.map((a) => a.id);
        // const newStatusprosesperms = statusprosesperms.reduce<
        //     OptionSelectDisabled[]
        // >((p, s, i) => {
        //     p[i] = ids.includes(s.value)
        //         ? { value: s.value, label: s.label, isDisabled: true }
        //         : { value: s.value, label: s.label, isDisabled: false };
        //     return p;
        // }, []);
        // setstatusPermOpts(newStatusprosesperms);
        e.preventDefault();
        setData({
            ...data,
            prosespermohonan_id: prosespermohonan_id,
            catatan_statusprosesperm:
                statusprosesperm.pivot.catatan_statusprosesperm,
            statusprosesperm_id: statusprosesperm.id,
            statusprosesperm: {
                value: statusprosesperm.id,
                label: statusprosesperm.nama_statusprosesperm,
            },
        });
        setstatusPermOpts(statusprosesperms);

        setShowModal(true);
    };

    const handleRemoveData = (prosespermohonan_id: string, id: string) => {
        router.delete(
            route(
                "admin.transaksi.prosespermohonans.statusprosesperms.destroy",
                [prosespermohonan_id, id]
            ),
            { only: ["prosespermohonans"] }
        );
    };

    return (
        <div className="w-full mt-4 flex flex-col">
            <ul className="list-none container-snap max-h-56 overflow-x-hidden">
                <li className="flex relative flex-row w-full items-center rounded-t-md text-sm border justify-start bg-lightBlue-600 border-blueGray-400 px-2 py-2 gap-1 text-lightBlue-50 font-bold">
                    <div className="w-[5%]">No</div>
                    <div className="w-[15%]">Tanggal</div>
                    <div className="w-[40%] md:w-[25%]">Nama Proses</div>
                    <div className="hidden md:block w-[25%]">Catatan</div>
                    <div className="w-[15%]">User</div>
                    <div className="flex-shrink-0">Menu</div>
                </li>
            </ul>
            <ul className="list-none container-snap max-h-80 overflow-x-hidden rounded-b-md shadow-md">
                {prosespermohonans &&
                    prosespermohonans.map(
                        (prosesperm: Prosespermohonan, index: number) => (
                            <li
                                key={index}
                                className="w-full flex flex-col overflow-hidden bg-lightBlue-200"
                            >
                                <div className="flex w-full text-sm px-2 py-2 items-center justify-start gap-1 font-semibold text-lightBlue-600 border-t-2 border-lightBlue-400">
                                    <div className="w-[5%]">{index + 1}</div>
                                    <div className="w-[15%]">
                                        {prosesperm.tgl_proses}
                                    </div>
                                    <div className="w-[40%] md:w-[25%]">
                                        {
                                            prosesperm.itemprosesperm
                                                .nama_itemprosesperm
                                        }
                                    </div>
                                    <div className="hidden md:block md:w-[25%]">
                                        {prosesperm.catatan_prosesperm}
                                    </div>
                                    <div className="w-[15%]">
                                        {prosesperm.user.name}{" "}
                                    </div>

                                    {/* <div className="flex-shrink-0 flex justify-start items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                setData(
                                                    "prosesperm_id",
                                                    prosesperm.id
                                                );
                                                handleShowModal();
                                            }}
                                            className="text-lightBlue-500 background-transparent text-xl font-bold uppercase px-0 py-0 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                        >
                                            <i
                                                className="fa fa-plus-circle"
                                                aria-hidden="true"
                                            ></i>
                                        </button>
                                    </div> */}
                                </div>

                                {prosesperm.statusprosesperms.length > 0 ? (
                                    <div className="w-full flex flex-col text-sm border-t-2 border-lightBlue-400">
                                        <div className="list-none w-full px-6 bg-lightBlue-100  text-lightBlue-700">
                                            {prosesperm.statusprosesperms.map(
                                                (
                                                    statusprosesperm: StatusprosespermProsespermohonan,
                                                    idx: number
                                                ) => {
                                                    if (
                                                        statusprosesperm.pivot
                                                            .active
                                                    ) {
                                                        return (
                                                            <div
                                                                className="w-full"
                                                                key={idx}
                                                            >
                                                                <ol className="flex flex-row w-full items-center text-xs gap-1">
                                                                    <li className="py-2">
                                                                        <img
                                                                            src={
                                                                                statusprosesperm.image_statusprosesperm
                                                                            }
                                                                            className="h-5 w-auto"
                                                                            aria-hidden
                                                                            alt=""
                                                                        />
                                                                    </li>
                                                                    <li className="font-semibold">
                                                                        {
                                                                            statusprosesperm.nama_statusprosesperm
                                                                        }
                                                                    </li>
                                                                    <li>
                                                                        {statusprosesperm
                                                                            .pivot
                                                                            .catatan_statusprosesperm
                                                                            ? "(" +
                                                                              statusprosesperm
                                                                                  .pivot
                                                                                  .catatan_statusprosesperm +
                                                                              ")"
                                                                            : ""}
                                                                    </li>
                                                                    <li>
                                                                        oleh{" "}
                                                                        <span className="font-semibold">
                                                                            {
                                                                                statusprosesperm
                                                                                    .user
                                                                                    .name
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                    <li className="italic mr-2">
                                                                        {moment(
                                                                            statusprosesperm
                                                                                .pivot
                                                                                .created_at
                                                                        ).format(
                                                                            "DD MMM YYYY"
                                                                        )}
                                                                    </li>
                                                                    <li>
                                                                        <Link
                                                                            className="rounded-full bg-white/80 px-2 py-1 shadow-lg font-bold text-lightBlue-500"
                                                                            key={
                                                                                index
                                                                            }
                                                                            href="#"
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                handleShowModalEdit(
                                                                                    e,
                                                                                    statusprosesperm,
                                                                                    prosesperm.id
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="fas fa-edit"></i>{" "}
                                                                            Ubah
                                                                        </Link>
                                                                    </li>
                                                                    <li>
                                                                        <a
                                                                            className="rounded-full bg-white/80 px-2 py-1 shadow-lg font-bold text-lightBlue-500"
                                                                            href="#"
                                                                            onClick={() =>
                                                                                useSwal
                                                                                    .confirm(
                                                                                        {
                                                                                            title: "Kirim Pesan",
                                                                                            text: "apakah akan mengirim pesan?",
                                                                                        }
                                                                                    )
                                                                                    .then(
                                                                                        (
                                                                                            result
                                                                                        ) => {
                                                                                            if (
                                                                                                result.isConfirmed
                                                                                            ) {
                                                                                                sendMessageToMobile(
                                                                                                    transpermohonan
                                                                                                        .permohonan
                                                                                                        .users,
                                                                                                    prosesperm
                                                                                                        .itemprosesperm
                                                                                                        .nama_itemprosesperm,
                                                                                                    `${
                                                                                                        transpermohonan.no_daftar
                                                                                                    } - [${
                                                                                                        transpermohonan
                                                                                                            .jenispermohonan
                                                                                                            .nama_jenispermohonan
                                                                                                    } - ${
                                                                                                        transpermohonan
                                                                                                            .permohonan
                                                                                                            .nama_penerima
                                                                                                    }-${
                                                                                                        transpermohonan
                                                                                                            .permohonan
                                                                                                            .nomor_hak
                                                                                                    },${
                                                                                                        transpermohonan
                                                                                                            .permohonan
                                                                                                            .letak_obyek
                                                                                                    }]
                                                                                                        ${
                                                                                                            statusprosesperm.nama_statusprosesperm
                                                                                                        } - ${
                                                                                                        statusprosesperm
                                                                                                            .pivot
                                                                                                            .catatan_statusprosesperm
                                                                                                            ? statusprosesperm
                                                                                                                  .pivot
                                                                                                                  .catatan_statusprosesperm
                                                                                                            : ""
                                                                                                    }, Petugas : ${
                                                                                                        statusprosesperm
                                                                                                            .user
                                                                                                            .name
                                                                                                    }`,
                                                                                                    {
                                                                                                        navigationId:
                                                                                                            "main",
                                                                                                    }
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    )
                                                                            }
                                                                        >
                                                                            <i className="fas fa-message"></i>{" "}
                                                                            Kirim
                                                                            Pesan
                                                                        </a>
                                                                    </li>
                                                                    {/* <li>
                                                                        <button
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                useSwal
                                                                                    .confirm(
                                                                                        {
                                                                                            title: "Hapus Data",
                                                                                            text: "apakah akan menghapus?",
                                                                                        }
                                                                                    )
                                                                                    .then(
                                                                                        (
                                                                                            result
                                                                                        ) => {
                                                                                            if (
                                                                                                result.isConfirmed
                                                                                            ) {
                                                                                                handleRemoveData(
                                                                                                    prosespermohonan.id,
                                                                                                    statusprosesperm.id
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    )
                                                                            }
                                                                            className="text-lightBlue-400 background-transparent font-bold px-3 py-0 text-sm outline-none focus:outline-none hover:text-lightBlue-600 hover:scale-105 mr-1 mb-1 mt-1 ease-linear transition-all duration-150"
                                                                            type="button"
                                                                        >
                                                                            <i
                                                                                className="fa fa-minus-circle"
                                                                                aria-hidden="true"
                                                                            ></i>
                                                                        </button>
                                                                    </li> */}
                                                                </ol>
                                                            </div>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                }
                                            )}
                                        </div>
                                    </div>
                                ) : null}
                            </li>
                        )
                    )}
            </ul>

            {/* <table className="divide-y divide-green-400 w-full ">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-2 text-xs text-gray-500">
                                No
                            </th>
                            <th className="px-2 py-2 text-xs text-gray-500">
                                Tanggal
                            </th>
                            <th className="px-2 py-2 text-xs text-gray-500">
                                Nama Proses
                            </th>
                            <th className="px-2 py-2 text-xs text-gray-500">
                                Catatan
                            </th>
                            <th className="px-2 py-2 text-xs text-gray-500">
                                User
                            </th>
                            <th className="px-2 py-2 text-xs text-gray-500">
                                Menu
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {prosespermohonans && prosespermohonans.map((prosespermohonan: Prosespermohonan, index: number) => (
                            <tr className="whitespace-nowrap" key={prosespermohonan.id}>
                                <td className="px-4 py-2 text-sm text-gray-500">
                                    {index + 1}
                                </td>
                                <td className="px-2 py-2 text-sm text-gray-500">
                                    {prosespermohonan.tgl_proses}
                                </td>
                                <td className="px-2 py-2">
                                    <div className="text-sm text-gray-900">
                                        {prosespermohonan.itemprosesperm.nama_itemprosesperm}
                                    </div>
                                </td>
                                <td className="px-2 py-2">
                                    {prosespermohonan.catatan_prosesperm}
                                </td>
                                <td className="px-2 py-2 text-sm text-gray-500">
                                    {prosespermohonan.user.name}
                                </td>
                                <td className="px-2 py-2">
                                    <Button theme='blue' onClick={(e) => {
                                        setData('prosespermohonan_id', prosespermohonan.id)
                                        setShowModal(true)
                                    }
                                    }><span>Add</span></Button>
                                </td>
                            </tr>
                        )
                        )}

                    </tbody>
                </table> */}
            <Modal
                show={showModalMessage}
                maxWidth="md"
                closeable={true}
                onClose={() => alert("modal close")}
            >
                <div className="p-4 flex flex-col">
                    <div className="flex flex-row justify-between">
                        <a
                            href="#"
                            className="bg-white/80 shadow-lg text-lightBlue-500 text-sm"
                            onClick={() => setShowModalMessage(true)}
                        >
                            <i className="fas fa-close"></i>
                        </a>
                    </div>
                </div>
            </Modal>
            <Modal
                show={showModal}
                maxWidth="md"
                closeable={false}
                onClose={() => alert("modal close")}
            >
                <div className="p-4">
                    <form onSubmit={handleSubmit}>
                        <SelectSearch
                            name="itemprosesperm_id"
                            label="Status Proses"
                            value={data.statusprosesperm}
                            options={statuspermOpts}
                            onChange={(e: any) =>
                                setData({
                                    ...data,
                                    statusprosesperm_id: e ? e.value : "",
                                    statusprosesperm: e ? e : {},
                                })
                            }
                            errors={errors.statusprosesperm_id}
                        />
                        <Input
                            name="catatan_statusprosesperm"
                            label="Catatan"
                            errors={errors.catatan_statusprosesperm}
                            value={data.catatan_statusprosesperm}
                            onChange={(e) =>
                                setData(
                                    "catatan_statusprosesperm",
                                    e.target.value
                                )
                            }
                        />
                        <div className="mt-4 w-full flex justify-between items-center">
                            <LoadingButton
                                theme="black"
                                loading={processing}
                                type="submit"
                            >
                                <span>Simpan</span>
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
        </div>
    );
}

export default CardTableProsespermohonans;
