import React from 'react';
import { PageProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import CardTablePostingjurnals from '@/Components/Cards/Admin/CardTablePostingjurnals';

const Index = ({ postingjurnals }: PageProps<{ postingjurnals: { data: [], meta: { links: [], per_page: number, total: number }, links: { first: string, last: string, next: string, prev: string } } }>) => {

    const {
        data,
        meta,
        links
    } = postingjurnals;
    return (
        <AdminLayout>
            <CardTablePostingjurnals color="dark" postingjurnals={data} meta={meta} labelLinks={links} />
        </AdminLayout>
    );
};


export default Index;
