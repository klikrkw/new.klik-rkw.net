import React from 'react';
import { Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import SearchFilter from '@/Components/Shared/SearchFilter';
import Pagination from '@/Components/Shared/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import CardTableUsers from '@/Components/Cards/CardTableUsers';

const Index = ({ users }: PageProps<{ users: { data: [], meta: { links: [], per_page: number, total: number }, links: { first: string, last: string, next: string, prev: string } } }>) => {

    const {
        data,
        meta,
        links
    } = users;
    const currentValues = {
        nama: 'masbah',
        email: 'oke'
    }

    return (
        <AdminLayout>
            <CardTableUsers color="dark" users={data} meta={meta} labelLinks={links} />
        </AdminLayout>
    );
};


export default Index;
