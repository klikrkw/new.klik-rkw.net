import React from "react";
import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableKeluarbiayapermusers from "@/Components/Cards/Admin/CardTableKeluarbiayapermusers";
import StafLayout from "@/Layouts/StafLayout";

const Index = ({
    keluarbiayapermusers,
}: PageProps<{
    keluarbiayapermusers: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
}>) => {
    const { data, meta, links } = keluarbiayapermusers;
    return (
        <StafLayout>
            <CardTableKeluarbiayapermusers
                color="dark"
                keluarbiayapermusers={data}
                meta={meta}
                labelLinks={links}
            />
        </StafLayout>
    );
};

export default Index;
