import { Head } from "@inertiajs/react";
import { Event, PageProps, RecentActivity, Traffic } from "@/types";
import CardLineChart from "@/Components/Cards/CardLineChart";
import CardBarChart from "@/Components/Cards/CardBarChart";
import CardPageVisits from "@/Components/Cards/CardPageVisits";
import CardSocialTraffic from "@/Components/Cards/CardSocialTraffic";
import StafLayout from "@/Layouts/StafLayout";
import BasicCalendar from "@/Components/Calenders/BasicCalender/BasicCalender";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CardNotifications from "@/Components/Cards/CardNotifications";
import CardStafMenus from "@/Components/Cards/CardStafMenus";

export default function StafDashboard({
    auth,
    traffics,
    recentActivities,
    events,
    baseRoute,
}: PageProps<{
    traffics: Traffic[];
    recentActivities: RecentActivity[];
    events: Event[];
    baseRoute: string;
}>) {
    return (
        <StafLayout
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
                        <CardStafMenus baseRoute={baseRoute} />
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
        </StafLayout>
    );
}
