import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableTempatarsips from "@/Components/Cards/Admin/CardTableTempatarsips";
import CardTableTempatberkas from "@/Components/Cards/Admin/CardTableTempatberkas";

const Index = ({
    tempatberkas,
}: PageProps<{
    tempatberkas: {
        data: [];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
    };
}>) => {
    const { data, meta, links } = tempatberkas;

    return (
        <AdminLayout>
            <CardTableTempatberkas
                color="dark"
                tempatberkas={data}
                meta={meta}
                labelLinks={links}
            />
        </AdminLayout>
    );
};

export default Index;
