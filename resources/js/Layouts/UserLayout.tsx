import HeaderBlank from "@/Components/Headers/HeaderBlank";
import AdminNavbar from "@/Components/Navbars/AdminNavbar";
import ToastMessages from "@/Components/Shared/ToastMessages";
import UserSidebar from "@/Components/Sidebar/UserSidebar";
import { PropsWithChildren, ReactNode } from "react";

const UserLayout = ({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) => {
    return (
        <>
            <UserSidebar />
            <div className="relative md:ml-64 bg-blueGray-100">
                <AdminNavbar />
                <HeaderBlank />
                <div className="px-4 md:px-10 mx-auto w-full -m-40 relative h-full">
                    <ToastMessages />
                    {children}
                </div>
            </div>
        </>
    );
};

export default UserLayout;
