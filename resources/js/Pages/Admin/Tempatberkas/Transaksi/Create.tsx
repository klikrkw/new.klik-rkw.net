import CardPermohonanEditable from "@/Components/Cards/Admin/CardPermohonanEditable";
import CardTranspermohonanEditable from "@/Components/Cards/Admin/CardTranspermohonanEditable";
import CardTempatberkas from "@/Components/Cards/CardTempatberkas";
import Button from "@/Components/Shared/Button";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import SelectSearch from "@/Components/Shared/SelectSearch";
import TranspermohonanSelect from "@/Components/Shared/TranspermohonanSelect";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    OptionSelect,
    OptionSelectActive,
    Permohonan,
    Posisiberkas,
    Ruang,
    Tempatberkas,
    Transpermohonan,
} from "@/types";
import useSwal from "@/utils/useSwal";
import { router, useForm } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Options } from "react-select";
import { usePrevious } from "react-use";

type Props = {
    baseRoute: string;
    ctranspermohonan: Transpermohonan | null | undefined;
    ctempatberkas: Tempatberkas | null | undefined;
    cposisiberkas: Posisiberkas | null | undefined;
    tempatberkasOpts: OptionSelect[] | [];
    tempatberkasOpt: OptionSelect | null | undefined;
};
const Create = ({
    baseRoute,
    ctranspermohonan,
    ctempatberkas,
    cposisiberkas,
    tempatberkasOpts,
    tempatberkasOpt,
}: Props) => {
    const [transpermohonan, setTranspermohonan] = useState<
        Transpermohonan | undefined | null
    >(ctranspermohonan);
    const [posisiberkas, setPosisiberkas] = useState<
        Posisiberkas | undefined | null
    >(cposisiberkas);
    // const params = new URLSearchParams(window.location.search);
    const [values, setValues] = useState({
        transpermohonan_id: ctranspermohonan ? ctranspermohonan.id : "",
        // tempatberkas_id: ctempatberkas ? ctempatberkas.id : "",
    });
    type FormValues = {
        posisiberkas_id: string;
        transpermohonan_id: string | null;
        _method: string;
    };

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        posisiberkas_id: posisiberkas ? posisiberkas.id : "",
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
                                "transaksi.transpermohonans.posisiberkas.store",
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
    const setPermohonan = (permohonan: Permohonan | undefined) => {
        if (permohonan) {
            setData({
                ...data,
                transpermohonan_id: permohonan.transpermohonan.id,
            });
            setValues((prev) => ({
                ...prev,
                transpermohonan_id: permohonan.transpermohonan.id,
            }));
        } else {
            setValues((prev) => ({
                ...prev,
                transpermohonan_id: "",
            }));
        }
        // router.get(route('admin.prosespermohonans.create', { transpermohonan_id: permohonan.transpermohonan.id }), {}, { preserveState: true, preserveScroll: true })
    };
    const setCTempatberkas = (tempatberkas_id: string) => {
        if (tempatberkas_id) {
            setValues((prev) => ({
                ...prev,
                tempatberkas_id: tempatberkas_id,
            }));
        } else {
            setValues((prev) => ({
                ...prev,
                tempatberkas_id: "",
            }));
        }
        // router.get(route('admin.prosespermohonans.create', { transpermohonan_id: permohonan.transpermohonan.id }), {}, { preserveState: true, preserveScroll: true })
    };

    const setCPosisiberkas = (
        posisiberkas: Posisiberkas | undefined | null
    ) => {
        if (posisiberkas) {
            setData({
                ...data,
                posisiberkas_id: posisiberkas.id,
            });
            setPosisiberkas(posisiberkas);
            // setValues((prev) => ({
            //     ...prev,
            //     tempatberkas_id: tmpberkas.id,
            // }));
        } else {
            setPosisiberkas(null);
        }
        // router.get(route('admin.prosespermohonans.create', { transpermohonan_id: permohonan.transpermohonan.id }), {}, { preserveState: true, preserveScroll: true })
    };

    const prevValues = usePrevious(values);
    const transpermohonanRef = useRef<any>(null);
    // const tempatberkasRef = useRef<any>(null);
    const [ctempatberkasOpt, setCTempatberkasOpt] =
        useState<OptionSelect | null>(
            tempatberkasOpt ? tempatberkasOpt : { value: "", label: "" }
        );

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
            setPosisiberkas(cposisiberkas ? cposisiberkas : null);
            // setCTempatberkasOpt(tempatberkasOpt ? tempatberkasOpt : null);
        }

        //     // if (tempatberkasRef.current) {
        //     //     tempatberkasRef.current.value = ctempatberkas
        //     //         ? ctempatberkas.nama_tempatberkas
        //     //         : "";
        //     // }
    }, [values]);
    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full md:w-[80%] px-4 ">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-4 py-4">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Tempat Berkas
                                </h6>
                            </div>
                            <hr className="mt-4 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <TranspermohonanSelect
                                    inputRef={transpermohonanRef}
                                    isStaf={false}
                                    onValueChange={(transperm, opt) =>
                                        setCtranspermohonan(transperm)
                                    }
                                    value={transpermohonan}
                                    errors={errors.transpermohonan_id}
                                />
                                {transpermohonan &&
                                transpermohonan.permohonan ? (
                                    <CardPermohonanEditable
                                        permohonan={transpermohonan.permohonan}
                                        base_route={baseRoute}
                                        setPermohonan={setPermohonan}
                                    />
                                ) : null}
                                <SelectSearch
                                    name="tempatberkas"
                                    label="Tempat Berkas"
                                    value={ctempatberkasOpt}
                                    options={tempatberkasOpts}
                                    className="w-full mt-4"
                                    onChange={(e) => {
                                        if (e) {
                                            setCTempatberkasOpt(e);
                                            setCTempatberkas(e.value);
                                        }
                                    }}
                                />
                                {ctempatberkas && (
                                    <CardTempatberkas
                                        ctempatberkas={ctempatberkas}
                                        cposisiberkas={posisiberkas}
                                        onSelectPosisiberkas={setCPosisiberkas}
                                    />
                                )}
                                <LoadingButton
                                    disabled={
                                        posisiberkas === null ||
                                        transpermohonan === null
                                    }
                                    className={[
                                        "mt-2",
                                        posisiberkas === null &&
                                        transpermohonan === null
                                            ? "bg-gray-400"
                                            : "",
                                    ].join(" ")}
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
        </AdminLayout>
    );
};

export default Create;
