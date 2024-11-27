import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import MoneyInput from "@/Components/Shared/MoneyInput";
import SelectSearch from "@/Components/Shared/SelectSearch";
import AdminLayout from "@/Layouts/AdminLayout";
import { OptionSelect } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import Select, { MultiValue, OnChangeValue } from "react-select";

const Edit = () => {
    type FormValues = {
        id: string;
        nama_itemrincianbiayaperm: string;
        min_value: string;
        command_itemrincianbiayaperm: string;
        jenis_itemrincianbiayaperm: string;
        jenisitemrincianbiayapermOpt: OptionSelect | undefined;
        _method: string;
    };

    const { itemrincianbiayaperm, jenisitemrincianbiayapermOpts } = usePage<{
        itemrincianbiayaperm: any;
        jenisitemrincianbiayapermOpts: OptionSelect[];
    }>().props;
    const jenisitemrincianbiayapermOpt = jenisitemrincianbiayapermOpts.find(
        (item) => item.value === itemrincianbiayaperm.jenis_itemrincianbiayaperm
    );
    const { data, setData, errors, post, processing } = useForm<FormValues>({
        id: itemrincianbiayaperm.id,
        nama_itemrincianbiayaperm:
            itemrincianbiayaperm.nama_itemrincianbiayaperm || "",
        min_value: itemrincianbiayaperm.min_value || "0",
        command_itemrincianbiayaperm:
            itemrincianbiayaperm.command_itemrincianbiayaperm || "",
        jenis_itemrincianbiayaperm:
            itemrincianbiayaperm.jenis_itemrincianbiayaperm || "",
        jenisitemrincianbiayapermOpt: jenisitemrincianbiayapermOpt,
        _method: "PUT",
    });

    // const onChange = (selectedOptions: OnChangeValue<Permission[], true>) =>
    //     setData('permissions', selectedOptions);

    function handleSubmit(e: any) {
        e.preventDefault();
        post(
            route("admin.itemrincianbiayaperms.update", itemrincianbiayaperm.id)
        );
    }

    // function restore() {
    //     if (confirm('Are you sure you want to restore this user?')) {
    //         router.put(route('users.restore', user.id));
    //     }
    // }
    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-1/2 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Tambah Item Rincian Biaya
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input
                                    name="nama_itemrincianbiayaperm"
                                    label="Nama Item Biaya Permohonan"
                                    errors={errors.nama_itemrincianbiayaperm}
                                    value={data.nama_itemrincianbiayaperm}
                                    onChange={(e) =>
                                        setData(
                                            "nama_itemrincianbiayaperm",
                                            e.target.value
                                        )
                                    }
                                />
                                <MoneyInput
                                    name="min_value"
                                    label="Minimal Value"
                                    errors={errors.min_value}
                                    autoComplete="off"
                                    value={data.min_value}
                                    onValueChange={(e) =>
                                        setData("min_value", e.value)
                                    }
                                />
                                <Input
                                    name="command_itemrincianbiayaperm"
                                    label="Command Item Rincian Biaya"
                                    errors={errors.command_itemrincianbiayaperm}
                                    value={data.command_itemrincianbiayaperm}
                                    onChange={(e) =>
                                        setData(
                                            "command_itemrincianbiayaperm",
                                            e.target.value
                                        )
                                    }
                                />
                                <SelectSearch
                                    name="jenis_itemrincianbiayaperm"
                                    label="Jenis Item"
                                    value={data.jenisitemrincianbiayapermOpt}
                                    options={jenisitemrincianbiayapermOpts}
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            jenisitemrincianbiayapermOpt: e
                                                ? e
                                                : {},
                                            jenis_itemrincianbiayaperm: e
                                                ? e.value
                                                : "",
                                        })
                                    }
                                    errors={errors.jenis_itemrincianbiayaperm}
                                />
                                <div className="flex items-center justify-between ">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            "admin.itemrincianbiayaperms.index"
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
