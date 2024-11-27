import { Link } from "@inertiajs/react";
import { title } from "process";
import React from "react";
type Props = {
    iconName: string;
    title: string;
    url: string;
};
const DashboardIcon = ({ title, iconName, url }: Props) => {
    return (
        <Link href={route(url)} className="group">
            <div className="w-24 h-16 p-2 rounded-lg bg-white text-sm flex flex-col justify-center items-center shadow-lg border-2 border-white/90 transition-all group-hover:scale-110">
                <i className={`fas ${iconName} text-xl`} />
                <div className="mt-1 text-xs text-blueGray-800 text-center">
                    {title}
                </div>
            </div>
        </Link>
    );
};

export default DashboardIcon;
