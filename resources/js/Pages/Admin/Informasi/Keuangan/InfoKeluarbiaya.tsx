import CardTableInfoKeluarbiayas from "@/Components/Cards/Admin/CardTableInfoKeluarbiayas";
import AdminLayout from "@/Layouts/AdminLayout";
import { Dkeluarbiaya, OptionSelect } from "@/types";
import React from "react";

type Props = {
    dkeluarbiayas: {
        data: Dkeluarbiaya[] | [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
};

const InfoKeluarbiaya = ({ dkeluarbiayas: { data, meta, links } }: Props) => {
    return (
        <AdminLayout>
            <CardTableInfoKeluarbiayas
                dkeluarbiayas={data}
                color="dark"
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default InfoKeluarbiaya;
