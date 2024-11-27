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
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
    uploadBytesResumable,
    deleteObject,
} from "firebase/storage";
import Button from "../Shared/Button";
import { storage } from "@/firebase";
import { resizeImage } from "@/utils/images";
type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
};
type OptionSelectExt = {
    rincianbiayaperm: Rincianbiayaperm;
} & OptionSelect;

const ModalAddBiayaperm = ({ showModal, setShowModal }: Props) => {
    type FormValues = {
        transpermohonan_id: string;
        jumlah_biayaperm: string;
        jumlah_bayar: string;
        kurang_bayar: string;
        catatan_biayaperm: string;
        image_biayaperm: string;
        rincianbiayapermOpt: OptionSelectExt | undefined;
        rincianbiayaperm_id: string;
        _method: string;
    };

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
            `/images/biayaperms/${rand}_${imageUpload.name}`
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
                    setData("image_biayaperm", downloadURL);
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
                setData("image_biayaperm", "");
                console.log("image deleted from firebase");
                // File deleted successfully
            })
            .catch((error) => {
                console.log("error delete : ", error);
                // Uh-oh, an error occurred!
            });
    };

    const { transpermohonan, rincianbiayapermOpts } = usePage<{
        transpermohonan: Transpermohonan;
        rincianbiayapermOpts: OptionSelectExt[];
    }>().props;

    const { data, setData, errors, post, processing, reset, progress } =
        useForm<FormValues>({
            transpermohonan_id: transpermohonan?.id || "",
            jumlah_biayaperm: "0",
            jumlah_bayar: "0",
            kurang_bayar: "0",
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
                text: "apakah akan menyimpan?",
            })
            .then((result) => {
                if (result.isConfirmed) {
                    post(route("transaksi.biayaperms.store"), {
                        onSuccess: () => {
                            reset();
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
        if (transpermohonan) {
            setData("transpermohonan_id", transpermohonan.id);
        }
    }, [transpermohonan]);
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
                        ADD BIAYA PERMOHONAN
                    </h1>
                    <SelectSearch
                        name="rincianbiayaperm_id"
                        label="Rincian Biaya"
                        value={data.rincianbiayapermOpt}
                        options={rincianbiayapermOpts}
                        onChange={(e: any) => {
                            setData({
                                ...data,
                                rincianbiayapermOpt: e ? e : {},
                                rincianbiayaperm_id: e ? e.value : "",
                                jumlah_biayaperm:
                                    e.rincianbiayaperm.total_pemasukan,
                                jumlah_bayar: (
                                    e.rincianbiayaperm.sisa_saldo +
                                    e.rincianbiayaperm.total_pengeluaran
                                ).toString(),
                            });
                        }}
                        errors={errors.rincianbiayaperm_id}
                    />
                    <MoneyInput
                        name="jumlah_biayaperm"
                        label="Jumlah Biaya"
                        errors={errors.jumlah_biayaperm}
                        autoComplete="off"
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
                        disabled
                        name="jumlah_bayar"
                        label="Jumlah Bayar"
                        errors={errors.jumlah_bayar}
                        autoComplete="off"
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
                        {data.image_biayaperm ? (
                            <div className="flex flex-row justify-between items-start p-2">
                                <div className="flex flex-wrap justify-center ">
                                    <div className="w-6/12 sm:w-4/12 p-4 group rounded-lg bg-gray-400 overflow-hidden border-2 cursor-pointer">
                                        <img
                                            src={data.image_biayaperm}
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
                                        deleteFile(data.image_biayaperm)
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

export default ModalAddBiayaperm;
