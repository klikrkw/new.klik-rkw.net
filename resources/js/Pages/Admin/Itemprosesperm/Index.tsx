import { PageProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import CardTableItemprosesperms from '@/Components/Cards/Admin/CardTableItemprosesperms';

const Index = ({ itemprosesperms }: PageProps<{ itemprosesperms: { data: [], meta: { links: [], per_page: number, total: number }, links: { first: string, last: string, next: string, prev: string } } }>) => {

    const {
        data,
        meta,
        links
    } = itemprosesperms;
    console.log(itemprosesperms)
    return (
        <AdminLayout>
            <CardTableItemprosesperms color="dark" itemprosesperms={data} meta={meta} labelLinks={links} />
        </AdminLayout>
    );
};


export default Index;
