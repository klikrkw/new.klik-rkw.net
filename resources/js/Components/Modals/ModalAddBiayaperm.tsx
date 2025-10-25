import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { LoadingButton } from "../Shared/LoadingButton";
import LinkButton from "../Shared/LinkButton";
import {
    Biayaperm,
    OptionSelect,
    Rincianbiayaperm,
    Transpermohonan,
    User,
} from "@/types";
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
import Button from "../Shared/Button";
import { storage } from "@/firebase";
import { resizeImage } from "@/utils/images";
import apputils from "@/bootstrap";
import { parse } from "path";
import UploadImage from "../Shared/UploadImage";

type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
    transpermohonan_id: string;
};
type OptionSelectExt = {
    rincianbiayaperm: Rincianbiayaperm;
} & OptionSelect;

const ModalAddBiayaperm = ({
    showModal,
    setShowModal,
    transpermohonan_id,
}: Props) => {
    type FormValues = {
        transpermohonan_id: string;
        jumlah_biayaperm: number;
        jumlah_bayar: number;
        kurang_bayar: number;
        catatan_biayaperm: string;
        image_biayaperm: string;
        rincianbiayapermOpt: OptionSelectExt | undefined;
        rincianbiayaperm_id: string;
        _method: string;
    };

    const [imageUpload, setImageUpload] = useState<File | null>(null);

    const { transpermohonan, rincianbiayapermOpts } = usePage<{
        transpermohonan: Transpermohonan;
        rincianbiayapermOpts: OptionSelectExt[];
    }>().props;
    const [xrincianbiayapermOpts, setXrincianbiayapermOpts] =
        useState<OptionSelectExt[]>(rincianbiayapermOpts);
    // const [imageUrls, setImageUrls] = useState<string[]>([]);

    // const imagesListRef = ref(storage, "/images/biayaperms/");
    const getRincianbiayapermOpts = async (transpermohonan_id: string) => {
        let xlink = `/transaksi/biayaperms/${transpermohonan_id}/api/rincianbiayapermopts`;
        const response = await apputils.backend.get(xlink);
        const data = response.data;
        setXrincianbiayapermOpts(data);
    };

    const { data, setData, errors, post, processing, reset, progress } =
        useForm<FormValues>({
            transpermohonan_id: "",
            jumlah_biayaperm: 0,
            jumlah_bayar: 0,
            kurang_bayar: 0,
            catatan_biayaperm: "",
            image_biayaperm: "",
            rincianbiayapermOpt: undefined,
            rincianbiayaperm_id: "",
            _method: "POST",
        });

    function handleSubmit(e: any) {
        e.preventDefault();
        useSwal
            .confirm({
                title: "Simpan Data",
                text: "apakah akan menyimpan ?",
            })
            .then((result) => {
                if (result.isConfirmed) {
                    post(route("transaksi.biayaperms.store"), {
                        onSuccess: () => {
                            // console.log("sukses");
                            setShowModal(false);
                        },
                    });
                }
            });
    }
    const getKurangBayar = (jmlBiaya: number, jmlBayar: number) => {
        let xkurang = jmlBiaya > jmlBayar ? jmlBiaya - jmlBayar : 0;
        return xkurang;
    };

    useEffect(() => {
        setData("transpermohonan_id", transpermohonan_id);
        if (showModal && transpermohonan_id) {
            getRincianbiayapermOpts(transpermohonan_id);
        }
        if (!showModal) {
            setImageUpload(null);
            reset();
        }
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
                    <div className="flex justify-between items-start">
                        <h1 className="font-bold text-xl text-blueGray-700 mb-4">
                            BIAYA PERMOHONAN BARU
                        </h1>
                        <div className="font-bold text-blueGray-500 text-sm">
                            {data.transpermohonan_id}
                        </div>
                    </div>
                    <SelectSearch
                        name="rincianbiayaperm_id"
                        label="Rincian Biaya"
                        value={data.rincianbiayapermOpt}
                        options={xrincianbiayapermOpts}
                        onChange={(e: any) => {
                            setData({
                                ...data,
                                rincianbiayapermOpt: e ? e : {},
                                rincianbiayaperm_id: e ? e.value : "",
                                jumlah_biayaperm:
                                    e.rincianbiayaperm.total_pemasukan,
                                jumlah_bayar:
                                    parseInt(
                                        e.rincianbiayaperm.total_pemasukan
                                    ) -
                                    parseInt(
                                        e.rincianbiayaperm.total_pengeluaran
                                    ),
                            });
                        }}
                        errors={errors.rincianbiayaperm_id}
                    />
                    <MoneyInput
                        name="jumlah_biayaperm"
                        label="Jumlah Biaya"
                        disabled={data.rincianbiayapermOpt ? true : false}
                        errors={errors.jumlah_biayaperm}
                        autoComplete="off"
                        value={data.jumlah_biayaperm}
                        onValueChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                jumlah_biayaperm: parseInt(e.value),
                                kurang_bayar: getKurangBayar(
                                    parseInt(e.value),
                                    data.jumlah_bayar
                                ),
                            }))
                        }
                    />
                    <MoneyInput
                        disabled={true}
                        name="jumlah_bayar"
                        label="Jumlah Bayar"
                        errors={errors.jumlah_bayar}
                        autoComplete="off"
                        value={data.jumlah_bayar}
                        onValueChange={(e) =>
                            setData((prev) => ({
                                ...prev,
                                jumlah_bayar: parseInt(e.value),
                                kurang_bayar: getKurangBayar(
                                    data.jumlah_biayaperm,
                                    parseInt(e.value)
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
                            setData("kurang_bayar", parseInt(e.value));
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
                    <UploadImage
                        name={"image_biayaperm"}
                        image={data.image_biayaperm}
                        imagePath={"/images/dkeluarbiayapermusers/"}
                        setImage={(imgfile) =>
                            setData("image_biayaperm", imgfile)
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

export default ModalAddBiayaperm;
