import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { BaseSyntheticEvent } from "react";

const Create = () => {
    type FormValues = {
        nama_statusprosesperm: string;
        image_statusprosesperm: string;
        _method: string;
    };

    // const { permissions } = usePage<any>().props;
    const { data, setData, errors, post, processing, progress } =
        useForm<FormValues>({
            nama_statusprosesperm: "",
            image_statusprosesperm: "",
            _method: "POST",
        });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("admin.statusprosesperms.store"), {
            forceFormData: true,
        });
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
                                    New Status Proses
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input
                                    name="nama_statusprosesperm"
                                    label="Nama Item Proses Permohonan"
                                    errors={errors.nama_statusprosesperm}
                                    value={data.nama_statusprosesperm}
                                    onChange={(e) =>
                                        setData(
                                            "nama_statusprosesperm",
                                            e.target.value
                                        )
                                    }
                                />
                                <Input
                                    type="file"
                                    name="image_statusprosesperm"
                                    label="Gambar"
                                    errors={errors.image_statusprosesperm}
                                    onChange={(e: BaseSyntheticEvent) =>
                                        setData(
                                            "image_statusprosesperm",
                                            e.target.files[0]
                                        )
                                    }
                                />
                                {progress && (
                                    <progress
                                        value={progress.percentage}
                                        max="100"
                                    >
                                        {progress.percentage}%
                                    </progress>
                                )}
                                {/* <Input type='file' name='image_statusprosesperm' label='Gambar' errors={errors.image_statusprosesperm} onChange={(e: BaseSyntheticEvent) => setData('image_statusprosesperm', e.target.files[0])} />
                                {progress && (
                                    <progress value={progress.percentage} max="100">
                                        {progress.percentage}%
                                    </progress>
                                )} */}
                                <div className="flex items-center justify-between ">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            "admin.statusprosesperms.index"
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
