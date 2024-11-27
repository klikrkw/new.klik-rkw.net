import { PageProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import CardTableStatusprosesperms from '@/Components/Cards/Admin/CardTableStatusprosesperms';

const Index = ({ statusprosesperms }: PageProps<{ statusprosesperms: { data: [], meta: { links: [], per_page: number, total: number }, links: { first: string, last: string, next: string, prev: string } } }>) => {

    const {
        data,
        meta,
        links
    } = statusprosesperms;
    return (
        <AdminLayout>
            <CardTableStatusprosesperms color="dark" statusprosesperms={data} meta={meta} labelLinks={links} />
        </AdminLayout>
    );
};


export default Index;
