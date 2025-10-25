import CardDkasbonList from "@/Components/Cards/Admin/CardDkasbonList";
import CardDkasbonnopermList from "@/Components/Cards/Admin/CardDkasbonnopermList";
import CardPermohonanEditable from "@/Components/Cards/Admin/CardPermohonanEditable";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import ModalAddPermohonan from "@/Components/Modals/ModalAddPermohonan";
import ModalCetakLaporan from "@/Components/Modals/ModalCetakLaporan";
import Button from "@/Components/Shared/Button";
import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import MoneyInput from "@/Components/Shared/MoneyInput";
import SelectSearch from "@/Components/Shared/SelectSearch";
import TranspermohonanSelect from "@/Components/Shared/TranspermohonanSelect";
import AdminLayout from "@/Layouts/AdminLayout";
import { Instansi, Kasbon, OptionSelect, Permohonan, User } from "@/types";
import useSwal from "@/utils/useSwal";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import apputils from "@/bootstrap";

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
        statuskasbonOpts,
        statuskasbonOpt,
        is_admin,
        itemkegiatanOpts,
        base_route,
        allPermohonan,
        user_id,
    } = usePage<{
        kasbon: Kasbon;
        statuskasbonOpts: OptionSelect[];
        statuskasbonOpt: OptionSelect;
        itemkegiatanOpts: OptionSelect[];
        is_admin: boolean;
        base_route: string;
        allPermohonan: boolean;
        user_id: string;
    }>().props;

    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [showModalLaporan, setShowModalLaporan] = useState<boolean>(false);
    const [statusKasbon, setStatusKasbon] = useState<OptionSelect | null>(
        statuskasbonOpt
    );
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
    const sendDataToMobileRole = async (
        datas: { navigationId: string } & object
    ) => {
        let xlink = `/admin/messages/api/senddatatomobilerole`;
        const response = await apputils.backend.post(xlink, {
            role: "admin",
            datas,
        });
        const data = response.data;
    };
    const sendMessageToWebUser = async (
        user_id: number,
        datas: { navigationId: string } & object
    ) => {
        let xlink = `/send_message`;
        const response = await apputils.backend.post(xlink, {
            user_ids: [user_id],
            title: "Permohonan Kasbon",
            body: "Permohonan Kasbon Telah Dibuat",
            datas,
        });
        const data = response.data;
    };

    function handleSubmit(e: any) {
        e.preventDefault();
        // post(route("transaksi.kasbons.update", kasbon.id));
        post(route(base_route + "transaksi.kasbons.update", kasbon.id), {
            onSuccess: () => {
                reset();
                if (kasbon.jenis_kasbon === "permohonan") {
                    firstInput.current.value = "";
                    firstInput.current.focus();
                } else {
                    secondInput.current.focus();
                }
                sendDataToMobileRole({
                    navigationId: "kasbon",
                });
            },
        });
    }
    const firstInput = useRef<any>();
    const secondInput = useRef<any>();

    const [showModalAddPermohonan, setShowModalAddPermohonan] =
        useState<boolean>(false);
    useEffect(() => {
        if (kasbon.jenis_kasbon === "permohonan") {
            if (firstInput.current) {
                firstInput.current.focus();
            }
        } else {
            if (secondInput.current) {
                secondInput.current.focus();
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

    function handleUpdateStatus(e: any) {
        e.preventDefault();
        const data = {
            status_kasbon: statusKasbon?.value,
        };
        router.put(
            route(base_route + "transaksi.kasbons.status.update", kasbon.id),
            data,
            {
                onSuccess: (e) => {
                    setShowStatusDialog(false);
                    if (user_id !== kasbon.user_id) {
                        sendMessageToWebUser(kasbon.user.id, {
                            navigationId: "kasbon",
                        });
                    }
                    useSwal.info({
                        title: "Informasi",
                        text: "Status Kasbon Updated",
                    });
                },
            }
        );
    }

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center relative -top-2">
                <div className="w-full lg:w-11/12 px-4 ">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-100 border-0">
                        <div className="rounded-t mb-1 px-4 py-4 ">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-lightBlue-800 text-lightBlue-100 px-4 py-2 shadow-md rounded-lg">
                                <div className="text-left">
                                    <h6 className="font-semibold">
                                        KASBON PENGELUARAN BIAYA
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
                            </div>
                            {kasbon &&
                            kasbon.status_kasbon == "wait_approval" ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="w-full grid grid-cols-2 gap-2">
                                        <div className="w-full grid grid-cols-1">
                                            {kasbon.jenis_kasbon ===
                                                "permohonan" && (
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
                                                    focused={true}
                                                    xref={secondInput}
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
                                                    className="px-2 py-2 text-sm text-blueGray-500 w-full"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setShowStatusDialog(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <span>
                                                        {statusKasbon?.label}
                                                    </span>
                                                </Button>
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
                            <div className="flex items-center justify-between">
                                <LinkButton
                                    theme="blueGrey"
                                    href={route(
                                        base_route + "transaksi.kasbons.index"
                                    )}
                                >
                                    <span>Kembali</span>
                                </LinkButton>
                                <Button
                                    disabled={kasbon.jumlah_kasbon == 0}
                                    theme="blue"
                                    onClick={(e) => prosesLaporan(e)}
                                >
                                    <span>Cetak</span>
                                </Button>
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
            {showStatusDialog ? (
                <Modal
                    closeable={true}
                    show={showStatusDialog}
                    maxWidth="md"
                    onClose={() => setShowStatusDialog(false)}
                >
                    <div className="w-full p-4 flex flex-col gap-2 overflow-y-visible">
                        <h1>Update Status Kasbon</h1>
                        <SelectSearch
                            placeholder="Status Kasbon"
                            name="statusKasbon"
                            value={statusKasbon}
                            options={statuskasbonOpts}
                            onChange={(e: any) => setStatusKasbon(e)}
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
