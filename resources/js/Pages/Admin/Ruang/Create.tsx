import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import SelectSearch from "@/Components/Shared/SelectSearch";
import AdminLayout from "@/Layouts/AdminLayout";
import { Kantor, OptionSelect } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import Select, { MultiValue, OnChangeValue } from "react-select";

type Props = {
    isAdmin: boolean;
    baseDir: string;
    baseRoute: string;
    kantorOpts: OptionSelect[];
};

const Create = ({ baseDir, baseRoute, kantorOpts }: Props) => {
    type FormValues = {
        nama_ruang: string;
        image_ruang: string | null;
        kantor_id: string;
        kantor: OptionSelect | undefined;
        _method: string;
    };

    // const { permissions } = usePage<any>().props;
    const { data, setData, errors, post, processing } = useForm<FormValues>({
        nama_ruang: "",
        image_ruang: "",
        kantor_id: "",
        kantor: undefined,
        _method: "POST",
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route(baseRoute + "ruangs.store"));
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
                                    New Ruang
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input
                                    name="nama_ruang"
                                    label="Nama Ruang"
                                    errors={errors.nama_ruang}
                                    value={data.nama_ruang}
                                    onChange={(e) =>
                                        setData("nama_ruang", e.target.value)
                                    }
                                />
                                <SelectSearch
                                    name="kantor_id"
                                    label="Kantor"
                                    value={data.kantor}
                                    options={kantorOpts}
                                    className="w-full mb-4"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            kantor_id: e ? e.value : "",
                                            kantor: e ? e : {},
                                        })
                                    }
                                />

                                <div className="flex items-center justify-between ">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(baseRoute + "ruangs.index")}
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
