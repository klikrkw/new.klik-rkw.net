import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { LoadingButton } from "../Shared/LoadingButton";
import LinkButton from "../Shared/LinkButton";
import {
    Biayaperm,
    Instansi,
    OptionSelect,
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
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
    uploadBytesResumable,
    deleteObject,
} from "firebase/storage";
import { storage } from "@/firebase";
import { resizeImage } from "@/utils/images";
import Button from "../Shared/Button";

type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
    transpermohonan: Transpermohonan;
};
const ModalKeluarBiayaperm = ({
    showModal,
    setShowModal,
    transpermohonan,
}: Props) => {
    const { rekenings, metodebayars, itemkegiatansOpts, instansiOpts } =
        usePage<{
            metodebayars: OptionSelect[];
            rekenings: OptionSelect[];
            itemkegiatansOpts: OptionSelect[];
            instansiOpts: OptionSelect[];
        }>().props;

    type FormValues = {
        transpermohonan_id: string;
        jumlah_keluarbiayaperm: string;
        itemkegiatan_id: string;
        itemkegiatan: OptionSelect | undefined;
        akun: OptionSelect | undefined;
        akun_id: string;
        metodebayar: OptionSelect | undefined;
        metodebayar_id: string;
        rekening: OptionSelect | undefined;
        rekening_id: string;
        catatan_keluarbiayaperm: string;
        instansi: Instansi | undefined;
        instansiOpt: OptionSelect | undefined;
        instansi_id: string;
        image_dkeluarbiayapermuser: string;
        _method: string;
    };

    const { data, setData, errors, post, processing, reset } =
        useForm<FormValues>({
            transpermohonan_id: transpermohonan.id || "",
            jumlah_keluarbiayaperm: "",
            itemkegiatan_id: "",
            itemkegiatan: undefined,
            akun: undefined,
            akun_id: "",
            metodebayar: metodebayars.length > 0 ? metodebayars[0] : undefined,
            rekening_id: "",
            rekening: rekenings.length > 0 ? rekenings[0] : undefined,
            metodebayar_id: "",
            catatan_keluarbiayaperm: "",
            instansi: undefined,
            instansiOpt: undefined,
            instansi_id: "",
            image_dkeluarbiayapermuser: "",
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
                    post(route("transaksi.keluarbiayaperms.store"), {
                        onSuccess: () => {
                            setShowModal(false);
                        },
                    });
                }
            });
    }
    const fileRef = useRef<any>();

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            transpermohonan_id: transpermohonan.id || "",
            jumlah_keluarbiayaperm: "0",
            metodebayar_id:
                metodebayars.length > 0 ? metodebayars[0].value : "",
            metodebayar: metodebayars.length > 0 ? metodebayars[0] : undefined,
            catatan_keluarbiayaperm: "",
            image_keluarbiayaperm: "",
        }));
    }, [transpermohonan]);
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
            `/images/dkeluarbiayapermusers/${rand}_${imageUpload.name}`
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
                    setData("image_dkeluarbiayapermuser", downloadURL);
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
                setData("image_dkeluarbiayapermuser", "");
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
                        PENGELUARAN BIAYA
                    </h1>
                    <div className="grid grid-cols-2 gap-1">
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
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                        <SelectSearch
                            name="instansi_id"
                            label="Instansi"
                            value={data.instansiOpt}
                            options={instansiOpts}
                            onChange={(e: any) =>
                                setData({
                                    ...data,
                                    instansiOpt: e ? e : {},
                                    instansi_id: e ? e.value : "",
                                })
                            }
                            errors={errors.instansi_id}
                        />

                        <SelectSearch
                            name="itemkegiatan"
                            options={itemkegiatansOpts}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    itemkegiatan: e ? e : undefined,
                                    itemkegiatan_id: e ? e.value : "",
                                }))
                            }
                            label="Item Kegiatan"
                            value={data.itemkegiatan}
                            errors={errors.itemkegiatan_id}
                        />
                    </div>
                    <MoneyInput
                        name="jumlah_keluarbiayaperm"
                        label="Jumlah Bayar"
                        errors={errors.jumlah_keluarbiayaperm}
                        value={data.jumlah_keluarbiayaperm}
                        onValueChange={(e) => {
                            setData("jumlah_keluarbiayaperm", e.value);
                        }}
                    />
                    <Input
                        name="catatan_keluarbiayaperm"
                        label="Catatan"
                        errors={errors.catatan_keluarbiayaperm}
                        value={data.catatan_keluarbiayaperm}
                        onChange={(e) =>
                            setData("catatan_keluarbiayaperm", e.target.value)
                        }
                    />
                    <div className="font-[sans-serif] max-w-md mx-auto">
                        <label className="text-md text-gray-500 font-semibold mb-2 block">
                            Upload file
                        </label>
                        <input
                            type="file"
                            ref={fileRef}
                            name="image_biayaperm"
                            className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
                            onChange={
                                (e: BaseSyntheticEvent) =>
                                    setImageUpload(e.target.files[0])
                                // setData("image_biayaperm", e.target.files[0])
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
                        {data.image_dkeluarbiayapermuser ? (
                            <div className="flex flex-row justify-between items-start p-2">
                                <div className="flex flex-wrap justify-center ">
                                    <div className="w-6/12 sm:w-4/12 p-4 group rounded-lg bg-gray-400 overflow-hidden border-2 cursor-pointer">
                                        <img
                                            src={
                                                data.image_dkeluarbiayapermuser
                                            }
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
                                        deleteFile(
                                            data.image_dkeluarbiayapermuser
                                        )
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

export default ModalKeluarBiayaperm;
