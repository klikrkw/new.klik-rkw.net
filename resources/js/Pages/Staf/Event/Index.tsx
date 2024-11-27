import { Event, PageProps } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardTableEvents from "@/Components/Cards/Admin/CardTableEvents";
import StafLayout from "@/Layouts/StafLayout";

const Index = ({
    events,
}: PageProps<{
    events: {
        data: Event[];
        meta: { links: []; per_page: number; total: number };
        links: { first: string; last: string; next: string; prev: string };
        base_route: string;
    };
}>) => {
    const { data, meta, links, base_route } = events;

    return (
        <StafLayout>
            <CardTableEvents
                color="dark"
                events={data}
                meta={meta}
                labelLinks={links}
            />
        </StafLayout>
    );
};

export default Index;
