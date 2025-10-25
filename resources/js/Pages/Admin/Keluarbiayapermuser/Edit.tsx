import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import MoneyInput from "@/Components/Shared/MoneyInput";
import {
    Dkeluarbiayapermuser,
    Keluarbiayapermuser,
    OptionSelect,
    Permohonan,
} from "@/types";
import SelectSearch from "@/Components/Shared/SelectSearch";
import moment from "moment";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import CardDkeluarbiayapermuserList from "@/Components/Cards/Admin/CardDkeluarbiayapermuserList";
import Button from "@/Components/Shared/Button";
import ModalCetakLaporan from "@/Components/Modals/ModalCetakLaporan";
import Modal from "@/Components/Modals/Modal";
import { toRupiah } from "@/utils";
import ModalAddPermohonan from "@/Components/Modals/ModalAddPermohonan";
import CardPermohonanEditable from "@/Components/Cards/Admin/CardPermohonanEditable";
import TranspermohonanSelect from "@/Components/Shared/TranspermohonanSelect";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/firebase";
import { resizeImage } from "@/utils/images";
import { useAuth } from "@/Contexts/AuthContext";
import UploadImage from "@/Components/Shared/UploadImage";

type Props = {
    keluarbiayapermuser: Keluarbiayapermuser;
    itemkegiatanOpts: OptionSelect[];
    status_keluarbiayapermusers: OptionSelect[];
    is_admin: boolean;
    base_route: string;
};
const Edit = ({
    keluarbiayapermuser,
    itemkegiatanOpts,
    status_keluarbiayapermusers,
    is_admin,
    base_route,
}: Props) => {
    type FormValues = {
        itemkegiatan: OptionSelect | undefined;
        itemkegiatan_id: string;
        jumlah_biaya: string;
        ket_biaya: string;
        image_dkeluarbiayapermuser: string;
        permohonan: Permohonan | undefined;
        transpermohonan_id: string;
        _method: string;
    };
    const selStatusKeluarbiayapermuser = status_keluarbiayapermusers.find(
        (item) => item.value == keluarbiayapermuser.status_keluarbiayapermuser
    );
    const [statusKeluarbiayapermuser, setStatusKeluarbiayapermuser] =
        useState<OptionSelect | null>(
            selStatusKeluarbiayapermuser ? selStatusKeluarbiayapermuser : null
        );
    const [showStatusDialog, setShowStatusDialog] = useState(false);

    // const { statuskasbonOpts } = usePage<{ statuskasbonOpts: OptionSelect[] }>().props;
    const { data, setData, errors, processing, post, reset } =
        useForm<FormValues>({
            itemkegiatan: undefined,
            itemkegiatan_id: "",
            jumlah_biaya: "0",
            ket_biaya: "",
            permohonan: undefined,
            transpermohonan_id: "",
            image_dkeluarbiayapermuser: "",
            _method: "PUT",
        });

    const getSisaPenggunaan = (jmlKasbon: number, jmlPenggunaan: number) => {
        let xsisaPenggunaan =
            jmlKasbon > jmlPenggunaan ? jmlKasbon - jmlPenggunaan : 0;
        return xsisaPenggunaan.toString();
    };
    const firstInput = useRef<HTMLInputElement>(null);
    const [showModalLaporan, setShowModalLaporan] = useState<boolean>(false);
    const [showModalAddPermohonan, setShowModalAddPermohonan] =
        useState<boolean>(false);

    function handleUpdateStatus(e: any) {
        e.preventDefault();
        const data = {
            status_keluarbiayapermuser: statusKeluarbiayapermuser?.value,
        };
        router.put(
            route(
                base_route + "transaksi.keluarbiayapermusers.status.update",
                keluarbiayapermuser.id
            ),
            data,
            {
                onSuccess: (e) => {
                    setShowStatusDialog(false);
                },
            }
        );
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        post(
            route(
                base_route + "transaksi.keluarbiayapermusers.update",
                keluarbiayapermuser.id
            ),
            {
                onSuccess: () => {
                    reset();
                    if (firstInput && firstInput.current) {
                        firstInput.current.value = "";
                        firstInput.current.focus();
                    }
                },
            }
        );
    }
    function prosesLaporan(e: any) {
        e.preventDefault();
        setShowModalLaporan(true);
    }

    useEffect(() => {
        if (firstInput.current) {
            firstInput.current.focus();
        }
    }, []);

    const setPermohonan = (perm: Permohonan | undefined) => {
        if (firstInput && firstInput.current) {
            firstInput.current.value = perm?.nama_penerima ?? "";
        }
        setData({
            ...data,
            permohonan: perm,
            transpermohonan_id: perm?.transpermohonan
                ? perm.transpermohonan.id
                : "",
        });
    };
    const fileRef = useRef<any>();
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>();
    const uploadFile = async () => {
        if (imageUpload == null) return;
        const newImg = await resizeImage(imageUpload, 500, 500);
        let rand = Math.random() * 100000;
        const imageRef = ref(
            storage,
            `/images/dkeluarbiayapermusers/${rand}_${imageUpload.name}`
        );

        const uploadTask = uploadBytesResumable(imageRef, newImg);
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

    const { currentUser, login, logout } = useAuth();
    const { fbtoken } = usePage().props;
    useEffect(() => {
        if (!currentUser) {
            login(fbtoken);
        }

        return () => {
            if (currentUser) {
                console.log("logout firebase");
                logout();
                // getFcmToken()
            }
        };
    }, []);

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center relative -top-6">
                <div className="w-full lg:w-11/12 px-4 ">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-100 border-0">
                        <div className="rounded-t mb-1 px-4 py-4 ">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-lightBlue-800 text-lightBlue-100 px-4 py-2 shadow-md rounded-lg">
                                <div className="text-left">
                                    <h6 className="font-semibold">
                                        PENGELUARAN BIAYA PERMOHONAN
                                    </h6>
                                </div>
                                <div className="text-left md:text-right">
                                    {keluarbiayapermuser.created_at}
                                    {/* {moment(
                                        keluarbiayapermuser.created_at,
                                        "DD MMM YYYY hh:mm"
                                    ).format("DD MMM YYYY hh:mm")} */}
                                </div>
                            </div>
                        </div>
                        <div className="flex-auto px-4 lg:px-6 py-4 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <Input
                                    name="instansi"
                                    label="Instansi"
                                    disabled
                                    value={
                                        keluarbiayapermuser.instansi
                                            ?.nama_instansi
                                    }
                                />
                                <Input
                                    name="metodebayar"
                                    label="Metode Bayar"
                                    disabled
                                    value={
                                        keluarbiayapermuser.metodebayar
                                            ?.nama_metodebayar
                                    }
                                />
                                <div className="flex flex-col">
                                    <div className="mb-2 font-bold text-xs">
                                        KASBON
                                    </div>
                                    <div className="px-2 py-2 rounded text-sm bg-blueGray-200 text-blueGray-600">
                                        {keluarbiayapermuser.kasbons.length >
                                        0 ? (
                                            keluarbiayapermuser.kasbons.map(
                                                (e, i) => (
                                                    <span key={i}>
                                                        {e.id} :{" "}
                                                        {toRupiah(
                                                            e.jumlah_kasbon
                                                        )}
                                                    </span>
                                                )
                                            )
                                        ) : (
                                            <span>No Kasbon</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {keluarbiayapermuser &&
                            keluarbiayapermuser.status_keluarbiayapermuser ==
                                "wait_approval" ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="w-full grid grid-cols-1 md:grid-cols-2 md:gap-2">
                                        <div className="w-full grid grid-cols-1">
                                            <div className="flex flex-row justify-between items-center">
                                                <TranspermohonanSelect
                                                    inputRef={firstInput}
                                                    value={
                                                        data.permohonan
                                                            ?.transpermohonan
                                                    }
                                                    className="mb-1 w-full mr-2"
                                                    errors={
                                                        errors.transpermohonan_id
                                                    }
                                                    onValueChange={(e) => {
                                                        setPermohonan(
                                                            e?.permohonan
                                                        );
                                                    }}
                                                    isChecked={true}
                                                />

                                                <a
                                                    tabIndex={-1}
                                                    href="#"
                                                    className="w-8 h-8 px-2 py-1 rounded-full bg-blue-600/20 shadow-xl mb-1"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setShowModalAddPermohonan(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <i className="fas fa-add text-md text-center text-gray-700"></i>
                                                </a>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
                                                <SelectSearch
                                                    placeholder="Pilih Kegiatan"
                                                    name="itemkegiatan_id"
                                                    value={data.itemkegiatan}
                                                    options={itemkegiatanOpts}
                                                    onChange={(e: any) =>
                                                        setData({
                                                            ...data,
                                                            itemkegiatan: e
                                                                ? e
                                                                : {},
                                                            itemkegiatan_id: e
                                                                ? e.value
                                                                : "",
                                                        })
                                                    }
                                                    errors={
                                                        errors.itemkegiatan_id
                                                    }
                                                />
                                                <Input
                                                    name="ket_biaya"
                                                    placeholder="Keterangan"
                                                    errors={errors.ket_biaya}
                                                    value={data.ket_biaya}
                                                    onChange={(e) =>
                                                        setData(
                                                            "ket_biaya",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="flex justify-between gap-2 items-start">
                                                <MoneyInput
                                                    name="jumlah_biaya"
                                                    errors={errors.jumlah_biaya}
                                                    autoComplete="off"
                                                    value={data.jumlah_biaya}
                                                    placeholder="Jumlah"
                                                    onValueChange={(e) =>
                                                        setData((prev) => ({
                                                            ...prev,
                                                            jumlah_biaya:
                                                                e.value,
                                                        }))
                                                    }
                                                />
                                                <LoadingButton
                                                    theme="black"
                                                    loading={processing}
                                                    type="submit"
                                                    className="pb-3 text-sm"
                                                >
                                                    <span>Simpan</span>
                                                </LoadingButton>
                                                <Button
                                                    disabled={!is_admin}
                                                    theme="blueGrey"
                                                    className="py-2 text-sm text-blueGray-500"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setShowStatusDialog(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <span>
                                                        {
                                                            keluarbiayapermuser.status_keluarbiayapermuser
                                                        }
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>

                                        <UploadImage
                                            name={"image_dkeluarbiaya"}
                                            image={
                                                data.image_dkeluarbiayapermuser
                                            }
                                            imagePath={
                                                "/images/dkeluarbiayapermusers/"
                                            }
                                            setImage={(imgfile) =>
                                                setData(
                                                    "image_dkeluarbiayapermuser",
                                                    imgfile
                                                )
                                            }
                                        />
                                        <div className="w-full flex items-start">
                                            <CardPermohonanEditable
                                                permohonan={data.permohonan}
                                                base_route={base_route}
                                                setPermohonan={setPermohonan}
                                            />
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <Button
                                    disabled={!is_admin}
                                    theme="blueGrey"
                                    className="py-2 text-sm text-blueGray-500"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowStatusDialog(true);
                                    }}
                                >
                                    <span>
                                        {
                                            keluarbiayapermuser.status_keluarbiayapermuser
                                        }
                                    </span>
                                </Button>
                            )}
                            <div className="w-full flex items-start">
                                <CardDkeluarbiayapermuserList
                                    keluarbiayapermuser={keluarbiayapermuser}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <LinkButton
                                    theme="blueGrey"
                                    href={route(
                                        base_route +
                                            "transaksi.keluarbiayapermusers.index"
                                    )}
                                >
                                    <span>Kembali</span>
                                </LinkButton>
                                <Button
                                    disabled={
                                        parseInt(
                                            keluarbiayapermuser.jumlah_biaya
                                        ) == 0
                                    }
                                    theme="blue"
                                    onClick={(e) => prosesLaporan(e)}
                                >
                                    <span>Cetak</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalCetakLaporan
                showModal={showModalLaporan}
                setShowModal={setShowModalLaporan}
                src={route(
                    "keluarbiayapermusers.lap.staf",
                    keluarbiayapermuser.id
                )}
            />
            <ModalAddPermohonan
                showModal={showModalAddPermohonan}
                setShowModal={setShowModalAddPermohonan}
                setPermohonan={setPermohonan}
                src={route(base_route + "permohonans.modal.create")}
            />

            {showStatusDialog ? (
                <Modal
                    closeable={true}
                    show={showStatusDialog}
                    maxWidth="md"
                    onClose={() => setShowStatusDialog(false)}
                >
                    <div className="w-full p-4 flex flex-col gap-2">
                        <h1>Update Status Pengeluaran</h1>
                        <SelectSearch
                            placeholder="Status"
                            name="status_keluarbiayapermuser"
                            value={statusKeluarbiayapermuser}
                            options={status_keluarbiayapermusers}
                            onChange={(e: any) =>
                                setStatusKeluarbiayapermuser(e)
                            }
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                theme="blue"
                                onClick={(e) => handleUpdateStatus(e)}
                            >
                                <span>Simpan</span>
                            </Button>
                            <Button
                                theme="blueGrey"
                                onClick={(e) => setShowStatusDialog(false)}
                            >
                                <span>Batal</span>
                            </Button>
                        </div>
                    </div>
                </Modal>
            ) : null}
        </AdminLayout>
    );
};

export default Edit;
