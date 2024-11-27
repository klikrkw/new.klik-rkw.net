import CardFilterProsespermohonan from "@/Components/Cards/Admin/CardFilterProsespermohonan";
import CardListProsespermohonan from "@/Components/Cards/Admin/CardListProsespermohonan";
import AdminLayout from "@/Layouts/AdminLayout";
import StafLayout from "@/Layouts/StafLayout";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";

const Index = () => {
    const { itemprosespermsOpts, prosespermohonans } = usePage<any>().props;
    return (
        <StafLayout>
            {/* <div
                className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-700 rounded-md py-1 bg-white"
            > */}
            {/* <div className="rounded-full mb-0 px-4 py-3 border-0 ">
                    <div className="flex justify-between w-full flex-col md:flex-row">
                        <div className="relative w-full max-w-full flex-grow flex-1 ">
                            <h3
                                className="font-semibold text-lg text-blueGray-700"
                            >
                                Proses Permohonan
                            </h3>
                        </div>
                    </div>
                </div> */}
            {/* </div> */}
            <div className="flex flex-col md:flex-row items-start gap-2">
                <div className="w-full md:w-1/3">
                    <CardFilterProsespermohonan
                        itemprosespermsOpts={itemprosespermsOpts}
                    />
                </div>
                <div className="w-full md:w-2/3">
                    <CardListProsespermohonan
                        prosespermohonans={prosespermohonans}
                    />
                </div>
            </div>
        </StafLayout>
    );
};

export default Index;
