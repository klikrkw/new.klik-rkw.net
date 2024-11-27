import React, { useState } from "react";
import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableKasbons from "@/Components/Cards/Admin/CardTableKasbons";

const Index = ({
    kasbons,
    base_route,
}: PageProps<{
    kasbons: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
    base_route: string;
}>) => {
    const { data, meta, links } = kasbons;
    return (
        <AdminLayout>
            <CardTableKasbons
                color="dark"
                kasbons={data}
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default Index;
