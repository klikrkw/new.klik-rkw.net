import AsyncSelectSearch from "@/Components/Shared/AsyncSelectSearch";
import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import MoneyInput from "@/Components/Shared/MoneyInput";
import SelectSearch from "@/Components/Shared/SelectSearch";
import AdminLayout from "@/Layouts/AdminLayout";
import { OptionSelect, Postingjurnal } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { useRef } from "react";
import Select, { MultiValue, OnChangeValue } from "react-select";

const Edit = () => {
    type UserOption = {
        label: string;
        value: string;
    };

    type FormValues = {
        uraian: string;
        akundebet: OptionSelect | undefined;
        akunkredit: OptionSelect | undefined;
        akun_debet: string;
        akun_kredit: string;
        jumlah: string;
        image: string;
        _method: string;
    };

    const { postingjurnal, akunOpts, selAkunDebetOpt, selAkunKreditOpt } =
        usePage<{
            postingjurnal: Postingjurnal;
            akunOpts: OptionSelect[];
            selAkunDebetOpt: OptionSelect;
            selAkunKreditOpt: OptionSelect;
        }>().props;

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        uraian: postingjurnal.uraian || "",
        akun_debet: postingjurnal.akun_debet || "",
        akun_kredit: postingjurnal.akun_kredit || "",
        akundebet: selAkunDebetOpt || undefined,
        akunkredit: selAkunKreditOpt || undefined,
        jumlah: postingjurnal.jumlah || "",
        image: postingjurnal.image || "",
        _method: "PUT",
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("admin.transaksi.postingjurnals.update", postingjurnal.id));
    }
    const firstInput = useRef<any>(null);

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
                                    ref={firstInput}
                                    focused
                                    name="uraian"
                                    label="Uraian"
                                    errors={errors.uraian}
                                    value={data.uraian}
                                    onChange={(e) =>
                                        setData("uraian", e.target.value)
                                    }
                                />
                                <SelectSearch
                                    name="akun_debet"
                                    label="Akun Debet"
                                    value={data.akundebet}
                                    options={akunOpts}
                                    className="w-full"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            akun_debet: e ? e.value : "",
                                            akundebet: e ? e : {},
                                        })
                                    }
                                    errors={errors.akun_debet}
                                />
                                <SelectSearch
                                    name="akun_debet"
                                    label="Akun Kredit"
                                    value={data.akunkredit}
                                    options={akunOpts}
                                    className="w-full"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            akun_kredit: e ? e.value : "",
                                            akunkredit: e ? e : {},
                                        })
                                    }
                                    errors={errors.akun_kredit}
                                />
                                <MoneyInput
                                    name="jumlah"
                                    label="Jumlah"
                                    errors={errors.jumlah}
                                    autoComplete="off"
                                    value={data.jumlah}
                                    onValueChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            jumlah: e.value,
                                        }))
                                    }
                                />
                                <div className="flex items-center justify-between">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            "admin.transaksi.postingjurnals.index"
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
