import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import NumberInput from "@/Components/Shared/NumberInput";
import SelectSearch from "@/Components/Shared/SelectSearch";
import UploadImage from "@/Components/Shared/UploadImage";
import AdminLayout from "@/Layouts/AdminLayout";
import { Ruang, OptionSelect } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import Select, { MultiValue, OnChangeValue } from "react-select";

type Props = {
    isAdmin: boolean;
    baseDir: string;
    baseRoute: string;
    ruangOpts: OptionSelect[];
    jenistempatarsipOpts: OptionSelect[];
};

const Create = ({
    baseDir,
    baseRoute,
    ruangOpts,
    jenistempatarsipOpts,
}: Props) => {
    type FormValues = {
        nama_tempatberkas: string;
        image_tempatberkas: string | null;
        ruang_id: string;
        row_count: string;
        col_count: string;
        ruang: OptionSelect | undefined;
        jenistempatarsip_id: string;
        jenistempatarsip: OptionSelect | undefined;
        _method: string;
    };

    // const { permissions } = usePage<any>().props;
    const { data, setData, errors, post, processing } = useForm<FormValues>({
        nama_tempatberkas: "",
        image_tempatberkas: "",
        ruang_id: "",
        row_count: "",
        col_count: "",
        ruang: undefined,
        jenistempatarsip_id: "",
        jenistempatarsip: undefined,
        _method: "POST",
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route(baseRoute + "tempatberkas.store"));
    }

    // function restore() {
    //     if (confirm('Are you sure you want to restore this user?')) {
    //         router.put(route('users.restore', user.id));
    //     }
    // }

    // const onChange = (selectedOptions: OnChangeValue<Permission[], true>) =>
    //     setData('permissions', selectedOptions);
    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-1/2 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    New Tempatberkas
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
                                    label="Jenis Tempat Berkas"
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
                                    label="Jumlah Baris"
                                    errors={errors.row_count}
                                    value={data.row_count}
                                    onChange={(e) =>
                                        setData("row_count", e.target.value)
                                    }
                                />
                                <NumberInput
                                    name="col_count"
                                    label="Jumlah Kolom"
                                    errors={errors.col_count}
                                    value={data.col_count}
                                    onChange={(e) =>
                                        setData("col_count", e.target.value)
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

                                <div className="flex items-center justify-between ">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            baseRoute + "tempatberkas.index"
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
