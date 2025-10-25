import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTablePermohonans from "@/Components/Cards/Admin/CardTablePermohonans";

const Index = ({
    jenishaks,
    permohonans,
}: PageProps<{
    jenishaks: [];
    permohonans: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
}>) => {
    const { data, meta, links } = permohonans;
    const currentValues = {
        nama: "masbah",
        email: "oke",
    };

    return (
        <AdminLayout>
            <CardTablePermohonans
                color="dark"
                jenishaks={jenishaks}
                permohonans={data}
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default Index;
