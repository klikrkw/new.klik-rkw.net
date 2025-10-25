import { OptionSelectWithData, PageProps, Permohonan, User } from "@/types";
import BlankLayout from "@/Layouts/BlankLayout";
import { useAuth } from "@/Contexts/AuthContext";
import AdminLayout from "@/Layouts/AdminLayout";
import { title } from "process";
import { useEffect, useState } from "react";

const Test = ({ auth, data }: PageProps<{ data: any }>) => {
    const [ldata, setLData] = useState<any>([]);
    useEffect(() => {
        let dt = data;
        if (dt.data) {
            if (dt.data.content) {
                let content: any[] = dt.data.content;
                for (let index = 0; index < content.length; index++) {
                    let element: any = content[index];
                    let nmr = { ...element };
                    let revisi = { ...element };
                    nmr = nmr.nomor;
                    let start1 =
                        nmr.indexOf("<u>") != -1 ? nmr.indexOf("<u>") + 3 : 0;
                    let end1 =
                        nmr.indexOf("</u>") != -1
                            ? nmr.indexOf("</u>") - start1
                            : 13;
                    nmr = nmr.substr(start1, end1);
                    element.nomor = nmr;

                    revisi = revisi.nomor;
                    let start =
                        revisi.indexOf("REVISI : ") != -1
                            ? revisi.indexOf("REVISI : ") + 9
                            : 0;
                    let end =
                        revisi.indexOf("</span>") != -1
                            ? revisi.indexOf("</span>") - start
                            : 13;
                    let xrevisi = revisi.substr(start, end);
                    element.revisi = xrevisi;
                    element.nama_wp = element.nama_wp.replace(/<[^>]*>/g, "");
                    content[index] = element;
                }
                setLData(content);
            }
        }
    }, [data]);

    return (
        <AdminLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <div className="w-full lg:w-4/12 h-auto ">
                <div className="relative w-full xl:w-8/12 mb-12 xl:mb-0">
                    <ul>
                        {ldata &&
                            ldata.map((v: any, i: number) => (
                                <li key={i}>
                                    <div>{v.nomor}</div>
                                    <div>{v.revisi}</div>
                                    <div>{v.nama_wp}</div>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Test;
