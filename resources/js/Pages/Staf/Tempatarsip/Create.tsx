import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import NumberInput from "@/Components/Shared/NumberInput";
import SelectSearch from "@/Components/Shared/SelectSearch";
import UploadImage from "@/Components/Shared/UploadImage";
import AdminLayout from "@/Layouts/AdminLayout";
import { Ruang, OptionSelect } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
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
        nama_tempatarsip: string;
        image_tempatarsip: string | null;
        ruang_id: string;
        baris: string;
        kolom: string;
        ruang: OptionSelect | undefined;
        jenistempatarsip_id: string;
        jenistempatarsip: OptionSelect | undefined;
        _method: string;
    };

    // const { permissions } = usePage<any>().props;
    const { data, setData, errors, post, processing } = useForm<FormValues>({
        nama_tempatarsip: "",
        image_tempatarsip: "",
        ruang_id: "",
        baris: "",
        kolom: "",
        ruang: undefined,
        jenistempatarsip_id: "",
        jenistempatarsip: undefined,
        _method: "POST",
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route(baseRoute + "tempatarsips.store"));
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
                                    New Tempatarsip
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
                                        setData("baris", e.target.value)
                                    }
                                />
                                <NumberInput
                                    name="kolom"
                                    label="Kolom"
                                    errors={errors.kolom}
                                    value={data.kolom}
                                    onChange={(e) =>
                                        setData("kolom", e.target.value)
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

                                <div className="flex items-center justify-between ">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            baseRoute + "tempatarsips.index"
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
