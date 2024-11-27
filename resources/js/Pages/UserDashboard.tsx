import { Head } from '@inertiajs/react';
import { PageProps, RecentActivity, Traffic } from '@/types';
import CardLineChart from '@/Components/Cards/CardLineChart';
import CardBarChart from '@/Components/Cards/CardBarChart';
import CardPageVisits from '@/Components/Cards/CardPageVisits';
import CardSocialTraffic from '@/Components/Cards/CardSocialTraffic';
import StafLayout from '@/Layouts/StafLayout';
import UserLayout from '@/Layouts/UserLayout';

export default function StafDashboard({ auth, traffics, recentActivities }: PageProps<{ traffics: Traffic[], recentActivities: RecentActivity[] }>) {
    return (
        <UserLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <>
                <div className="flex flex-wrap">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                        <CardLineChart />
                    </div>
                    <div className="w-full xl:w-4/12 px-4">
                        <CardSocialTraffic traffics={traffics} />
                    </div>

                    {/* <div className="w-full xl:w-4/12 px-4">
                        <CardBarChart />
                    </div> */}
                </div>
                <div className="flex flex-wrap mt-4">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                        <CardPageVisits recentActivities={recentActivities} />
                    </div>
                    {/* <div className="w-full xl:w-4/12 px-4">
                        <CardSocialTraffic traffics={traffics} />
                    </div> */}
                </div>
            </>
        </UserLayout>
    );
}
