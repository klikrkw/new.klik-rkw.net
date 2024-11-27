import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableKantors from "@/Components/Cards/Admin/CardTableKantors";

const Index = ({
    kantors,
}: PageProps<{
    kantors: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
}>) => {
    const { data, meta, links } = kantors;

    return (
        <AdminLayout>
            <CardTableKantors
                color="dark"
                kantors={data}
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default Index;
