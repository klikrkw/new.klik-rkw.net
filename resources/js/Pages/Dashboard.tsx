import { Head, usePage } from "@inertiajs/react";
import { Event, PageProps, RecentActivity, Traffic } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import CardPageVisits from "@/Components/Cards/CardPageVisits";
import CardSocialTraffic from "@/Components/Cards/CardSocialTraffic";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CardNotifications from "@/Components/Cards/CardNotifications";
import CardMenus from "@/Components/Cards/CardMenus";
import BasicCalendar from "@/Components/Calenders/BasicCalender/BasicCalender";

export default function Dashboard({
    auth,
    traffics,
    baseRoute,
    recentActivities,
    events,
}: PageProps<{
    traffics: Traffic[];
    recentActivities: RecentActivity[];
    baseRoute: string;
    events: Event[];
}>) {
    return (
        <AdminLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <>
                <div className="flex flex-wrap">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-6 ">
                        <CardMenus baseRoute={baseRoute} />
                        {/* <BasicCalendar events={events} /> */}
                        {/* <CardLineChart /> */}
                    </div>
                    <div className="w-full xl:w-4/12 px-4">
                        <CardNotifications user={auth.user} />
                    </div>
                    {/* <div className="w-full xl:w-4/12 px-4">
                        <CardNotifications />
                    </div> */}
                </div>
                <div className="flex flex-wrap mt-4">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                        <BasicCalendar events={events} />
                    </div>
                    <div className="w-full xl:w-4/12 px-4">
                        <CardSocialTraffic traffics={traffics} />
                        <CardPageVisits recentActivities={recentActivities} />
                    </div>
                </div>
            </>
        </AdminLayout>
    );
}
