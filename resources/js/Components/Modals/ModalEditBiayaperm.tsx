import React, { useEffect } from "react";
import Modal from "./Modal";
import { LoadingButton } from "../Shared/LoadingButton";
import LinkButton from "../Shared/LinkButton";
import { Biayaperm, OptionSelect, Transpermohonan, User } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import Input from "../Shared/Input";
import MoneyInput from "../Shared/MoneyInput";
import { preventOverflow } from "@popperjs/core";
import useSwal from "@/utils/useSwal";

type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
    biayaperm: Biayaperm;
};
const ModalEditBiayaperm = ({ showModal, setShowModal, biayaperm }: Props) => {
    type FormValues = {
        transpermohonan_id: string;
        jumlah_biayaperm: string;
        jumlah_bayar: string;
        kurang_bayar: string;
        catatan_biayaperm: string;
        image_biayaperm: string;
        _method: string;
    };

    const { data, setData, errors, post, processing, reset } =
        useForm<FormValues>({
            transpermohonan_id: biayaperm.transpermohonan.id || "",
            jumlah_biayaperm: biayaperm.jumlah_biayaperm.toString() || "",
            jumlah_bayar: biayaperm.jumlah_bayar.toString() || "",
            kurang_bayar: biayaperm.kurang_bayar.toString() || "",
            catatan_biayaperm: biayaperm.catatan_biayaperm || "",
            image_biayaperm: biayaperm.image_biayaperm || "",
            _method: "PUT",
        });

    function handleSubmit(e: any) {
        e.preventDefault();
        useSwal
            .confirm({
                title: "Simpan Data",
                text: "apakah akan menyimpan?",
            })
            .then((result) => {
                if (result.isConfirmed) {
                    post(route("transaksi.biayaperms.update", biayaperm.id), {
                        onSuccess: () => {
                            setShowModal(false);
                        },
                    });
                }
            });
    }

    const getKurangBayar = (jmlBiaya: number, jmlBayar: number) => {
        let xkurang = jmlBiaya > jmlBayar ? jmlBiaya - jmlBayar : 0;
        return xkurang.toString();
    };
    useEffect(() => {
        setData((prev) => ({
            ...prev,
            transpermohonan_id: biayaperm.transpermohonan.id || "",
            jumlah_biayaperm: biayaperm.jumlah_biayaperm.toString() || "0",
            jumlah_bayar: biayaperm.jumlah_bayar.toString() || "0",
            kurang_bayar: biayaperm.kurang_bayar.toString() || "0",
            catatan_biayaperm: biayaperm.catatan_biayaperm || "",
            image_biayaperm: biayaperm.image_biayaperm || "",
        }));
    }, [biayaperm]);

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
                        EDIT BIAYA PERMOHONAN
                    </h1>
                    <MoneyInput
                        name="jumlah_biayaperm"
                        disabled={parseInt(data.jumlah_bayar) > 0}
                        label="Jumlah Biaya"
                        errors={errors.jumlah_biayaperm}
                        value={data.jumlah_biayaperm}
                        onValueChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                jumlah_biayaperm: e.value,
                                kurang_bayar: getKurangBayar(
                                    Number.parseInt(e.value),
                                    Number.parseInt(data.jumlah_bayar)
                                ),
                            }))
                        }
                    />
                    <MoneyInput
                        name="jumlah_bayar"
                        disabled
                        label="Jumlah Bayar"
                        errors={errors.jumlah_bayar}
                        value={data.jumlah_bayar}
                        onValueChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                jumlah_bayar: e.value,
                                kurang_bayar: getKurangBayar(
                                    Number.parseInt(data.jumlah_biayaperm),
                                    Number.parseInt(e.value)
                                ),
                            }))
                        }
                    />
                    <MoneyInput
                        name="kurang_bayar"
                        label="Kurang Bayar"
                        disabled
                        errors={errors.kurang_bayar}
                        value={data.kurang_bayar}
                        onValueChange={(e) => {
                            setData("kurang_bayar", e.value);
                        }}
                    />
                    <Input
                        name="catatan_biayaperm"
                        label="Catatan"
                        errors={errors.catatan_biayaperm}
                        value={data.catatan_biayaperm}
                        onChange={(e) =>
                            setData("catatan_biayaperm", e.target.value)
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
    );
};

export default ModalEditBiayaperm;
