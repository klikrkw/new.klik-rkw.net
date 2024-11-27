import React, { useState } from "react";
import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableRincianbiayaperms from "@/Components/Cards/Admin/CardTableRincianbiayaperms";

const Index = ({
    rincianbiayaperms,
}: PageProps<{
    rincianbiayaperms: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
    base_route: string;
}>) => {
    const { data, meta, links } = rincianbiayaperms;
    return (
        <AdminLayout>
            <CardTableRincianbiayaperms
                color="dark"
                rincianbiayaperms={data}
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default Index;
