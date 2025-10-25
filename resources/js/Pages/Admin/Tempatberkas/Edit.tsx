import ModalCetakLaporan from "@/Components/Modals/ModalCetakLaporan";
import PrintDialog from "@/Components/Modals/PrintDialog";
import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import NumberInput from "@/Components/Shared/NumberInput";
import SelectSearch from "@/Components/Shared/SelectSearch";
import UploadImage from "@/Components/Shared/UploadImage";
import AdminLayout from "@/Layouts/AdminLayout";
import { OptionSelect, PrintData, Tempatarsip, Tempatberkas } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { SyntheticEvent, useState } from "react";
import Select, { MultiValue, OnChangeValue } from "react-select";

type Props = {
    isAdmin: boolean;
    baseDir: string;
    baseRoute: string;
    tempatberkas: Tempatberkas;
    ruangOpts: OptionSelect[];
    selRuangOpt: OptionSelect | undefined;
    jenistempatarsipOpts: OptionSelect[];
    selJenistempatberkasOpt: OptionSelect | undefined;
    base_route: string;
};

const Edit = ({
    tempatberkas,
    baseDir,
    baseRoute,
    selRuangOpt,
    ruangOpts,
    selJenistempatberkasOpt,
    jenistempatarsipOpts,
    base_route,
}: Props) => {
    type FormValues = {
        id: string;
        nama_tempatberkas: string;
        image_tempatberkas: string | null;
        ruang: OptionSelect | undefined;
        ruang_id: string;
        row_count: number;
        col_count: number;
        jenistempatarsip_id: string;
        jenistempatarsip: OptionSelect | undefined;
        _method: string;
    };

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        id: tempatberkas.id,
        nama_tempatberkas: tempatberkas.nama_tempatberkas || "",
        image_tempatberkas: tempatberkas.image_tempatberkas || "",
        ruang: selRuangOpt,
        ruang_id: tempatberkas.ruang.id,
        row_count: tempatberkas.row_count,
        col_count: tempatberkas.col_count,
        jenistempatarsip_id: tempatberkas.jenistempatarsip.id,
        jenistempatarsip: selJenistempatberkasOpt,
        _method: "PUT",
    });

    // const onChange = (selectedOptions: OnChangeValue<Permission[], true>) =>
    //     setData('permissions', selectedOptions);

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("admin.tempatberkas.update", tempatberkas.id));
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
        <AdminLayout>
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
                                    name="nama_tempatberkas"
                                    label="Nama Tempat Arsip"
                                    errors={errors.nama_tempatberkas}
                                    value={data.nama_tempatberkas}
                                    onChange={(e) =>
                                        setData(
                                            "nama_tempatberkas",
                                            e.target.value
                                        )
                                    }
                                />
                                <NumberInput
                                    name="row_count"
                                    label="Baris"
                                    errors={errors.row_count}
                                    value={data.row_count}
                                    onChange={(e) =>
                                        setData(
                                            "row_count",
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                                <NumberInput
                                    name="col_count"
                                    label="Kolom"
                                    errors={errors.col_count}
                                    value={data.col_count}
                                    onChange={(e) =>
                                        setData(
                                            "col_count",
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                                <UploadImage
                                    image={data.image_tempatberkas}
                                    imagePath="/images/tempatberkas/"
                                    setImage={(image) =>
                                        setData("image_tempatberkas", image)
                                    }
                                    name="image_tempatberkas"
                                />
                                <div className="flex items-center justify-between mt-4">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            baseRoute + "tempatberkas.index"
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
                src={route(base_route + "tempatberkas.qrcode.cetak", {
                    tempatberkas: tempatberkas.id,
                    row: printData.row,
                    col: printData.col,
                })}
            />
        </AdminLayout>
    );
};

export default Edit;
