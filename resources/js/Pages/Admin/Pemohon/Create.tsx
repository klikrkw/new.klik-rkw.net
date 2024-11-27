import Input from '@/Components/Shared/Input';
import LinkButton from '@/Components/Shared/LinkButton';
import { LoadingButton } from '@/Components/Shared/LoadingButton';
import SelectSearch from '@/Components/Shared/SelectSearch';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import Select, { MultiValue, OnChangeValue } from 'react-select'
import apputils from '@/bootstrap'
import { useEffect } from 'react';
import AsyncSelectSearch from '@/Components/Shared/AsyncSelectSearch';

const Create = () => {
    type User = {
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
        users: MultiValue<User[]>,
        active: boolean,
        _method: string
    }

    const { users, pemohonUsers } = usePage<any>().props;
    const { data, setData, errors, post, processing } = useForm<FormValues>({
        nama_pemohon: '',
        email_pemohon: '',
        alamat_pemohon: '',
        nik_pemohon: '',
        users: pemohonUsers,
        telp_pemohon: '',
        nodaftar_pemohon: 0,
        thdaftar_pemohon: 0,
        active: true,
        _method: 'POST'
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route('admin.pemohons.store'));
    }

    const getOptions = async (query: string) => {
        const res = await apputils.backend.get(`/admin/users/api/list/?query=${query}`)
        const data = res.data;
        const options = data.map((d: any) => ({
            value: d['id'],
            label: d['labelOption'],
        }));
        // this.setState({ selectOptions: options });
        // this.getValue(options);
    }

    useEffect(() => {
        getOptions('')
    }, [])

    const onChange = (selectedOptions: OnChangeValue<User[], true>) =>
        setData('users', selectedOptions);


    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/3 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    New Pemohon
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
                                {/* <SelectSearch name='users' options={users} isMulti label='User' onChange={onChange} value={data.users} /> */}
                                <AsyncSelectSearch name='users' url='/admin/users/api/list/' isMulti label='User' onChange={onChange} value={data.users} optionLabels={['name', 'email']} optionValue='id' />
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


export default Create;
