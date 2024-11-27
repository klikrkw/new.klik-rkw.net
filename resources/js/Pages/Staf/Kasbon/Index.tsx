import React from "react";
import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableKasbons from "@/Components/Cards/Staf/CardTableKasbons";
import StafLayout from "@/Layouts/StafLayout";

const Index = ({
    kasbons,
}: PageProps<{
    kasbons: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
}>) => {
    const { data, meta, links } = kasbons;
    return (
        <StafLayout>
            <CardTableKasbons
                color="dark"
                kasbons={data}
                meta={meta}
                labelLinks={links}
            />
        </StafLayout>
    );
};

export default Index;
