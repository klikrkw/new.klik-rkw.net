import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableItemprosesperms from "@/Components/Cards/Admin/CardTableItemprosesperms";
import CardTableItemrincianbiayaperms from "@/Components/Cards/Admin/CardTableItemrincianbiayaperms";

const Index = ({
    itemrincianbiayaperms,
}: PageProps<{
    itemrincianbiayaperms: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
}>) => {
    const { data, meta, links } = itemrincianbiayaperms;
    return (
        <AdminLayout>
            <CardTableItemrincianbiayaperms
                color="dark"
                itemrincianbiayaperms={data}
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default Index;
