import CardDkasbonList from "@/Components/Cards/Admin/CardDkasbonList";
import CardDkasbonnopermList from "@/Components/Cards/Admin/CardDkasbonnopermList";
import CardPermohonanEditable from "@/Components/Cards/Admin/CardPermohonanEditable";
import ModalAddPermohonan from "@/Components/Modals/ModalAddPermohonan";
import ModalCetakLaporan from "@/Components/Modals/ModalCetakLaporan";
import AsyncSelectSearch from "@/Components/Shared/AsyncSelectSearch";
import Button from "@/Components/Shared/Button";
import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import MoneyInput from "@/Components/Shared/MoneyInput";
import PermohonanSelect from "@/Components/Shared/PermohonanSelect";
import SelectSearch from "@/Components/Shared/SelectSearch";
import TranspermohonanSelect from "@/Components/Shared/TranspermohonanSelect";
import AdminLayout from "@/Layouts/AdminLayout";
import StafLayout from "@/Layouts/StafLayout";
import { Instansi, Kasbon, OptionSelect, Permohonan, User } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import Select, { MultiValue, OnChangeValue } from "react-select";

const Edit = () => {
    type UserOption = {
        label: string;
        value: string;
    };

    type FormValues = {
        // jumlah_kasbon: string;
        // jumlah_penggunaan: string;
        // sisa_penggunaan: string;
        // keperluan: string;
        // status_kasbon: string;
        // statuskabonOpt: OptionSelect | undefined;
        // user: User;
        itemkegiatan: OptionSelect | undefined;
        itemkegiatan_id: string;
        jumlah_biaya: string;
        jenis_kasbon: string;
        ket_biaya: string;
        permohonan: Permohonan | undefined;
        transpermohonan_id: string;

        _method: string;
    };

    const {
        kasbon,
        // statuskasbonOpts,
        // statuskasbonOpt,
        is_admin,
        itemkegiatanOpts,
        base_route,
        allPermohonan,
    } = usePage<{
        kasbon: Kasbon;
        // statuskasbonOpts: OptionSelect[];
        // statuskasbonOpt: OptionSelect;
        itemkegiatanOpts: OptionSelect[];
        is_admin: boolean;
        base_route: string;
        allPermohonan: boolean;
    }>().props;

    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [showModalLaporan, setShowModalLaporan] = useState<boolean>(false);

    const { data, setData, errors, post, processing, reset } =
        useForm<FormValues>({
            // jumlah_kasbon: kasbon.jumlah_kasbon.toString() || "0",
            // jumlah_penggunaan: kasbon.jumlah_penggunaan.toString() || "0",
            // sisa_penggunaan: kasbon.sisa_penggunaan.toString() || "0",
            // keperluan: kasbon.keperluan || "",
            // status_kasbon: kasbon.status_kasbon || "",
            // statuskabonOpt: statuskasbonOpt || undefined,
            // user: kasbon.user,
            itemkegiatan: undefined,
            itemkegiatan_id: "",
            jumlah_biaya: "0",
            ket_biaya: "",
            permohonan: undefined,
            transpermohonan_id: "",
            jenis_kasbon: kasbon.jenis_kasbon,
            _method: "PUT",
        });

    const getSisaPenggunaan = (jmlKasbon: number, jmlPenggunaan: number) => {
        let xsisaPenggunaan =
            jmlKasbon > jmlPenggunaan ? jmlKasbon - jmlPenggunaan : 0;
        return xsisaPenggunaan.toString();
    };

    function handleSubmit(e: any) {
        e.preventDefault();
        // post(route("transaksi.kasbons.update", kasbon.id));
        post(route(base_route + "transaksi.kasbons.update", kasbon.id), {
            onSuccess: () => {
                reset();
                firstInput.current.value = "";
                firstInput.current.focus();
            },
        });
    }
    const firstInput = useRef<any>();

    const [showModalAddPermohonan, setShowModalAddPermohonan] =
        useState<boolean>(false);
    useEffect(() => {
        if (kasbon.jenis_kasbon === "permohonan") {
            if (firstInput.current) {
                firstInput.current.focus();
            }
        }
    }, []);

    const setPermohonan = (perm: Permohonan | undefined) => {
        firstInput.current.value = perm?.nama_penerima;
        setData({
            ...data,
            permohonan: perm,
            transpermohonan_id: perm?.transpermohonan
                ? perm.transpermohonan.id
                : "",
        });
    };
    function prosesLaporan(e: any) {
        e.preventDefault();
        setShowModalLaporan(true);
    }

    return (
        <StafLayout>
            <div className="flex content-center items-center justify-center relative -top-2">
                <div className="w-full lg:w-11/12 px-4 ">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-100 border-0">
                        <div className="rounded-t mb-1 px-4 py-4 ">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-lightBlue-800 text-lightBlue-100 px-4 py-2 shadow-md rounded-lg">
                                <div className="text-left">
                                    <h6 className="font-semibold">
                                        KASBON PENGELUARAN BIAYA PERMOHONAN
                                    </h6>
                                </div>
                                <div className="text-left md:text-right">
                                    {moment(
                                        kasbon.tgl_kasbon,
                                        "DD MMM YYYY hh:mm"
                                    ).format("DD MMM YYYY hh:mm")}
                                </div>
                            </div>
                        </div>
                        <div className="flex-auto px-4 lg:px-6 py-4 pt-0">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                                <Input
                                    name="keperluan"
                                    label="Keperluan"
                                    // errors={errors.keperluan}
                                    value={kasbon.keperluan}
                                    // onChange={(e) =>
                                    //     setData("keperluan", e.target.value)
                                    // }
                                />
                                <Input
                                    name="instansi"
                                    label="Instansi"
                                    value={kasbon.instansi.nama_instansi}
                                    disabled
                                />

                                <Input
                                    name="user"
                                    label="User"
                                    value={kasbon.user?.name}
                                    disabled
                                />
                                {/* <SelectSearch
                                        name="status_kasbon"
                                        label="Status"
                                        value={kasbon.statuskabonOpt}
                                        options={statuskasbonOpts}
                                        onChange={(e: any) =>
                                            setData({
                                                ...data,
                                                statuskabonOpt: e ? e : {},
                                                status_kasbon: e ? e.value : "",
                                            })
                                        }
                                        errors={errors.status_kasbon}
                                    /> */}
                                {/* <div className="flex items-center justify-center gap-2 m-auto pt-4">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route("transaksi.kasbons.index")}
                                    >
                                        <span>Kembali</span>
                                    </LinkButton>
                                    <LoadingButton
                                        theme="black"
                                        loading={processing}
                                        type="submit"
                                    >
                                        <span>Simpan</span>
                                    </LoadingButton>
                                </div> */}
                            </div>
                            {kasbon &&
                            kasbon.status_kasbon == "wait_approval" ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="w-full grid grid-cols-2 gap-2">
                                        <div className="w-full grid grid-cols-1">
                                            {kasbon.jenis_kasbon ===
                                                "permohonan" && (
                                                <div className="flex flex-row justify-between items-center">
                                                    {/* <PermohonanSelect
                                                        inputRef={firstInput}
                                                        value={data.permohonan}
                                                        className="mb-1 w-full mr-2"
                                                        errors={
                                                            errors.transpermohonan_id
                                                        }
                                                        onValueChange={(e) => {
                                                            setData((v) => ({
                                                                ...v,
                                                                permohonan: e,
                                                                transpermohonan_id:
                                                                    e
                                                                        .transpermohonan
                                                                        .id,
                                                            }));
                                                        }}
                                                    /> */}
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
                                                        isDisabledCheck={
                                                            !allPermohonan
                                                        }
                                                        isChecked={
                                                            allPermohonan
                                                        }
                                                        onValueChange={(e) => {
                                                            if (e) {
                                                                setData(
                                                                    (v) => ({
                                                                        ...v,
                                                                        permohonan:
                                                                            e.permohonan,
                                                                        transpermohonan_id:
                                                                            e.id,
                                                                    })
                                                                );
                                                            } else {
                                                                setData(
                                                                    (v) => ({
                                                                        ...v,
                                                                        transpermohonan_id:
                                                                            "",
                                                                    })
                                                                );
                                                            }
                                                        }}
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
                                            )}
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
                                                <div className="px-2 py-1 text-md rounded shadow-md bg-slate-300">
                                                    {kasbon.status_kasbon}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full flex items-start">
                                            {kasbon.jenis_kasbon ===
                                                "permohonan" && (
                                                <CardPermohonanEditable
                                                    permohonan={data.permohonan}
                                                    base_route={base_route}
                                                />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <LinkButton
                                                theme="blueGrey"
                                                href={route(
                                                    base_route +
                                                        "transaksi.kasbons.index"
                                                )}
                                            >
                                                <span>Kembali</span>
                                            </LinkButton>
                                            <Button
                                                disabled={
                                                    kasbon.jumlah_kasbon == 0
                                                }
                                                theme="blue"
                                                onClick={(e) =>
                                                    prosesLaporan(e)
                                                }
                                            >
                                                <span>Cetak</span>
                                            </Button>
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
                                    <span>{kasbon.status_kasbon}</span>
                                </Button>
                            )}
                            <div className="w-full flex items-start">
                                {kasbon.jenis_kasbon === "permohonan" ? (
                                    <CardDkasbonList kasbon={kasbon} />
                                ) : (
                                    <CardDkasbonnopermList kasbon={kasbon} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <ModalCetakLaporan
                    showModal={showModalLaporan}
                    setShowModal={setShowModalLaporan}
                    src={route(
                        base_route + "transaksi.kasbons.lap.staf",
                        kasbon.id
                    )}
                />

                <ModalAddPermohonan
                    showModal={showModalAddPermohonan}
                    setShowModal={setShowModalAddPermohonan}
                    setPermohonan={setPermohonan}
                    src={route(base_route + "permohonans.modal.create")}
                />
            </div>
        </StafLayout>
    );
};

export default Edit;
