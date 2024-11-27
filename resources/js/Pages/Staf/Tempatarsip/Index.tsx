import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableTempatarsips from "@/Components/Cards/Admin/CardTableTempatarsips";

const Index = ({
    tempatarsips,
}: PageProps<{
    tempatarsips: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
}>) => {
    const { data, meta, links } = tempatarsips;

    return (
        <AdminLayout>
            <CardTableTempatarsips
                color="dark"
                tempatarsips={data}
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default Index;
