import AsyncSelectSearch from '@/Components/Shared/AsyncSelectSearch';
import Input from '@/Components/Shared/Input';
import LinkButton from '@/Components/Shared/LinkButton';
import { LoadingButton } from '@/Components/Shared/LoadingButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import Select, { MultiValue, OnChangeValue } from 'react-select'

const Edit = () => {
    type UserOption = {
        label: string,
        value: string,
    }

    type FormValues = {
        nama_pemohon: string,
        alamat_pemohon: string,
        email_pemohon: string,
        telp_pemohon: string,
        nik_pemohon: string,
        nodaftar_pemohon: number,
        thdaftar_pemohon: number,
        users: MultiValue<UserOption[]>,
        active: boolean,
        _method: string
    }

    const { pemohonUsers, pemohon, users } = usePage<any>().props;
    // const selectedUsers = pemohonUsers.map((e: any) => ({ value: e.id, label: `${e.name} - ${e.email}` }))

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        nama_pemohon: pemohon.nama_pemohon,
        email_pemohon: pemohon.email_pemohon || '',
        alamat_pemohon: pemohon.alamat_pemohon,
        nik_pemohon: pemohon.nik_pemohon,
        users: pemohonUsers,
        telp_pemohon: pemohon.telp_pemohon || '',
        nodaftar_pemohon: pemohon.nodaftar_pemohon,
        thdaftar_pemohon: pemohon.thdaftar_pemohon,
        active: pemohon.active,
        _method: 'PUT'
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route('admin.pemohons.update', pemohon.id));
    }


    const onChange = (selectedOptions: OnChangeValue<UserOption[], true>) =>
        setData('users', selectedOptions);

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/3 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Edit Pemohon
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input name='nama_pemohon' label='Nama Pemohon' errors={errors.nama_pemohon} value={data.nama_pemohon} onChange={e => setData('nama_pemohon', e.target.value)} />
                                <Input name='email_pemohon' label='Email Pemohon' errors={errors.email_pemohon} value={data.email_pemohon} type='email_pemohon' onChange={e => setData('email_pemohon', e.target.value)} />
                                <Input name='alamat_pemohon' label='Alamat Pemohon' errors={errors.alamat_pemohon} value={data.alamat_pemohon} type='alamat_pemohon' onChange={e => setData('alamat_pemohon', e.target.value)} />
                                <Input name='telp_pemohon' pattern="[0-9]*" onInput={(evt: any) => {
                                    // onChange={e => setData('telp_pemohon', e.target.value)}
                                    const dt = (evt.target.validity.valid) ? evt.target.value : data.telp_pemohon;
                                    setData('telp_pemohon', dt)
                                }}
                                    label='Telp' errors={errors.telp_pemohon} value={data.telp_pemohon} type='telp_pemohon' />
                                <Input name='nik_pemohon' label='NIK' errors={errors.nik_pemohon} value={data.nik_pemohon} type='nik_pemohon' onChange={e => setData('nik_pemohon', e.target.value)} />
                                <AsyncSelectSearch name='users' isMulti label='User' url='/admin/users/api/list/' onChange={onChange} value={data.users} optionLabels={['name', 'email']} optionValue='id' />
                                <div className='mb-4'>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            id="customCheckLogin"
                                            type="checkbox"
                                            className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                            checked={data.active}
                                            onChange={e => setData('active', e.target.checked)}
                                        />
                                        <span className="ml-2 text-sm font-semibold text-blueGray-600">
                                            Active
                                        </span>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <LinkButton theme='blueGrey' href={route('admin.pemohons.index')}>
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
