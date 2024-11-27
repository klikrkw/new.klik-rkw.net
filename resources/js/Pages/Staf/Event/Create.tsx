import ModalAddPermohonan from "@/Components/Modals/ModalAddPermohonan";
import DateInput from "@/Components/Shared/DateInput";
import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import PermohonanSelect from "@/Components/Shared/PermohonanSelect";
import SelectSearch from "@/Components/Shared/SelectSearch";
import AdminLayout from "@/Layouts/AdminLayout";
import StafLayout from "@/Layouts/StafLayout";
import { OptionSelect, Permohonan } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import moment from "moment";
import { useState } from "react";
import Select, { MultiValue, OnChangeValue } from "react-select";

const Create = () => {
    const {
        base_route,
        kategorieventOpts,
        transpermohonanOpts,
        transpermohonanOpt,
        transpermohonan_id,
        permohonan_id,
        permohonan,
    } = usePage<{
        base_route: string;
        kategorieventOpts: OptionSelect[];
        transpermohonanOpts: OptionSelect[];
        transpermohonanOpt: OptionSelect;
        transpermohonan_id: string;
        permohonan_id: string;
        permohonan: Permohonan;
    }>().props;

    type FormValues = {
        start: string;
        end: string;
        title: string;
        data: string;
        kategorievent_id: string;
        kategorievent: string;
        transpermohonan_id: string;
        permohonan: Permohonan | undefined;
        _method: string;
    };

    // const { permissions } = usePage<any>().props;
    const { data, setData, errors, post, processing } = useForm<FormValues>({
        start: moment().format("YYYY-MM-DD HH:mm"),
        end: moment().format("YYYY-MM-DD HH:mm"),
        title: "",
        data: "",
        kategorievent: "",
        kategorievent_id: "",
        transpermohonan_id: transpermohonan_id,
        permohonan: permohonan,
        _method: "POST",
    });
    function handleSubmit(e: any) {
        e.preventDefault();
        post(route(base_route + "transaksi.events.store"));
    }

    // function restore() {
    //     if (confirm('Are you sure you want to restore this user?')) {
    //         router.put(route('users.restore', user.id));
    //     }
    // }

    // const onChange = (selectedOptions: OnChangeValue<Permission[], true>) =>
    //     setData('permissions', selectedOptions);
    const setPermohonan = (permohonan: Permohonan | undefined) => {
        if (permohonan) {
            setData({
                ...data,
                transpermohonan_id: permohonan.transpermohonan.id,
                permohonan: permohonan,
            });
        }
    };
    const [showModalAddPermohonan, setShowModalAddPermohonan] =
        useState<boolean>(false);

    return (
        <StafLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-1/2 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Event Baru
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <div className="w-full flex flex-row gap-2">
                                    <DateInput
                                        label="Start"
                                        showTimeSelect
                                        selected={data.start}
                                        value={data.start}
                                        name="start"
                                        errors={errors.start}
                                        customDateFormat="DD-MMM-YYYY HH:mm"
                                        onChange={(e) =>
                                            setData(
                                                "start",
                                                moment(e).format(
                                                    "YYYY-MM-DD HH:mm"
                                                )
                                            )
                                        }
                                    />
                                    <DateInput
                                        label="End"
                                        showTimeSelect
                                        selected={data.end}
                                        value={data.end}
                                        name="end"
                                        errors={errors.end}
                                        customDateFormat="DD-MMM-YYYY HH:mm"
                                        onChange={(e) =>
                                            setData(
                                                "end",
                                                moment(e).format(
                                                    "YYYY-MM-DD HH:mm"
                                                )
                                            )
                                        }
                                    />
                                </div>
                                <Input
                                    name="title"
                                    label="Title"
                                    errors={errors.title}
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />
                                <Input
                                    name="data"
                                    label="Data"
                                    errors={errors.data}
                                    value={data.data}
                                    onChange={(e) =>
                                        setData("data", e.target.value)
                                    }
                                />
                                <SelectSearch
                                    label="Kategori"
                                    placeholder="Pilih Kategori"
                                    name="kategorievent_id"
                                    className="mb-3 z-[51]"
                                    value={data.kategorievent}
                                    options={kategorieventOpts}
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            kategorievent: e ? e : {},
                                            kategorievent_id: e ? e.value : "",
                                        })
                                    }
                                    errors={errors.kategorievent_id}
                                />
                                <div className="flex flex-row justify-between items-center">
                                    <PermohonanSelect
                                        value={data.permohonan}
                                        className="mb-1 w-full mr-2"
                                        errors={errors.transpermohonan_id}
                                        onValueChange={(e) => {
                                            setPermohonan(e);
                                        }}
                                    />

                                    <a
                                        tabIndex={-1}
                                        href="#"
                                        className="w-8 h-8 px-2 py-1 rounded-full bg-blue-600/20 shadow-xl mb-1"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowModalAddPermohonan(true);
                                        }}
                                    >
                                        <i className="fas fa-add text-md text-center text-gray-700"></i>
                                    </a>
                                </div>
                                <div className="flex items-center justify-between ">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            base_route +
                                                "transaksi.events.index"
                                        )}
                                    >
                                        <span>Kembali</span>
                                    </LinkButton>
                                    <LoadingButton
                                        theme="black"
                                        loading={processing}
                                        type="submit"
                                    >
                                        <span>Simpan</span>
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <ModalAddPermohonan
                    showModal={showModalAddPermohonan}
                    setShowModal={setShowModalAddPermohonan}
                    setPermohonan={setPermohonan}
                    src={route(base_route + "permohonans.modal.create")}
                />
            </div>
        </StafLayout>
    );
};

export default Create;
