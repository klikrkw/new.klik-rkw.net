import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { LoadingButton } from "../Shared/LoadingButton";
import LinkButton from "../Shared/LinkButton";
import { Biayaperm, OptionSelect, Transpermohonan, User } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import Input from "../Shared/Input";
import MoneyInput from "../Shared/MoneyInput";
import useSwal from "@/utils/useSwal";
import SelectSearch from "../Shared/SelectSearch";
import {
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
} from "firebase/storage";
import { storage } from "@/firebase";
import { resizeImage } from "@/utils/images";
import Button from "../Shared/Button";
import UploadImage from "../Shared/UploadImage";

type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
    biayaperm: Biayaperm;
};
const ModalBayarBiayaperm = ({ showModal, setShowModal, biayaperm }: Props) => {
    const { metodebayars, rekenings } = usePage<{
        metodebayars: OptionSelect[];
        rekenings: OptionSelect[];
    }>().props;

    type FormValues = {
        biayaperm_id: string;
        saldo_awal: string;
        jumlah_bayar: string;
        saldo_akhir: string;
        akun: OptionSelect | undefined;
        akun_id: string;
        metodebayar: OptionSelect | undefined;
        metodebayar_id: string;
        info_rekening: string;
        catatan_bayarbiayaperm: string;
        image_bayarbiayaperm: string;
        rekening: OptionSelect | undefined;
        rekening_id: string;
        _method: string;
    };

    const { data, setData, errors, post, processing, reset } =
        useForm<FormValues>({
            biayaperm_id: biayaperm.id || "",
            saldo_awal: biayaperm.kurang_bayar.toString() || "",
            jumlah_bayar: biayaperm.kurang_bayar.toString() || "",
            saldo_akhir: "0",
            akun: undefined,
            akun_id: "",
            metodebayar: undefined,
            metodebayar_id: "",
            info_rekening: "",
            rekening: undefined,
            rekening_id: "",
            catatan_bayarbiayaperm: "",
            image_bayarbiayaperm: "",
            _method: "POST",
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
                    post(route("transaksi.bayarbiayaperms.store"), {
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
            biayaperm_id: biayaperm.id || "",
            saldo_awal: biayaperm.kurang_bayar.toString() || "0",
            jumlah_bayar: biayaperm.kurang_bayar.toString() || "0",
            saldo_akhir: "0",
            metodebayar_id: "",
            metodebayar: undefined,
            rekening_id: "",
            rekening: undefined,
            info_rekening: "",
            catatan_bayarbiayaperm: "",
            image_bayarbiayaperm: "",
        }));
    }, [biayaperm]);
    const fileRef = useRef<any>();
    const [imageUpload, setImageUpload] = useState<File | null>(null);

    useEffect(() => {
        return () => {
            reset();
            setImageUpload(null);
        };
    }, [showModal]);

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
                        BAYAR BIAYA PERMOHONAN
                    </h1>
                    <MoneyInput
                        name="saldo_awal"
                        label="Sisa Pembayaran"
                        errors={errors.saldo_awal}
                        value={data.saldo_awal}
                        disabled
                        onValueChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                saldo_awal: e.value,
                                saldo_akhir: getKurangBayar(
                                    Number.parseInt(e.value),
                                    Number.parseInt(data.jumlah_bayar)
                                ),
                            }))
                        }
                    />
                    <SelectSearch
                        name="metodebayar"
                        options={metodebayars}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                metodebayar: e ? e : undefined,
                                metodebayar_id: e ? e.value : "",
                            }))
                        }
                        label="Metode Pembayaran"
                        value={data.metodebayar}
                        errors={errors.metodebayar_id}
                    />
                    <Input
                        name="info_rekening"
                        label="Info Pembayaran"
                        errors={errors.info_rekening}
                        value={data.info_rekening}
                        onChange={(e) =>
                            setData("info_rekening", e.target.value)
                        }
                    />
                    <SelectSearch
                        name="rekening"
                        options={rekenings}
                        onChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                rekening: e ? e : undefined,
                                rekening_id: e ? e.value : "",
                            }))
                        }
                        label="Rekening"
                        value={data.rekening}
                        errors={errors.rekening_id}
                    />

                    <MoneyInput
                        name="jumlah_bayar"
                        label="Jumlah Bayar"
                        errors={errors.jumlah_bayar}
                        value={data.jumlah_bayar}
                        onValueChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                jumlah_bayar: e.value,
                                saldo_akhir: getKurangBayar(
                                    Number.parseInt(data.saldo_awal),
                                    Number.parseInt(e.value)
                                ),
                            }))
                        }
                    />
                    <MoneyInput
                        name="saldo_akhir"
                        label="Kurang Bayar"
                        disabled
                        errors={errors.saldo_akhir}
                        value={data.saldo_akhir}
                        onValueChange={(e) => {
                            setData("saldo_akhir", e.value);
                        }}
                    />
                    <Input
                        name="catatan_bayarbiayaperm"
                        label="Catatan"
                        errors={errors.catatan_bayarbiayaperm}
                        value={data.catatan_bayarbiayaperm}
                        onChange={(e) =>
                            setData("catatan_bayarbiayaperm", e.target.value)
                        }
                    />
                    <UploadImage
                        name={"image_biayaperm"}
                        image={data.image_bayarbiayaperm}
                        imagePath={"/images/dkeluarbiayapermusers/"}
                        setImage={(imgfile) =>
                            setData("image_bayarbiayaperm", imgfile)
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

export default ModalBayarBiayaperm;
