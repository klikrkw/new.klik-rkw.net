import React from "react";
import { Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTablePengaturans from "@/Components/Cards/CardTablePengaturans";

const Index = ({
    pengaturans,
}: PageProps<{
    pengaturans: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
}>) => {
    const { data, meta, links } = pengaturans;
    const currentValues = {
        nama: "masbah",
        email: "oke",
    };

    return (
        <AdminLayout>
            <CardTablePengaturans
                color="dark"
                pengaturans={data}
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default Index;
