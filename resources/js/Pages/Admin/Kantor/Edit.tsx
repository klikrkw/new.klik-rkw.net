import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import AdminLayout from "@/Layouts/AdminLayout";
import { Kantor } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import Select, { MultiValue, OnChangeValue } from "react-select";

type Props = {
    isAdmin: boolean;
    baseDir: string;
    baseRoute: string;
    kantor: Kantor;
};

const Edit = ({ kantor, baseDir, baseRoute }: Props) => {
    type FormValues = {
        id: string;
        nama_kantor: string;
        alamat_kantor: string;
        image_kantor: string | null;
        _method: string;
    };

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        id: kantor.id,
        nama_kantor: kantor.nama_kantor,
        alamat_kantor: kantor.alamat_kantor,
        image_kantor: kantor.image_kantor,
        _method: "PUT",
    });

    // const onChange = (selectedOptions: OnChangeValue<Permission[], true>) =>
    //     setData('permissions', selectedOptions);

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("admin.kantors.update", kantor.id));
    }

    // function restore() {
    //     if (confirm('Are you sure you want to restore this user?')) {
    //         router.put(route('users.restore', user.id));
    //     }
    // }
    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/3 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Edit Kantor
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input
                                    name="nama_kantor"
                                    label="Nama Kantor"
                                    errors={errors.nama_kantor}
                                    value={data.nama_kantor}
                                    onChange={(e) =>
                                        setData("nama_kantor", e.target.value)
                                    }
                                />
                                <Input
                                    name="alamat_kantor"
                                    label="Alamat Kantor"
                                    errors={errors.alamat_kantor}
                                    value={data.alamat_kantor}
                                    onChange={(e) =>
                                        setData("alamat_kantor", e.target.value)
                                    }
                                />

                                <div className="flex items-center justify-between">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            baseRoute + "kantors.index"
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
