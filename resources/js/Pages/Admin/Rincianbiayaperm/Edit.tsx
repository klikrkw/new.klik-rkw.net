import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import MoneyInput from "@/Components/Shared/MoneyInput";
import {
    Biayaperm,
    Drincianbiayaperm,
    OptionSelect,
    Permohonan,
    Rincianbiayaperm,
} from "@/types";
import moment, { now } from "moment";
import { useRef, useState } from "react";
import CardPermohonanEditable from "@/Components/Cards/Admin/CardPermohonanEditable";
import ModalAddPermohonan from "@/Components/Modals/ModalAddPermohonan";
import InputLabel from "@/Components/InputLabel";
import SelectSearch from "@/Components/Shared/SelectSearch";
import CardDrincianbiayapermList from "@/Components/Cards/Admin/CardDrincianbiayapermList";
import ModalCetakLaporan from "@/Components/Modals/ModalCetakLaporan";
import Button from "@/Components/Shared/Button";
import useSwal from "@/utils/useSwal";
import Modal from "@/Components/Modal";

type Props = {
    itemrincianbiayapermOpts: OptionSelect[];
    base_route: string;
    isAdmin: boolean;
    rincianbiayaperm: Rincianbiayaperm;
    permohonan: Permohonan;
    biayapermOpts: OptionSelect[] | [];
    selbiayapermOpts: OptionSelect[] | [];
};
const Edit = ({
    itemrincianbiayapermOpts,
    base_route,
    isAdmin,
    rincianbiayaperm,
    permohonan,
    biayapermOpts,
}: Props) => {
    type OptionSelectExt = {
        jenis_itemrincianbiayaperm: string;
    } & OptionSelect;
    type FormValues = {
        itemrincianbiayapermOpt: OptionSelectExt | undefined;
        itemrincianbiayaperm_id: "";
        rincianbiayaperm_id: string;
        jumlah_biaya: string;
        ket_biaya: string;
        // user: OptionSelect | undefined;
        // user_id: string;
        _method: string;
    };

    // const { statuskasbonOpts } = usePage<{ statuskasbonOpts: OptionSelect[] }>().props;
    const { data, setData, errors, post, processing, reset } =
        useForm<FormValues>({
            itemrincianbiayapermOpt: undefined,
            itemrincianbiayaperm_id: "",
            rincianbiayaperm_id: rincianbiayaperm.id,
            jumlah_biaya: "0",
            ket_biaya: "",
            _method: "PUT",
        });
    const firstInput = useRef<any>();

    const getSisaPenggunaan = (jmlKasbon: number, jmlPenggunaan: number) => {
        let xsisaPenggunaan =
            jmlKasbon > jmlPenggunaan ? jmlKasbon - jmlPenggunaan : 0;
        return xsisaPenggunaan.toString();
    };

    function handleSubmit(e: any) {
        e.preventDefault();
        post(
            route(
                base_route + "transaksi.rincianbiayaperms.update",
                rincianbiayaperm.id
            ),
            {
                onSuccess: (d) => {
                    reset("jumlah_biaya", "ket_biaya");
                    firstInput.current.focus();
                },
            }
        );
    }
    const [showModalLaporan, setShowModalLaporan] = useState<boolean>(false);
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [biayaperm, setBiayaperm] = useState<OptionSelect | null>();
    function prosesLaporan(e: any) {
        e.preventDefault();
        setShowModalLaporan(true);
    }

    function handleUpdateStatus(e: any) {
        e.preventDefault();
        const data = {
            biayaperms: biayaperm ? [biayaperm.value] : [],
        };
        router.put(
            route(
                base_route + "transaksi.rincianbiayaperms.biayaperms.update",
                rincianbiayaperm.id
            ),
            data,
            {
                onSuccess: (e) => {
                    setShowStatusDialog(false);
                    useSwal.info({
                        title: "Informasi",
                        text: "Biaya berhasil diupdate",
                    });
                },
            }
        );
    }

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center relative -top-2">
                <div className="w-full lg:w-11/12 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-100 border-0">
                        <div className="rounded-t mb-1 px-4 py-4 ">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-lightBlue-800 text-lightBlue-100 px-2 py-2 shadow-md rounded-lg">
                                <div className="text-left">
                                    <h6 className="font-semibold">
                                        RINCIAN BIAYA PERMOHONAN
                                    </h6>
                                </div>
                                <div className="text-left md:text-right">
                                    {moment(
                                        new Date(rincianbiayaperm.created_at)
                                    ).format("DD MMM YYYY HH:mm")}
                                </div>
                            </div>
                        </div>
                        <div className="flex-auto px-4 lg:px-4 py-4 pt-0">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="w-full flex flex-col gap-2 mt-2">
                                    <div className="flex flex-row items-start w-full gap-2">
                                        <div className="flex flex-col md:flex-row gap-2 justify-start items-center w-full bg-gray-300 py-1 px-2 rounded-md shadow-md">
                                            <label>Status : </label>
                                            <InputLabel
                                                className=""
                                                value={
                                                    rincianbiayaperm.status_rincianbiayaperm
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-2 justify-start items-center w-full bg-gray-300 py-1 px-2 rounded-md shadow-md">
                                            <label>User : </label>
                                            <InputLabel
                                                value={
                                                    rincianbiayaperm.user.name
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-start w-full gap-2">
                                        <div className="flex flex-col md:flex-row gap-2 justify-start items-center w-full bg-gray-300 py-1 px-2 rounded-md shadow-md">
                                            <label>Keterangan : </label>
                                            <InputLabel
                                                value={
                                                    rincianbiayaperm.ket_rincianbiayaperm
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-2 justify-start items-center w-full bg-gray-300 py-1 px-2 rounded-md shadow-md">
                                            <label>Metode : </label>
                                            <InputLabel
                                                value={
                                                    rincianbiayaperm.metodebayar
                                                        .nama_metodebayar
                                                }
                                            />
                                        </div>
                                    </div>
                                    {/* form input */}
                                    {rincianbiayaperm.status_rincianbiayaperm ===
                                    "wait_approval" ? (
                                        <form onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                <div className="w-full flex flex-col mb-2">
                                                    <SelectSearch
                                                        xref={firstInput}
                                                        focused={true}
                                                        placeholder="Pilih Kegiatan"
                                                        className="mb-0"
                                                        name="itemkegiatan_id"
                                                        value={
                                                            data.itemrincianbiayapermOpt
                                                        }
                                                        options={
                                                            itemrincianbiayapermOpts
                                                        }
                                                        onChange={(e: any) =>
                                                            setData({
                                                                ...data,
                                                                itemrincianbiayapermOpt:
                                                                    e ? e : {},
                                                                itemrincianbiayaperm_id:
                                                                    e
                                                                        ? e.value
                                                                        : "",
                                                            })
                                                        }
                                                        errors={
                                                            errors.itemrincianbiayaperm_id
                                                        }
                                                    />
                                                    {data.itemrincianbiayapermOpt ? (
                                                        <label className="ml-2 text-gray-500 text-sm uppercase">
                                                            {
                                                                data
                                                                    .itemrincianbiayapermOpt
                                                                    .jenis_itemrincianbiayaperm
                                                            }
                                                        </label>
                                                    ) : null}
                                                </div>

                                                <Input
                                                    disabled={
                                                        rincianbiayaperm.status_rincianbiayaperm !=
                                                        "wait_approval"
                                                    }
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
                                            <div className="flex flex-row items-start justify-between gap-2">
                                                <MoneyInput
                                                    name="jumlah_biaya"
                                                    disabled={
                                                        rincianbiayaperm.status_rincianbiayaperm !=
                                                        "wait_approval"
                                                    }
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

                                                <div className="w-full flex justify-around items-center ">
                                                    <LoadingButton
                                                        theme="red"
                                                        loading={processing}
                                                        type="submit"
                                                        className="text-sm py-2"
                                                    >
                                                        <span>Simpan</span>
                                                    </LoadingButton>
                                                    {rincianbiayaperm.total_pemasukan >
                                                        0 && (
                                                        <LinkButton
                                                            tabIndex={-1}
                                                            href="#"
                                                            theme="blue"
                                                            className="py-2 text-xs"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setShowStatusDialog(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <span>
                                                                Set Biaya
                                                            </span>
                                                        </LinkButton>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    ) : null}
                                    {/* end form input */}
                                </div>

                                <div className="w-full flex flex-col items-start mt-2">
                                    <div className="flex flex-row gap-2 justify-start items-center w-full bg-gray-300 py-1 px-2 rounded-md shadow-md">
                                        <label>Transaksi : </label>
                                        <InputLabel
                                            value={
                                                rincianbiayaperm.transpermohonan
                                                    .jenispermohonan
                                                    .nama_jenispermohonan
                                            }
                                        />
                                    </div>
                                    <CardPermohonanEditable
                                        permohonan={permohonan}
                                        base_route={base_route}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <LinkButton
                                    theme="blueGrey"
                                    tabIndex={-1}
                                    href={route(
                                        base_route +
                                            "transaksi.rincianbiayaperms.index"
                                    )}
                                >
                                    <span>Kembali</span>
                                </LinkButton>
                                <Button
                                    disabled={
                                        rincianbiayaperm.total_pemasukan == 0
                                    }
                                    theme="blue"
                                    onClick={(e) => prosesLaporan(e)}
                                >
                                    <span>Cetak</span>
                                </Button>
                            </div>
                            <CardDrincianbiayapermList
                                rincianbiayaperm={rincianbiayaperm}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ModalCetakLaporan
                showModal={showModalLaporan}
                setShowModal={setShowModalLaporan}
                src={route("rincianbiayaperms.lap.staf", rincianbiayaperm.id)}
            />
            {showStatusDialog ? (
                <Modal
                    closeable={true}
                    show={showStatusDialog}
                    maxWidth="md"
                    onClose={() => setShowStatusDialog(false)}
                >
                    <div className="w-full p-4 flex flex-col gap-2">
                        <h1>Update Biaya Permohonan</h1>
                        <SelectSearch
                            placeholder="Biaya Permohonan"
                            name="biayaperm"
                            value={biayaperm}
                            options={biayapermOpts}
                            onChange={(e: any) => setBiayaperm(e)}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                disabled={!biayaperm}
                                theme="blue"
                                onClick={(e) => handleUpdateStatus(e)}
                            >
                                <span>Update</span>
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
