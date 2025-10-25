import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import SelectSearch from "@/Components/Shared/SelectSearch";
import AdminLayout from "@/Layouts/AdminLayout";
import { OptionSelect } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import React, { useRef } from "react";
import Select, { MultiValue, OnChangeValue, SingleValue } from "react-select";

const Create = () => {
    type FormValues = {
        nama_pengaturan: string;
        grup: string;
        nilai: string;
        tipedata: OptionSelect | null;
        tipe_data: string;
        _method: string;
    };

    const { pengaturan, tipeDataOpts } = usePage<any>().props;
    const { data, setData, errors, post, processing } = useForm<FormValues>({
        nama_pengaturan: "",
        grup: "",
        nilai: "",
        tipedata: null,
        tipe_data: "text",
        _method: "POST",
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("admin.pengaturans.store"));
    }

    function destroy() {
        if (confirm("Are you sure you want to delete this pengaturan?")) {
            router.delete(route("pengaturans.destroy", pengaturan.id));
        }
    }

    // function restore() {
    //     if (confirm('Are you sure you want to restore this pengaturan?')) {
    //         router.put(route('pengaturans.restore', pengaturan.id));
    //     }
    // }

    const onChange = (e: SingleValue<OptionSelect>) => {
        setData({ ...data, tipedata: e, tipe_data: e?.value ?? "text" });
    };

    const firstInput = useRef<any>(null);
    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/3 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    New Pengaturan
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input
                                    name="nama_pengaturan"
                                    label="Nama Pengaturan"
                                    errors={errors.nama_pengaturan}
                                    value={data.nama_pengaturan}
                                    type="nama_pengaturan"
                                    onChange={(e) =>
                                        setData(
                                            "nama_pengaturan",
                                            e.target.value
                                        )
                                    }
                                />
                                <Input
                                    name="grup"
                                    autoComplete="false"
                                    label="Grup"
                                    errors={errors.grup}
                                    value={data.grup}
                                    type="text"
                                    onChange={(e) =>
                                        setData("grup", e.target.value)
                                    }
                                />
                                <Input
                                    name="nilai"
                                    label="Nilai"
                                    errors={errors.nilai}
                                    value={data.nilai}
                                    onChange={(e) =>
                                        setData("nilai", e.target.value)
                                    }
                                />

                                <SelectSearch
                                    name="tipe_data"
                                    options={tipeDataOpts}
                                    label="Tipe Data"
                                    onChange={onChange}
                                    value={data.tipedata}
                                />

                                <div className="flex items-center justify-between">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route("admin.pengaturans.index")}
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
