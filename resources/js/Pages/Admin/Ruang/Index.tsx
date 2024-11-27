import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableRuangs from "@/Components/Cards/Admin/CardTableRuangs";

const Index = ({
    ruangs,
}: PageProps<{
    ruangs: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
}>) => {
    const { data, meta, links } = ruangs;

    return (
        <AdminLayout>
            <CardTableRuangs
                color="dark"
                ruangs={data}
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default Index;
