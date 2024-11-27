import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import SelectSearch from "@/Components/Shared/SelectSearch";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import React, {
    ChangeEventHandler,
    InputHTMLAttributes,
    useEffect,
    useRef,
} from "react";
import Select, { MultiValue, OnChangeValue } from "react-select";

const Create = () => {
    type Role = {
        label: string;
        value: string;
    };
    type Permission = {
        label: string;
        value: string;
    };

    type FormValues = {
        name: string;
        email: string;
        password: string;
        roles: MultiValue<Role[]>;
        permissions: MultiValue<Permission[]>;
        _method: string;
    };

    const { user, roles, permissions } = usePage<any>().props;
    const { data, setData, errors, post, processing } = useForm<FormValues>({
        name: "",
        email: "",
        password: "",
        roles: [],
        permissions: [],
        _method: "POST",
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("admin.users.store"));
    }

    function destroy() {
        if (confirm("Are you sure you want to delete this user?")) {
            router.delete(route("users.destroy", user.id));
        }
    }

    // function restore() {
    //     if (confirm('Are you sure you want to restore this user?')) {
    //         router.put(route('users.restore', user.id));
    //     }
    // }

    const onChange = (selectedOptions: OnChangeValue<Role[], true>) =>
        setData("roles", selectedOptions);

    const onPermissionChange = (
        selectedOptions: OnChangeValue<Permission[], true>
    ) => setData("permissions", selectedOptions);
    const firstInput = useRef<any>(null);
    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/3 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    New User
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input
                                    ref={firstInput}
                                    focused
                                    name="name"
                                    label="Name"
                                    errors={errors.name}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                <Input
                                    name="email"
                                    label="Email"
                                    errors={errors.email}
                                    value={data.email}
                                    type="email"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <Input
                                    name="password"
                                    autoComplete="false"
                                    label="Password"
                                    errors={errors.password}
                                    value={data.password}
                                    type="password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <SelectSearch
                                    name="roles"
                                    options={roles}
                                    isMulti
                                    label="Roles"
                                    onChange={onChange}
                                    value={data.roles}
                                />
                                <SelectSearch
                                    name="permissions"
                                    options={permissions}
                                    isMulti
                                    label="Permissions"
                                    value={data.permissions}
                                    onChange={onPermissionChange}
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

export default Create;
