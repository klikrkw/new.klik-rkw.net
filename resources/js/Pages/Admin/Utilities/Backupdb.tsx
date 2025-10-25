import AdminLayout from "@/Layouts/AdminLayout";

interface Props {
    files: string[];
}
const Backupdb = ({ files }: Props) => {
    console.log(files);

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full md:w-3/4 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Backup Database
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <ul>
                                {files.map((file, index) => (
                                    <li key={index} className="py-2">
                                        <a
                                            href={
                                                "./backupdb" +
                                                file.substring(
                                                    file.lastIndexOf("/")
                                                ) +
                                                "/download"
                                            }
                                            className="text-blueGray-500 hover:text-blueGray-800"
                                        >
                                            {file}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Backupdb;
