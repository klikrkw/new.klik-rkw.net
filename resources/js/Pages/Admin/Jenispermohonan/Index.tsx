import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableJenispermohonans from "@/Components/Cards/Admin/CardTableJenispermohonans";

const Index = ({
    jenispermohonans,
}: PageProps<{
    jenispermohonans: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
}>) => {
    const { data, meta, links } = jenispermohonans;

    return (
        <AdminLayout>
            <CardTableJenispermohonans
                color="dark"
                jenispermohonans={data}
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default Index;
