import AsyncSelectSearch from '@/Components/Shared/AsyncSelectSearch';
import Input from '@/Components/Shared/Input';
import LinkButton from '@/Components/Shared/LinkButton';
import { LoadingButton } from '@/Components/Shared/LoadingButton';
import SelectSearch from '@/Components/Shared/SelectSearch';
import AdminLayout from '@/Layouts/AdminLayout';
import { Akun, Kelompokakun, OptionSelect } from '@/types';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import Select, { MultiValue, OnChangeValue } from 'react-select'

const Edit = () => {
    type UserOption = {
        label: string,
        value: string,
    }

    type FormValues = {
        nama_akun: string,
        slug: string,
        kelompokakun: OptionSelect | undefined,
        kelompokakun_id: string;
        _method: string
    }

    const { kelompokakuns, akun } = usePage<{ akun: Akun, kelompokakuns: OptionSelect[] }>().props;
    const kelompokakun = kelompokakuns.find((e: OptionSelect) => e.value == akun.kelompokakun_id);

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        nama_akun: akun.nama_akun,
        slug: akun.slug || '',
        kelompokakun: kelompokakun,
        kelompokakun_id: akun.kelompokakun_id,
        _method: 'PUT'
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route('admin.akuns.update', akun.id));
    }

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/3 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Edit Akun
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input name='nama_akun' label='Nama Akun' errors={errors.nama_akun} value={data.nama_akun} onChange={e => setData('nama_akun', e.target.value)} />
                                <SelectSearch name='kelompokakun' options={kelompokakuns}
                                    onChange={(e) => setData((prev) => ({ ...prev, kelompokakun: e ? e : undefined, kelompokakun_id: e ? e.value : '' }))}
                                    label='Kelompok Akun' value={data.kelompokakun} errors={errors.kelompokakun_id} />
                                <div className="flex items-center justify-between">
                                    <LinkButton theme='blueGrey' href={route('admin.akuns.index')}>
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
