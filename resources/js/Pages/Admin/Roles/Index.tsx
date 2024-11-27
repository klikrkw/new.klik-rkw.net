import React from 'react';
import { PageProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import CardTableRoles from '@/Components/Cards/CardTableRoles';

const Index = ({ roles }: PageProps<{ roles: { data: [], meta: { links: [], per_page: number, total: number }, links: { first: string, last: string, next: string, prev: string } } }>) => {

    const {
        data,
        meta,
        links
    } = roles;

    return (
        <AdminLayout>
            <CardTableRoles color="dark" roles={data} meta={meta} labelLinks={links} />

        </AdminLayout>
    );
};


export default Index;
