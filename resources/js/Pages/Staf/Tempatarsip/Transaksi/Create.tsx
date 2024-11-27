import CardTranspermohonanEditable from "@/Components/Cards/Admin/CardTranspermohonanEditable";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import TempatarsipSelect from "@/Components/Shared/TempatarsipSelect";
import TranspermohonanSelect from "@/Components/Shared/TranspermohonanSelect";
import AdminLayout from "@/Layouts/AdminLayout";
import StafLayout from "@/Layouts/StafLayout";
import { Tempatarsip, Transpermohonan } from "@/types";
import useSwal from "@/utils/useSwal";
import { router, useForm } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { usePrevious } from "react-use";

type Props = {
    baseRoute: string;
    ctranspermohonan: Transpermohonan | null | undefined;
    ctempatarsip: Tempatarsip | null | undefined;
};
const Create = ({ baseRoute, ctranspermohonan, ctempatarsip }: Props) => {
    const [transpermohonan, setTranspermohonan] = useState<
        Transpermohonan | undefined | null
    >(ctranspermohonan);
    const [tempatarsip, setTempatarsip] = useState<
        Tempatarsip | undefined | null
    >(ctempatarsip);
    // const params = new URLSearchParams(window.location.search);
    const [values, setValues] = useState({
        transpermohonan_id: ctranspermohonan ? ctranspermohonan.id : "",
        // tempatarsip_id: ctempatarsip ? ctempatarsip.id : "",
    });
    type FormValues = {
        tempatarsip_id: string;
        transpermohonan_id: string | null;
        _method: string;
    };

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        tempatarsip_id: tempatarsip ? tempatarsip.id : "",
        transpermohonan_id: transpermohonan ? transpermohonan.id : "",
        _method: "PUT",
    });

    function handleSubmit(e: any) {
        e.preventDefault();
        useSwal
            .confirm({
                title: "Simpan Data",
                text: "apakah akan menyimpan?",
            })
            .then((result) => {
                if (result.isConfirmed) {
                    post(
                        route(
                            baseRoute +
                                "transaksi.transpermohonans.tempatarsips.store",
                            transpermohonan ? transpermohonan.id : ""
                        )
                    );
                }
            });
    }

    const setCtranspermohonan = (
        transperm: Transpermohonan | undefined | null
    ) => {
        if (transperm) {
            setData({
                ...data,
                transpermohonan_id: transperm.id,
            });
            setTranspermohonan(transperm);
            setValues((prev) => ({
                ...prev,
                transpermohonan_id: transperm.id,
            }));
        } else {
            setValues((prev) => ({
                ...prev,
                transpermohonan_id: "",
            }));
        }
        // router.get(route('admin.prosespermohonans.create', { transpermohonan_id: permohonan.transpermohonan.id }), {}, { preserveState: true, preserveScroll: true })
    };
    const setCtempatarsip = (tmparsip: Tempatarsip | undefined | null) => {
        if (tmparsip) {
            setData({
                ...data,
                tempatarsip_id: tmparsip.id,
            });
            setTempatarsip(tmparsip);
            // setValues((prev) => ({
            //     ...prev,
            //     tempatarsip_id: tmparsip.id,
            // }));
        } else {
            setTempatarsip(null);
        }
        // router.get(route('admin.prosespermohonans.create', { transpermohonan_id: permohonan.transpermohonan.id }), {}, { preserveState: true, preserveScroll: true })
    };

    const prevValues = usePrevious(values);
    const transpermohonanRef = useRef<any>(null);
    const tempatarsipRef = useRef<any>(null);

    useEffect(() => {
        if (prevValues) {
            const query = Object.keys(pickBy(values)).length
                ? pickBy(values)
                : {};
            router.get(
                route(route().current() ? route().current() + "" : ""),
                query,
                {
                    replace: true,
                    preserveState: false,
                }
            );
            setTempatarsip(ctempatarsip ? ctempatarsip : null);
        }

        // if (tempatarsipRef.current) {
        //     tempatarsipRef.current.value = ctempatarsip
        //         ? ctempatarsip.nama_tempatarsip
        //         : "";
        // }
    }, [values]);
    return (
        <StafLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full md:w-[80%] px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Tempat Arsip Permohonan
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <TranspermohonanSelect
                                    inputRef={transpermohonanRef}
                                    isStaf={true}
                                    onValueChange={(transperm, opt) =>
                                        setCtranspermohonan(transperm)
                                    }
                                    value={transpermohonan}
                                    errors={errors.transpermohonan_id}
                                />
                                <CardTranspermohonanEditable
                                    base_route={baseRoute}
                                    permohonan={transpermohonan}
                                    setPermohonan={(perm) =>
                                        setTranspermohonan(perm)
                                    }
                                />
                                <TempatarsipSelect
                                    className="mt-2"
                                    inputRef={tempatarsipRef}
                                    isStaf={false}
                                    onValueChange={(tmparsip, opt) => {
                                        setCtempatarsip(tmparsip);
                                    }}
                                    value={tempatarsip}
                                    errors={errors.tempatarsip_id}
                                />
                                {tempatarsip ? (
                                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg rounded-lg bg-blueGray-50 border-0 text-xs mt-2">
                                        <div className="flex-auto px-2 lg:px-4 py-4 pt-0 ">
                                            <div className="relative w-full mt-2 grid grid-cols-2 md:grid-cols-4 gap-1">
                                                <div>Kantor</div>
                                                <div>
                                                    {
                                                        tempatarsip.ruang.kantor
                                                            .nama_kantor
                                                    }
                                                </div>
                                                <div>Ruang</div>
                                                <div>
                                                    {
                                                        tempatarsip.ruang
                                                            .nama_ruang
                                                    }
                                                </div>
                                                <div>Nama Tempat</div>
                                                <div>
                                                    {
                                                        tempatarsip.nama_tempatarsip
                                                    }
                                                </div>
                                                <div>Jenis</div>
                                                <div>
                                                    {
                                                        tempatarsip
                                                            .jenistempatarsip
                                                            .nama_jenistempatarsip
                                                    }
                                                </div>
                                            </div>
                                            <div className="relative w-full mt-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                                                <div className="grid grid-cols-1 row-span-2">
                                                    <div className="flex flex-wrap justify-center p-2">
                                                        {tempatarsip.image_tempatarsip ? (
                                                            <div className="w-full group rounded-lg bg-gray-400 overflow-hidden border-2 cursor-pointer">
                                                                <img
                                                                    src={
                                                                        tempatarsip.image_tempatarsip
                                                                    }
                                                                    alt="..."
                                                                    className="shadow rounded max-w-full h-auto align-middle border-none transition-all group-hover:scale-110 group-hover:bg-gray-600"
                                                                />
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 ">
                                                    <div>baris</div>
                                                    <div>
                                                        {tempatarsip.baris}
                                                    </div>
                                                    <div>Kolom</div>
                                                    <div>
                                                        {tempatarsip.kolom}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                <LoadingButton
                                    disabled={
                                        ctempatarsip?.id ===
                                            data.tempatarsip_id ||
                                        tempatarsip === null
                                    }
                                    className="mt-2"
                                    theme="black"
                                    loading={processing}
                                    type="submit"
                                >
                                    <span>Simpan</span>
                                </LoadingButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </StafLayout>
    );
};

export default Create;
