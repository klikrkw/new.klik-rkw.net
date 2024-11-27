import React from 'react';
import { PageProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import CardTableItemkegiatans from '@/Components/Cards/Admin/CardTableItemkegiatans';

const Index = ({ itemkegiatans }: PageProps<{ itemkegiatans: { data: [], meta: { links: [], per_page: number, total: number }, links: { first: string, last: string, next: string, prev: string } } }>) => {

    const {
        data,
        meta,
        links
    } = itemkegiatans;
    return (
        <AdminLayout>
            <CardTableItemkegiatans color="dark" itemkegiatans={data} meta={meta} labelLinks={links} />
        </AdminLayout>
    );
};


export default Index;
