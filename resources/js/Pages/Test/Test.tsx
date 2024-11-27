import { OptionSelectWithData, PageProps, Permohonan, User } from '@/types'
import BlankLayout from '@/Layouts/BlankLayout'
import { useAuth } from '@/Contexts/AuthContext';
import AdminLayout from '@/Layouts/AdminLayout';
import { title } from 'process';

const Test = ({ auth }: PageProps<{ options: [] }>) => {

    const options: OptionSelectWithData<any>[] = [
        { label: 'Arsa', value: '1', data: { alamat: "kertomulyo", telp: "0924" } },
        { label: 'Dafa', value: '2', data: { alamat: "trangkil", telp: "0923" } },
        { label: 'Ari', value: '4', data: { alamat: "penambuhan", telp: "0928" } },
        { label: 'Bahtiar', value: '5', data: { alamat: "kertomulyo", telp: "0925" } },
    ]

    // async function getData(url = '', query = '') {
    //     const data = await apputils.backend.get(`${url}?search=${query}`)
    //     return data.data
    // }

    // const fetcher = async (url: string, query: string) => {
    //     return await apputils.backend.get(`${url}?search=${query}`).then((res: any) => res.data);
    // }
    // const { data: filteredOption, error } = useSWR(['/admin/permohonans/api/list/', ''], ([url, search]) => fetcher(url, search))

    // const isLoading = !error && !filteredOption;
    const { sendMessage } = useAuth();


    return (
        <AdminLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <div className="w-full lg:w-4/12 h-auto ">
                <div className="relative w-full xl:w-8/12 mb-12 xl:mb-0">
                    <button onClick={(e) => {
                        sendMessage({ title: 'judul', body: 'hallo semua' })
                    }}>send message</button>
                </div>
            </div>
        </AdminLayout>

    )
}

export default Test
