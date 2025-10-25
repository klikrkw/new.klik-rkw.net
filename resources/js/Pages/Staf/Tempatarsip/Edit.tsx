import ModalCetakLaporan from "@/Components/Modals/ModalCetakLaporan";
import PrintDialog from "@/Components/Modals/PrintDialog";
import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import NumberInput from "@/Components/Shared/NumberInput";
import SelectSearch from "@/Components/Shared/SelectSearch";
import UploadImage from "@/Components/Shared/UploadImage";
import AdminLayout from "@/Layouts/AdminLayout";
import StafLayout from "@/Layouts/StafLayout";
import { OptionSelect, PrintData, Tempatarsip } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { SyntheticEvent, useState } from "react";
import Select, { MultiValue, OnChangeValue } from "react-select";

type Props = {
    isAdmin: boolean;
    baseDir: string;
    baseRoute: string;
    tempatarsip: Tempatarsip;
    ruangOpts: OptionSelect[];
    selRuangOpt: OptionSelect | undefined;
    jenistempatarsipOpts: OptionSelect[];
    selJenistempatarsipOpt: OptionSelect | undefined;
    base_route: string;
};

const Edit = ({
    tempatarsip,
    baseDir,
    baseRoute,
    selRuangOpt,
    ruangOpts,
    selJenistempatarsipOpt,
    jenistempatarsipOpts,
    base_route,
}: Props) => {
    type FormValues = {
        id: string;
        nama_tempatarsip: string;
        kode_tempatarsip: string;
        image_tempatarsip: string | null;
        ruang: OptionSelect | undefined;
        ruang_id: string;
        baris: number;
        kolom: number;
        jenistempatarsip_id: string;
        jenistempatarsip: OptionSelect | undefined;
        _method: string;
    };

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        id: tempatarsip.id,
        nama_tempatarsip: tempatarsip.nama_tempatarsip || "",
        kode_tempatarsip: tempatarsip.kode_tempatarsip || "",
        image_tempatarsip: tempatarsip.image_tempatarsip || "",
        ruang_id: tempatarsip.ruang.id || "",
        baris: tempatarsip.baris || 0,
        kolom: tempatarsip.kolom || 0,
        ruang: selRuangOpt || undefined,
        jenistempatarsip_id: tempatarsip.jenistempatarsip.id || "",
        jenistempatarsip: selJenistempatarsipOpt || undefined,
        _method: "PUT",
    });

    // const onChange = (selectedOptions: OnChangeValue<Permission[], true>) =>
    //     setData('permissions', selectedOptions);

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("admin.tempatarsips.update", tempatarsip.id));
    }
    const [showModalLaporan, setShowModalLaporan] = useState<boolean>(false);
    const [showModalPrint, setShowModalPrint] = useState<boolean>(false);
    const [printData, setPrintData] = useState<PrintData>({
        row: "1",
        col: "1",
    });

    // function restore() {
    //     if (confirm('Are you sure you want to restore this user?')) {
    //         router.put(route('users.restore', user.id));
    //     }
    // }
    return (
        <StafLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/3 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Edit Tempatarsip
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <SelectSearch
                                    name="ruang_id"
                                    label="Ruang"
                                    value={data.ruang}
                                    options={ruangOpts}
                                    className="w-full mb-4"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            ruang_id: e ? e.value : "",
                                            ruang: e ? e : {},
                                        })
                                    }
                                />
                                <SelectSearch
                                    name="jenistempatarsip_id"
                                    label="Jenis Tempat Arsip"
                                    value={data.jenistempatarsip}
                                    options={jenistempatarsipOpts}
                                    className="w-full mb-4"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            jenistempatarsip_id: e
                                                ? e.value
                                                : "",
                                            jenistempatarsip: e ? e : {},
                                        })
                                    }
                                />
                                <Input
                                    name="nama_tempatarsip"
                                    label="Nama Tempat Arsip"
                                    errors={errors.nama_tempatarsip}
                                    value={data.nama_tempatarsip}
                                    onChange={(e) =>
                                        setData(
                                            "nama_tempatarsip",
                                            e.target.value
                                        )
                                    }
                                />
                                <NumberInput
                                    name="baris"
                                    label="Baris"
                                    errors={errors.baris}
                                    value={data.baris}
                                    onChange={(e) =>
                                        setData(
                                            "baris",
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                                <NumberInput
                                    name="kolom"
                                    label="Kolom"
                                    errors={errors.kolom}
                                    value={data.kolom}
                                    onChange={(e) =>
                                        setData(
                                            "kolom",
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                                <UploadImage
                                    image={data.image_tempatarsip}
                                    imagePath="/images/tempatarsips/"
                                    setImage={(image) =>
                                        setData("image_tempatarsip", image)
                                    }
                                    name="image_tempatarsip"
                                />
                                <div className="flex items-center justify-between mt-4">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            baseRoute + "tempatarsips.index"
                                        )}
                                    >
                                        <span>Kembali</span>
                                    </LinkButton>
                                    <LinkButton
                                        theme="blueGrey"
                                        href="#"
                                        onClick={(e: SyntheticEvent) => {
                                            e.preventDefault();
                                            setShowModalPrint(true);
                                        }}
                                    >
                                        <i className="fas fa-qrcode" />
                                        <span className="ml-1">
                                            Cetak Qrcode
                                        </span>
                                    </LinkButton>
                                    <LoadingButton
                                        theme="black"
                                        loading={processing}
                                        type="submit"
                                    >
                                        <span>Simpan</span>
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <PrintDialog
                showModal={showModalPrint}
                setShowModal={(e) => setShowModalPrint(e)}
                onCommit={(e: PrintData) => {
                    setPrintData(e);
                    setShowModalPrint(false);
                    setShowModalLaporan(true);
                }}
            />
            <ModalCetakLaporan
                showModal={showModalLaporan}
                setShowModal={setShowModalLaporan}
                src={route(base_route + "tempatarsips.qrcode.cetak", {
                    tempatarsip: tempatarsip.id,
                    row: printData.row,
                    col: printData.col,
                })}
            />
        </StafLayout>
    );
};

export default Edit;
