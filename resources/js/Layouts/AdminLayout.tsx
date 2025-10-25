import HeaderBlank from "@/Components/Headers/HeaderBlank";
import AdminNavbar from "@/Components/Navbars/AdminNavbar";
import ToastMessages from "@/Components/Shared/ToastMessages";
import Sidebar from "@/Components/Sidebar/Sidebar";
import { PropsWithChildren, ReactNode } from "react";

const AdminLayout = ({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) => {
    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64">
                <AdminNavbar />
                <HeaderBlank />
                <div className="px-4 md:px-10 mx-auto w-full -m-40 relative h-full pb-4">
                    <ToastMessages />
                    {children}
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
