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
import PermohonanSelect from "@/Components/Shared/PermohonanSelect";
import CardPermohonan from "@/Components/Cards/Admin/CardPermohonan";
import { useEffect, useRef, useState } from "react";
import CardDkeluarbiayapermuserList from "@/Components/Cards/Admin/CardDkeluarbiayapermuserList";
import Button from "@/Components/Shared/Button";
import ModalCetakLaporan from "@/Components/Modals/ModalCetakLaporan";
import Modal from "@/Components/Modals/Modal";

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

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center relative -top-2">
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
                                    {moment(
                                        keluarbiayapermuser.created_at,
                                        "DD MMM YYYY hh:mm"
                                    ).format("DD MMM YYYY hh:mm")}
                                </div>
                            </div>
                        </div>
                        <div className="flex-auto px-4 lg:px-6 py-4 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <Input
                                    name="instansi"
                                    label="Instansi"
                                    disabled
                                    defaultValue={
                                        keluarbiayapermuser.instansi
                                            ?.nama_instansi
                                    }
                                />
                                <Input
                                    name="metodebayar"
                                    label="Metode Bayar"
                                    disabled
                                    defaultValue={
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
                                                        {e.id}:{e.jumlah_kasbon}
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
                                    <div className="w-full grid grid-cols-2 gap-2">
                                        <div className="w-full grid grid-cols-1">
                                            <PermohonanSelect
                                                inputRef={firstInput}
                                                value={data.permohonan}
                                                className="mb-1"
                                                errors={
                                                    errors.transpermohonan_id
                                                }
                                                onValueChange={(e) => {
                                                    setData((v) => ({
                                                        ...v,
                                                        permohonan: e,
                                                        transpermohonan_id:
                                                            e.transpermohonan
                                                                .id,
                                                    }));
                                                }}
                                            />
                                            <div className="grid grid-cols-2 gap-2">
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
                                        <div className="w-full flex items-start">
                                            <CardPermohonan
                                                permohonan={data.permohonan}
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
                    base_route + "transaksi.keluarbiayapermusers.lap.staf",
                    keluarbiayapermuser.id
                )}
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
