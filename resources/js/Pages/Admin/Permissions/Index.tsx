import React from 'react';
import { Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import CardTablePermissions from '@/Components/Cards/CardTablePermissions';

const Index = ({ permissions }: PageProps<{ permissions: { data: [], meta: { links: [], per_page: number, total: number }, links: { first: string, last: string, next: string, prev: string } } }>) => {

    const {
        data,
        meta,
        links
    } = permissions;
    return (
        <AdminLayout>
            <CardTablePermissions color="dark" permissions={data} meta={meta} labelLinks={links} />
        </AdminLayout>
    );
};


export default Index;
