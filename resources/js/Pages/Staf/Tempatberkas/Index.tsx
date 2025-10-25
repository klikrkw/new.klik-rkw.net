import { PageProps } from "@/types";
import CardTableTempatberkas from "@/Components/Cards/Admin/CardTableTempatberkas";
import StafLayout from "@/Layouts/StafLayout";

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
        <StafLayout>
            <CardTableTempatberkas
                color="dark"
                tempatberkas={data}
                meta={meta}
                labelLinks={links}
            />
        </StafLayout>
    );
};

export default Index;
