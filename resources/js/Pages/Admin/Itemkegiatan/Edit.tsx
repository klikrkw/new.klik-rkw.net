import AsyncSelectSearch from "@/Components/Shared/AsyncSelectSearch";
import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import SelectSearch from "@/Components/Shared/SelectSearch";
import AdminLayout from "@/Layouts/AdminLayout";
import { Itemkegiatan, OptionSelect } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import Select, { MultiValue, OnChangeValue } from "react-select";

const Edit = () => {
    type UserOption = {
        label: string;
        value: string;
    };

    type FormValues = {
        nama_itemkegiatan: string;
        instansi: OptionSelect | undefined;
        instansi_id: string;
        akun_id: string;
        akun: OptionSelect | undefined;
        grupitemkegiatans: OptionSelect[] | [];
        itemrincianbiayaperms: OptionSelect[] | [];
        isunique: boolean;
        checkbiaya: boolean;
        _method: string;
    };

    const {
        grupitemkegiatanOpts,
        itemrincianbiayapermOpts,
        selGrupitemkegiatanOpts,
        selItemrincianbiayapermOpts,
        itemkegiatan,
        instansiOpts,
        selInstansiOpt,
        akunOpts,
        selAkunOpt,
    } = usePage<{
        grupitemkegiatanOpts: OptionSelect[];
        itemrincianbiayapermOpts: OptionSelect[];
        selGrupitemkegiatanOpts: OptionSelect[];
        selItemrincianbiayapermOpts: OptionSelect[];
        itemkegiatan: Itemkegiatan;
        instansiOpts: OptionSelect[];
        selInstansiOpt: OptionSelect;
        akunOpts: OptionSelect[];
        selAkunOpt: OptionSelect;
    }>().props;

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        nama_itemkegiatan: itemkegiatan.nama_itemkegiatan || "",
        instansi_id: itemkegiatan.instansi_id || "",
        instansi: selInstansiOpt || undefined,
        akun_id: itemkegiatan.akun_id || "",
        akun: selAkunOpt || undefined,
        grupitemkegiatans: selGrupitemkegiatanOpts,
        itemrincianbiayaperms: selItemrincianbiayapermOpts,
        isunique: itemkegiatan.isunique || false,
        checkbiaya: itemkegiatan.checkbiaya || false,
        _method: "PUT",
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("admin.itemkegiatans.update", itemkegiatan.id));
    }

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/4 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-2">
                            <div className="text-center mb-2">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Edit Item Kegiatan
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-4 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input
                                    name="nama_itemkegiatan"
                                    label="Nama Item Kegiatan"
                                    errors={errors.nama_itemkegiatan}
                                    value={data.nama_itemkegiatan}
                                    onChange={(e) =>
                                        setData(
                                            "nama_itemkegiatan",
                                            e.target.value
                                        )
                                    }
                                />
                                <SelectSearch
                                    name="instansi_id"
                                    label="Instansi"
                                    value={data.instansi}
                                    options={instansiOpts}
                                    className="w-full"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            instansi_id: e ? e.value : "",
                                            instansi: e ? e : {},
                                        })
                                    }
                                />
                                <SelectSearch
                                    name="akun_id"
                                    label="Akun"
                                    value={data.akun}
                                    options={akunOpts}
                                    className="w-full"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            akun_id: e ? e.value : "",
                                            akun: e ? e : {},
                                        })
                                    }
                                />
                                <SelectSearch
                                    isMulti
                                    name="grupitemkegiatans_id"
                                    label="Grup Item"
                                    value={data.grupitemkegiatans}
                                    options={grupitemkegiatanOpts}
                                    className="w-full"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            grupitemkegiatans: e ? e : {},
                                        })
                                    }
                                />
                                <div className="mb-2">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            id="checkBiaya"
                                            type="checkbox"
                                            className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                            checked={data.checkbiaya}
                                            onChange={(e) =>
                                                setData(
                                                    "checkbiaya",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <span className="ml-2 text-sm font-semibold text-blueGray-600">
                                            Check Rincian Biaya
                                        </span>
                                    </label>
                                </div>

                                <SelectSearch
                                    isMulti
                                    name="itemrincianbiayaperm_id"
                                    label="Rincian Biaya"
                                    value={data.itemrincianbiayaperms}
                                    options={itemrincianbiayapermOpts}
                                    className="w-full"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            itemrincianbiayaperms: e ? e : {},
                                        })
                                    }
                                />
                                <div className="mb-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            id="customCheckLogin"
                                            type="checkbox"
                                            className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                            checked={data.isunique}
                                            onChange={(e) =>
                                                setData(
                                                    "isunique",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <span className="ml-2 text-sm font-semibold text-blueGray-600">
                                            Unique
                                        </span>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            "admin.itemkegiatans.index"
                                        )}
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
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Edit;
