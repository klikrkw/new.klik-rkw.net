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
    const [uploadProgress, setUploadProgress] = useState<number | null>();
    // const [imageUrls, setImageUrls] = useState<string[]>([]);

    // const imagesListRef = ref(storage, "/images/biayaperms/");

    const uploadFile = async () => {
        if (imageUpload == null) return;
        const newImg = await resizeImage(imageUpload, 500, 500);
        let rand = Math.random() * 100000;
        const imageRef = ref(
            storage,
            `/images/bayarbiayaperms/${rand}_${imageUpload.name}`
        );
        const uploadTask = uploadBytesResumable(imageRef, newImg);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //         // Observe state change events such as progress, pause, and resume
                //         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                setUploadProgress(progress);
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    //   console.log('File available at', downloadURL);
                    setData("image_bayarbiayaperm", downloadURL);
                    setUploadProgress(null);
                    fileRef.current.value = null;
                    setImageUpload(null);
                });
            }
        );
    };

    const deleteFile = async (imageUrl: string) => {
        // setLoading(true);
        // const start = imageUrl.lastIndexOf("biayaperms%2F");
        // const end = imageUrl.lastIndexOf("?alt=media");
        // const fbimg = imageUrl.substring(start + 13, end);
        // const imgDir = "/images/biayaperms/";
        const imageRef = ref(storage, imageUrl);
        // Delete the file
        deleteObject(imageRef)
            .then(() => {
                setImageUpload(null);
                setData("image_bayarbiayaperm", "");
                console.log("image deleted from firebase");
                // File deleted successfully
            })
            .catch((error) => {
                console.log("error delete : ", error);
                // Uh-oh, an error occurred!
            });
    };

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
                    <div className="font-[sans-serif] max-w-md mx-auto">
                        <label className="text-md text-gray-500 font-semibold mb-2 block">
                            Upload file
                        </label>
                        <input
                            type="file"
                            ref={fileRef}
                            name="image_bayarbiayaperm"
                            className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
                            onChange={
                                (e: BaseSyntheticEvent) =>
                                    setImageUpload(e.target.files[0])
                                // setData("image_bayarbiayaperm", e.target.files[0])
                            }
                        />
                        <p className="text-xs text-gray-400 mt-2">
                            PNG, JPG SVG, WEBP, and GIF are Allowed.
                        </p>
                    </div>
                    <div className="flex flex-row justify-start gap-1 items-start">
                        {imageUpload ? (
                            <Button
                                name="upload"
                                type="button"
                                theme="blueGrey"
                                className="mt-2"
                                onClick={uploadFile}
                            >
                                <i className="fas fa-upload"></i>
                            </Button>
                        ) : null}
                        {data.image_bayarbiayaperm ? (
                            <div className="flex flex-row justify-between items-start p-2">
                                <div className="flex flex-wrap justify-center ">
                                    <div className="w-6/12 sm:w-4/12 p-4 group rounded-lg bg-gray-400 overflow-hidden border-2 cursor-pointer">
                                        <img
                                            src={data.image_bayarbiayaperm}
                                            alt="..."
                                            className="shadow rounded max-w-full h-auto align-middle border-none transition-all group-hover:scale-110 group-hover:bg-gray-600"
                                        />
                                    </div>
                                </div>
                                <Button
                                    name="upload"
                                    type="button"
                                    theme="black"
                                    onClick={() =>
                                        deleteFile(data.image_bayarbiayaperm)
                                    }
                                >
                                    <i className="fas fa-trash"></i>
                                </Button>
                            </div>
                        ) : null}
                    </div>
                    {uploadProgress && (
                        <progress value={uploadProgress} max="100">
                            {uploadProgress}%
                        </progress>
                    )}

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
