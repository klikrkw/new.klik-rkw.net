import ModalAddPermohonan from "@/Components/Modals/ModalAddPermohonan";
import DateInput from "@/Components/Shared/DateInput";
import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import PermohonanSelect from "@/Components/Shared/PermohonanSelect";
import SelectSearch from "@/Components/Shared/SelectSearch";
import TranspermohonanSelect from "@/Components/Shared/TranspermohonanSelect";
import AdminLayout from "@/Layouts/AdminLayout";
import { Event, OptionSelect, Permohonan, Transpermohonan } from "@/types";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import moment from "moment";
import { useRef, useState } from "react";

const Edit = () => {
    type FormValues = {
        id: string;
        start: string;
        end: string;
        title: string;
        data: string;
        kategorievent_id: string;
        kategorievent: OptionSelect | null;
        transpermohonan_id: string;
        transpermohonan: Transpermohonan | undefined;
        permohonan: Permohonan | undefined;
        _method: string;
    };

    const {
        base_route,
        event,
        kategorieventOpt,
        kategorieventOpts,
        transpermohonanOpt,
        transpermohonan_id,
        transpermohonan,
        // permohonan_id,
        permohonan,
    } = usePage<{
        base_route: string;
        event: Event;
        kategorieventOpt: OptionSelect;
        kategorieventOpts: OptionSelect[];
        transpermohonanOpts: OptionSelect[];
        transpermohonanOpt: OptionSelect;
        transpermohonan_id: string;
        transpermohonan: Transpermohonan;
    }>().props;

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        id: event.id,
        kategorievent_id: event.kategorievent.id,
        start: moment(event.start).format("YYYY-MM-DD hh:mm:ss"),
        end: moment(event.end).format("YYYY-MM-DD hh:mm:ss"),
        kategorievent: kategorieventOpt,
        // start: moment(event.start).toISOString(),
        // end: moment(event.end).toISOString(),
        transpermohonan_id: transpermohonan_id,
        transpermohonan: transpermohonan ?? undefined,
        title: event.title ?? "",
        data: event.data ?? "",
        permohonan: transpermohonan?.permohonan ?? undefined,
        _method: "PUT",
    });

    // const onChange = (selectedOptions: OnChangeValue<Permission[], true>) =>
    //     setData('permissions', selectedOptions);

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route(base_route + "transaksi.events.update", event.id));
    }

    // function restore() {
    //     if (confirm('Are you sure you want to restore this user?')) {
    //         router.put(route('users.restore', user.id));
    //     }
    // }

    // const setPermohonan = (transpermohonan: Transpermohonan | null) => {
    //     if (transpermohonan) {
    //         setData({
    //             ...data,
    //             transpermohonan_id: transpermohonan.id,
    //             transpermohonan: transpermohonan,
    //         });
    //     }
    // };
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
    const transpermSelectRef = useRef<any>(null);

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full md:w-3/4 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Update Event
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <div className="w-full flex flex-col md:flex-row gap-2">
                                    <DateInput
                                        label="Start"
                                        showTimeSelect
                                        className="z-3"
                                        selected={data.start}
                                        value={data.start}
                                        name="start"
                                        errors={errors.start}
                                        customDateFormat="DD-MMM-YYYY HH:mm"
                                        onChange={(e) =>
                                            setData(
                                                "start",
                                                moment(e).format(
                                                    "YYYY-MM-DD HH:mm:ss"
                                                )
                                            )
                                        }
                                    />
                                    <DateInput
                                        label="End"
                                        showTimeSelect
                                        className="z-3"
                                        selected={data.end}
                                        value={data.end}
                                        name="end"
                                        errors={errors.end}
                                        customDateFormat="DD-MMM-YYYY HH:mm"
                                        onChange={(e) =>
                                            setData(
                                                "end",
                                                moment(e).format(
                                                    "YYYY-MM-DD HH:mm:ss"
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
                                    className="mb-3 z-2"
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
                                {event.is_transpermohonan ? (
                                    <div className="flex flex-col justify-between items-start">
                                        <div className="w-full flex flex-row justify-between">
                                            <TranspermohonanSelect
                                                inputRef={transpermSelectRef}
                                                value={data.transpermohonan}
                                                className="mb-1 w-full mr-2"
                                                zIndex="z-0"
                                                errors={
                                                    errors.transpermohonan_id
                                                }
                                                onValueChange={(e) => {
                                                    setPermohonan(
                                                        e?.permohonan
                                                    );
                                                }}
                                            />

                                            <a
                                                tabIndex={-1}
                                                href="#"
                                                className="w-8 h-8 px-2 py-1 rounded-full bg-blue-600/20 shadow-xl mb-1"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setShowModalAddPermohonan(
                                                        true
                                                    );
                                                }}
                                            >
                                                <i className="fas fa-add text-md text-center text-gray-700"></i>
                                            </a>
                                        </div>
                                        <div className="w-full p-2 grid grid-2">
                                            <div>Identitas</div>
                                            <div>
                                                {`${data.transpermohonan?.permohonan.transpermohonan.jenispermohonan.nama_jenispermohonan}, ${data.transpermohonan?.permohonan.nomor_hak}, Ds.${data.transpermohonan?.permohonan.letak_obyek}`}
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                <div className="flex items-center justify-between">
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
        </AdminLayout>
    );
};

export default Edit;
