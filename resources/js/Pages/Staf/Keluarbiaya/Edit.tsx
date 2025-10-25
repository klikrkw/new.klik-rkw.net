import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import MoneyInput from "@/Components/Shared/MoneyInput";
import { Dkeluarbiaya, Keluarbiaya, OptionSelect, Permohonan } from "@/types";
import SelectSearch from "@/Components/Shared/SelectSearch";
import moment from "moment";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import CardDkeluarbiayaList from "@/Components/Cards/Staf/CardDkeluarbiayaList";
import Button from "@/Components/Shared/Button";
import ModalCetakLaporan from "@/Components/Modals/ModalCetakLaporan";
import Modal from "@/Components/Modals/Modal";
import StafLayout from "@/Layouts/StafLayout";
import { useAuth } from "@/Contexts/AuthContext";
import UploadImage from "@/Components/Shared/UploadImage";

type Props = {
    keluarbiaya: Keluarbiaya;
    itemkegiatanOpts: OptionSelect[];
    status_keluarbiayas: OptionSelect[];
    is_admin: boolean;
    base_route: string;
};
const Create = ({
    keluarbiaya,
    itemkegiatanOpts,
    status_keluarbiayas,
    is_admin,
    base_route,
}: Props) => {
    type FormValues = {
        itemkegiatan: OptionSelect | undefined;
        itemkegiatan_id: string;
        jumlah_biaya: string;
        ket_biaya: string;
        image_dkeluarbiaya: string;
        permohonan: Permohonan | undefined;
        transpermohonan_id: string;
        _method: string;
    };
    const selStatusKeluarbiayapermuser = status_keluarbiayas.find(
        (item) => item.value == keluarbiaya.status_keluarbiaya
    );
    const [statusKeluarbiayapermuser, setStatusKeluarbiayapermuser] =
        useState<OptionSelect | null>(
            selStatusKeluarbiayapermuser ? selStatusKeluarbiayapermuser : null
        );
    const [showStatusDialog, setShowStatusDialog] = useState(false);

    // const { statuskasbonOpts } = usePage<{ statuskasbonOpts: OptionSelect[] }>().props;
    const { data, setData, errors, processing, post, reset, progress } =
        useForm<FormValues>({
            itemkegiatan: undefined,
            itemkegiatan_id: "",
            jumlah_biaya: "0",
            ket_biaya: "",
            image_dkeluarbiaya: "",
            permohonan: undefined,
            transpermohonan_id: "",
            _method: "PUT",
        });

    const getSisaPenggunaan = (jmlKasbon: number, jmlPenggunaan: number) => {
        let xsisaPenggunaan =
            jmlKasbon > jmlPenggunaan ? jmlKasbon - jmlPenggunaan : 0;
        return xsisaPenggunaan.toString();
    };
    const firstInput = useRef<any>();
    const [showModalLaporan, setShowModalLaporan] = useState<boolean>(false);

    function handleUpdateStatus(e: any) {
        e.preventDefault();
        const data = {
            status_keluarbiaya: statusKeluarbiayapermuser?.value,
        };
        router.put(
            route(
                base_route + "transaksi.keluarbiayas.status.update",
                keluarbiaya.id
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
            route(base_route + "transaksi.keluarbiayas.update", keluarbiaya.id),
            {
                onSuccess: () => {
                    reset();
                    firstInput.current.value = "";
                    firstInput.current.focus();
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

    const { currentUser, login, logout } = useAuth();
    const { fbtoken } = usePage().props;
    useEffect(() => {
        if (!currentUser) {
            login(fbtoken);
        }

        // return () => {
        //     if (currentUser) {
        //         console.log("logout firebase");
        //         logout();
        //         // getFcmToken()
        //     }
        // };
    }, []);

    return (
        <StafLayout>
            <div className="flex content-center items-center justify-center relative -top-2">
                <div className="w-full lg:w-11/12 px-4 ">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-100 border-0">
                        <div className="rounded-t mb-1 px-4 py-4 ">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-lightBlue-800 text-lightBlue-100 px-4 py-2 shadow-md rounded-lg">
                                <div className="text-left">
                                    <h6 className="font-semibold">
                                        PENGELUARAN BIAYA
                                    </h6>
                                </div>
                                <div className="text-left md:text-right">
                                    {keluarbiaya.created_at}
                                    {/* {moment(
                                        keluarbiaya.created_at,
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
                                    value={keluarbiaya.instansi?.nama_instansi}
                                />
                                <Input
                                    name="metodebayar"
                                    label="Metode Bayar"
                                    disabled
                                    value={
                                        keluarbiaya.metodebayar
                                            ?.nama_metodebayar
                                    }
                                />
                                <div className="flex flex-col">
                                    <div className="mb-2 font-bold text-xs">
                                        KASBON
                                    </div>
                                    <div className="px-2 py-2 rounded text-sm bg-blueGray-200 text-blueGray-600">
                                        {keluarbiaya.kasbons.length > 0 ? (
                                            keluarbiaya.kasbons.map((e, i) => (
                                                <span key={i}>
                                                    {e.id}:{e.jumlah_kasbon}
                                                </span>
                                            ))
                                        ) : (
                                            <span>No Kasbon</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {keluarbiaya &&
                            keluarbiaya.status_keluarbiaya ==
                                "wait_approval" ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="w-full grid grid-cols-2 gap-2">
                                        <div className="w-full grid grid-cols-1">
                                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
                                                <SelectSearch
                                                    focused={true}
                                                    xref={firstInput}
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
                                            <div className="flex flex-col md:flex-row justify-between gap-2 items-start">
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
                                                            keluarbiaya.status_keluarbiaya
                                                        }
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                        <UploadImage
                                            name={"image_dkeluarbiaya"}
                                            image={data.image_dkeluarbiaya}
                                            imagePath={
                                                "/images/dkeluarbiayapermusers/"
                                            }
                                            setImage={(imgfile) =>
                                                setData(
                                                    "image_dkeluarbiaya",
                                                    imgfile
                                                )
                                            }
                                        />
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
                                        {keluarbiaya.status_keluarbiaya}
                                    </span>
                                </Button>
                            )}
                            <div className="w-full flex items-start">
                                <CardDkeluarbiayaList
                                    keluarbiaya={keluarbiaya}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <LinkButton
                                    theme="blueGrey"
                                    href={route(
                                        base_route +
                                            "transaksi.keluarbiayas.index"
                                    )}
                                >
                                    <span>Kembali</span>
                                </LinkButton>
                                <Button
                                    disabled={
                                        parseInt(keluarbiaya.jumlah_biaya) == 0
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
                src={route("keluarbiayas.lap.staf", keluarbiaya.id)}
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
                            name="status_keluarbiaya"
                            value={statusKeluarbiayapermuser}
                            options={status_keluarbiayas}
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
        </StafLayout>
    );
};

export default Create;
