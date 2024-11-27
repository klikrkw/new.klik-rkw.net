import CardTableInfoKeluarbiayapermusers from "@/Components/Cards/Admin/CardTableInfoKeluarbiayapermusers";
import AdminLayout from "@/Layouts/AdminLayout";
import { Dkeluarbiayapermuser } from "@/types";
import React from "react";

type Props = {
    dkeluarbiayapermusers: {
        data: Dkeluarbiayapermuser[] | [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
};

const InfoKeluarbiayapermuser = ({
    dkeluarbiayapermusers: { data, meta, links },
}: Props) => {
    return (
        <AdminLayout>
            <CardTableInfoKeluarbiayapermusers
                dkeluarbiayapermusers={data}
                color="dark"
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default InfoKeluarbiayapermuser;
