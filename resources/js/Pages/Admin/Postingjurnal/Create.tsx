import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import SelectSearch from "@/Components/Shared/SelectSearch";
import TextInput from "@/Components/TextInput";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { OptionSelect } from "@/types";
import MoneyInput from "@/Components/Shared/MoneyInput";
import { useRef } from "react";

const Create = () => {
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

    const { akunOpts } = usePage<{ akunOpts: OptionSelect[] }>().props;
    const { data, setData, errors, post, processing } = useForm<FormValues>({
        uraian: "",
        akun_debet: "",
        akun_kredit: "",
        jumlah: "0",
        image: "",
        akundebet: undefined,
        akunkredit: undefined,
        _method: "POST",
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("admin.transaksi.postingjurnals.store"));
    }
    const firstInput = useRef<any>(null);

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/4 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-4 py-2">
                            <div className="text-center mb-2">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    New Posting Jurnal
                                </h6>
                            </div>
                            <hr className="mt-4 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
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

export default Create;
