import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import MoneyInput from "@/Components/Shared/MoneyInput";
import {
    Dkeluarbiayapermuser,
    Kasbon,
    Keluarbiayapermuser,
    OptionSelect,
    Permohonan,
} from "@/types";
import SelectSearch from "@/Components/Shared/SelectSearch";
import moment from "moment";
import PermohonanSelect from "@/Components/Shared/PermohonanSelect";
import CardPermohonan from "@/Components/Cards/Admin/CardPermohonan";
import { useEffect, useRef, useState } from "react";
import CardAnggarankeluarbiayapermList from "@/Components/Cards/Staf/CardAnggarankeluarbiayapermList";
import StafLayout from "@/Layouts/StafLayout";
import CardPermohonanEditable from "@/Components/Cards/Admin/CardPermohonanEditable";
import ModalAddPermohonan from "@/Components/Modals/ModalAddPermohonan";

type Props = {
    kasbon: Kasbon;
    itemkegiatanOpts: OptionSelect[];
    is_admin: boolean;
    base_route: string;
};
const Create = ({ kasbon, itemkegiatanOpts, is_admin, base_route }: Props) => {
    type FormValues = {
        itemkegiatan: OptionSelect | undefined;
        itemkegiatan_id: string;
        kasbon_id: string;
        jumlah_biaya: string;
        ket_biaya: string;
        permohonan: Permohonan | undefined;
        transpermohonan_id: string;
        _method: string;
    };

    // const { statuskasbonOpts } = usePage<{ statuskasbonOpts: OptionSelect[] }>().props;
    const { data, setData, errors, processing, post, reset } =
        useForm<FormValues>({
            itemkegiatan: undefined,
            itemkegiatan_id: "",
            kasbon_id: kasbon.id,
            jumlah_biaya: "0",
            ket_biaya: "",
            permohonan: undefined,
            transpermohonan_id: "",
            _method: "POST",
        });

    const firstInput = useRef<any>();
    const [showModalLaporan, setShowModalLaporan] = useState<boolean>(false);
    const [showModalAddPermohonan, setShowModalAddPermohonan] =
        useState<boolean>(false);

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route(base_route + "transaksi.anggarankeluarbiayaperms.store"), {
            onSuccess: () => {
                reset();
                firstInput.current.value = "";
                firstInput.current.focus();
            },
        });
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
        firstInput.current.value = perm?.nama_penerima;
        setData({
            ...data,
            permohonan: perm,
            transpermohonan_id: perm?.transpermohonan
                ? perm.transpermohonan.id
                : "",
        });
    };

    return (
        <StafLayout>
            <div className="flex content-center items-center justify-center relative -top-2">
                <div className="w-full lg:w-11/12 px-4 ">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-100 border-0">
                        <div className="rounded-t mb-1 px-4 py-4 ">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-lightBlue-800 text-lightBlue-100 px-4 py-2 shadow-md rounded-lg">
                                <div className="text-left">
                                    <h6 className="font-semibold">
                                        ANGGARAN PENGELUARAN BIAYA
                                    </h6>
                                </div>
                                <div className="text-left md:text-right">
                                    {moment(
                                        new Date(),
                                        "DD MMM YYYY hh:mm"
                                    ).format("DD MMM YYYY hh:mm")}
                                </div>
                            </div>
                        </div>
                        <div className="flex-auto px-4 lg:px-6 py-4 pt-0">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                <MoneyInput
                                    label="Kasbon"
                                    value={kasbon.jumlah_kasbon}
                                    disabled
                                />
                                <Input
                                    label="Instansi"
                                    value={kasbon.instansi.nama_instansi}
                                    disabled
                                    name="instansi"
                                />
                                <Input
                                    label="Keperluan"
                                    value={kasbon.keperluan}
                                    disabled
                                    name="instansi"
                                />
                            </div>
                            {kasbon.status_kasbon === "wait_approval" ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="w-full grid grid-cols-2 gap-2">
                                        <div className="w-full grid grid-cols-1">
                                            <div className="flex flex-row justify-between items-center">
                                                <PermohonanSelect
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
                                            </div>
                                        </div>
                                        <div className="w-full flex items-start">
                                            <CardPermohonanEditable
                                                permohonan={data.permohonan}
                                                base_route={base_route}
                                            />
                                        </div>
                                    </div>
                                </form>
                            ) : null}
                            <div className="w-full flex items-start">
                                <CardAnggarankeluarbiayapermList
                                    kasbon={kasbon}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <LinkButton
                                    theme="blueGrey"
                                    href={route(
                                        base_route + "transaksi.kasbons.index"
                                    )}
                                >
                                    <span>Kembali</span>
                                </LinkButton>
                                {/* <Button
                                    disabled={
                                        parseInt(
                                            keluarbiayapermuser.jumlah_biaya
                                        ) == 0
                                    }
                                    theme="blue"
                                    onClick={(e) => prosesLaporan(e)}
                                >
                                    <span>Cetak</span>
                                </Button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalAddPermohonan
                showModal={showModalAddPermohonan}
                setShowModal={setShowModalAddPermohonan}
                setPermohonan={setPermohonan}
                src={route(base_route + "permohonans.modal.create")}
            />

            {/* <ModalCetakLaporan
                showModal={showModalLaporan}
                setShowModal={setShowModalLaporan}
                src={route(
                    base_route + "transaksi.keluarbiayapermusers.lap.staf",
                    keluarbiayapermuser.id
                )}
            /> */}
        </StafLayout>
    );
};

export default Create;
