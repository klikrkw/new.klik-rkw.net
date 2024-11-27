import Input from '@/Components/Shared/Input';
import LinkButton from '@/Components/Shared/LinkButton';
import { LoadingButton } from '@/Components/Shared/LoadingButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import Select, { MultiValue, OnChangeValue } from 'react-select'

const Edit = () => {
    type Permission = {
        label: string,
        value: string,
    }
    type FormValues = {
        id: number,
        name: string,
        permissions: MultiValue<Permission[]> | undefined,
        _method: string
    }

    const { permissions, role, rolePermissions } = usePage<any>().props;
    const selectedPermissions = rolePermissions.map((e: any) => ({ value: e.id, label: e.name }))

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        id: role.id,
        name: role.name,
        permissions: selectedPermissions,
        _method: 'PUT'
    });

    const onChange = (selectedOptions: OnChangeValue<Permission[], true>) =>
        setData('permissions', selectedOptions);

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route('admin.roles.update', role.id));
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
                                    Update Role
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input name='name' label='Name' errors={errors.name} value={data.name} onChange={e => setData('name', e.target.value)} />
                                <div className="relative w-full mb-5">
                                    <label
                                        className={`block uppercase text-blueGray-600 text-xs font-bold mb-2 `}
                                    >
                                        Roles
                                    </label>
                                    <Select name='permissions' options={permissions} isMulti onChange={onChange} defaultValue={selectedPermissions} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <LinkButton theme='blueGrey' href={route('admin.roles.index')}>
                                        <span>Kembali</span>
                                    </LinkButton>
                                    <LoadingButton
                                        theme='black'
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
