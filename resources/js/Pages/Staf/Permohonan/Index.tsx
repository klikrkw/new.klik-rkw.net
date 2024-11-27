import { PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTablePermohonans from "@/Components/Cards/Staf/CardTablePermohonans";
import StafLayout from "@/Layouts/StafLayout";

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
        <StafLayout>
            <CardTablePermohonans
                color="dark"
                jenishaks={jenishaks}
                permohonans={data}
                meta={meta}
                labelLinks={links}
            />
        </StafLayout>
    );
};

export default Index;
