import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import SelectSearch from "@/Components/Shared/SelectSearch";
import TextInput from "@/Components/TextInput";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { OptionSelect } from "@/types";

const Create = () => {
    type FormValues = {
        nama_rekening: string;
        ket_rekening: string;
        akun_id: string;
        akun: OptionSelect | undefined;
        _method: string;
    };

    const { akunOpts } = usePage<{
        akunOpts: OptionSelect[];
    }>().props;
    const { data, setData, errors, post, processing } = useForm<FormValues>({
        nama_rekening: "",
        ket_rekening: "",
        akun_id: "",
        akun: undefined,
        _method: "POST",
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("admin.rekenings.store"));
    }

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/4 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-4 py-2">
                            <div className="text-center mb-2">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    New Rekening
                                </h6>
                            </div>
                            <hr className="mt-4 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input
                                    name="nama_rekening"
                                    label="Nama Rekening"
                                    errors={errors.nama_rekening}
                                    value={data.nama_rekening}
                                    onChange={(e) =>
                                        setData("nama_rekening", e.target.value)
                                    }
                                />
                                <Input
                                    name="ket_rekening"
                                    label="Keterangan"
                                    errors={errors.ket_rekening}
                                    value={data.ket_rekening}
                                    onChange={(e) =>
                                        setData("ket_rekening", e.target.value)
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
                                <div className="flex items-center justify-between">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route("admin.rekenings.index")}
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
