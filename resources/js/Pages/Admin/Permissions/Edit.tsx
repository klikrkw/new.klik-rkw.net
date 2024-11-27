import Input from '@/Components/Shared/Input';
import LinkButton from '@/Components/Shared/LinkButton';
import { LoadingButton } from '@/Components/Shared/LoadingButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import Select, { MultiValue, OnChangeValue } from 'react-select'

const Edit = () => {
    type Role = {
        label: string,
        value: string,
    }
    type FormValues = {
        name: string,
        roles: MultiValue<Role[]>,
        _method: string
    }

    const { permission, roles, permissionRoles } = usePage<any>().props;
    const selectedRoles = permissionRoles.map((e: any) => ({ value: e.id, label: e.name }))

    const { data, setData, errors, post, processing } = useForm({
        id: permission.id || '',
        name: permission.name || '',
        roles: selectedRoles || [],
        _method: 'PUT'
    });

    const onChange = (selectedOptions: OnChangeValue<Role[], true>) =>
        setData('roles', selectedOptions);

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route('admin.permissions.update', permission.id));
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
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Update Permission
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
                                    <Select name='roles' options={roles} isMulti onChange={onChange} defaultValue={selectedRoles} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <LinkButton theme='blueGrey' href={route('admin.permissions.index')}>
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
