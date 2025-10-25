import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import SelectSearch from "@/Components/Shared/SelectSearch";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { useRef } from "react";

const Pesan = () => {
    type FormValues = {
        user_id: number;
        title: string;
        body: string;
        _method: string;
    };

    const { user } = usePage<any>().props;

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        user_id: user.id,
        title: "",
        body: "",
        _method: "POST",
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("send.message.mobile"));
    }
    // function restore() {
    //     if (confirm('Are you sure you want to restore this user?')) {
    //         router.put(route('users.restore', user.id));
    //     }
    // }

    const firstInput = useRef<any>(null);

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/3 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Kirim Pesan
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input
                                    ref={firstInput}
                                    focused
                                    name="title"
                                    label="Title"
                                    errors={errors.title}
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />
                                <Input
                                    name="body"
                                    label="Body"
                                    errors={errors.body}
                                    value={data.body}
                                    onChange={(e) =>
                                        setData("body", e.target.value)
                                    }
                                />

                                <div className="flex items-center justify-between">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route("admin.users.index")}
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

export default Pesan;
