import React, { useState } from "react";
import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableRincianbiayaperms from "@/Components/Cards/Staf/CardTableRincianbiayaperms";
import StafLayout from "@/Layouts/StafLayout";

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
        <StafLayout>
            <CardTableRincianbiayaperms
                color="dark"
                rincianbiayaperms={data}
                meta={meta}
                labelLinks={links}
            />
        </StafLayout>
    );
};

export default Index;
