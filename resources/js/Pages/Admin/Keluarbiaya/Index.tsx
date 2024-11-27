import React from "react";
import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableKeluarbiayapermusers from "@/Components/Cards/Admin/CardTableKeluarbiayapermusers";
import StafLayout from "@/Layouts/StafLayout";
import CardTableKeluarbiayas from "@/Components/Cards/Admin/CardTableKeluarbiayas";

const Index = ({
    keluarbiayas,
}: PageProps<{
    keluarbiayas: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
}>) => {
    const { data, meta, links } = keluarbiayas;
    return (
        <AdminLayout>
            <CardTableKeluarbiayas
                color="dark"
                keluarbiayas={data}
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default Index;
