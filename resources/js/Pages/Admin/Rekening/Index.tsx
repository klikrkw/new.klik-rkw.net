import React from "react";
import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableRekenings from "@/Components/Cards/Admin/CardTableRekenings";

const Index = ({
    rekenings,
}: PageProps<{
    rekenings: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
}>) => {
    const { data, meta, links } = rekenings;
    return (
        <AdminLayout>
            <CardTableRekenings
                color="dark"
                rekenings={data}
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default Index;
