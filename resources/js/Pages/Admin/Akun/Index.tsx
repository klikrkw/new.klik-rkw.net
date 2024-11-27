import React from 'react';
import { Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import SearchFilter from '@/Components/Shared/SearchFilter';
import Pagination from '@/Components/Shared/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import CardTablePemohons from '@/Components/Cards/Admin/CardTablePemohons';
import CardTableAkuns from '@/Components/Cards/Admin/CardTableAkuns';

const Index = ({ akuns }: PageProps<{ akuns: { data: [], meta: { links: [], per_page: number, total: number }, links: { first: string, last: string, next: string, prev: string } } }>) => {

    const {
        data,
        meta,
        links
    } = akuns;
    const currentValues = {
        nama: 'masbah',
        email: 'oke'
    }

    return (
        <AdminLayout>
            <CardTableAkuns color="dark" akuns={data} meta={meta} labelLinks={links} />
        </AdminLayout>
    );
};


export default Index;
