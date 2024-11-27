import InputLabel from "@/Components/InputLabel";
import AsyncSelectSearch from "@/Components/Shared/AsyncSelectSearch";
import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import MoneyInput from "@/Components/Shared/MoneyInput";
import SelectSearch from "@/Components/Shared/SelectSearch";
import AdminLayout from "@/Layouts/AdminLayout";
import StafLayout from "@/Layouts/StafLayout";
import { Instansi, Kasbon, OptionSelect, User } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import Select, { MultiValue, OnChangeValue } from "react-select";

const Edit = () => {
    type UserOption = {
        label: string;
        value: string;
    };

    type FormValues = {
        jumlah_kasbon: string;
        jumlah_penggunaan: string;
        sisa_penggunaan: string;
        keperluan: string;
        status_kasbon: string;
        statuskabonOpt: OptionSelect | undefined;
        user: User;
        _method: string;
    };

    const { kasbon, statuskasbonOpts, statuskasbonOpt, instansi } = usePage<{
        kasbon: Kasbon;
        statuskasbonOpts: OptionSelect[];
        statuskasbonOpt: OptionSelect;
        instansi: Instansi;
    }>().props;

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        jumlah_kasbon: kasbon.jumlah_kasbon.toString() || "0",
        jumlah_penggunaan: kasbon.jumlah_penggunaan.toString() || "0",
        sisa_penggunaan: kasbon.sisa_penggunaan.toString() || "0",
        keperluan: kasbon.keperluan || "",
        status_kasbon: kasbon.status_kasbon || "",
        statuskabonOpt: statuskasbonOpt || undefined,
        user: kasbon.user,
        _method: "PUT",
    });

    const getSisaPenggunaan = (jmlKasbon: number, jmlPenggunaan: number) => {
        let xsisaPenggunaan =
            jmlKasbon > jmlPenggunaan ? jmlKasbon - jmlPenggunaan : 0;
        return xsisaPenggunaan.toString();
    };

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("transaksi.kasbons.update", kasbon.id));
    }
    console.log(kasbon);
    return (
        <AdminLayout>
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
                                <div className="text-left md:text-right"></div>
                            </div>
                        </div>
                        <div className="flex-auto px-4 lg:px-6 py-4 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/4 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-100 border-0">
                        <div className="rounded-t mb-0 px-6 py-2">
                            <div className="text-center mb-2">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Edit Kasbon
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-4 pt-0">
                            <form onSubmit={handleSubmit}>
                                <MoneyInput
                                    name="jumlah_kasbon"
                                    label="Jumlah Kasbon"
                                    errors={errors.jumlah_kasbon}
                                    autoComplete="off"
                                    value={data.jumlah_kasbon}
                                    disabled
                                    onValueChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            jumlah_kasbon: e.value,
                                            sisa_penggunaan: getSisaPenggunaan(
                                                Number.parseInt(e.value),
                                                Number.parseInt(
                                                    data.jumlah_penggunaan
                                                )
                                            ),
                                        }))
                                    }
                                />
                                <MoneyInput
                                    name="jumlah_penggunaan"
                                    label="Jumlah Penggunaan"
                                    errors={errors.jumlah_penggunaan}
                                    autoComplete="off"
                                    disabled
                                    value={data.jumlah_penggunaan}
                                    onValueChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            jumlah_penggunaan: e.value,
                                            sisa_penggunaan: getSisaPenggunaan(
                                                Number.parseInt(
                                                    data.jumlah_kasbon
                                                ),
                                                Number.parseInt(e.value)
                                            ),
                                        }))
                                    }
                                />
                                <MoneyInput
                                    name="sisa_penggunaan"
                                    label="Sisa Penggunaan"
                                    errors={errors.sisa_penggunaan}
                                    autoComplete="off"
                                    disabled
                                    value={data.sisa_penggunaan}
                                    onValueChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            sisa_penggunaan: e.value,
                                        }))
                                    }
                                />
                                <Input
                                    name="keperluan"
                                    label="Keperluan"
                                    errors={errors.keperluan}
                                    value={data.keperluan}
                                    onChange={(e) =>
                                        setData("keperluan", e.target.value)
                                    }
                                />
                                <Input
                                    name="instansi"
                                    label="Instansi"
                                    value={instansi.nama_instansi}
                                    disabled
                                />

                                <Input
                                    name="user"
                                    label="User"
                                    value={data.user?.name}
                                    disabled
                                />
                                <SelectSearch
                                    name="status_kasbon"
                                    label="Status"
                                    value={data.statuskabonOpt}
                                    options={statuskasbonOpts}
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            statuskabonOpt: e ? e : {},
                                            status_kasbon: e ? e.value : "",
                                        })
                                    }
                                    errors={errors.status_kasbon}
                                />
                                <div className="flex items-center justify-between mt-2">
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
