import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import MoneyInput from "@/Components/Shared/MoneyInput";
import { OptionSelect, PageProps } from "@/types";
import SelectSearch from "@/Components/Shared/SelectSearch";
import AsyncSelectSearch from "@/Components/Shared/AsyncSelectSearch";
import StafLayout from "@/Layouts/StafLayout";
import apputils from "@/bootstrap";
type Props = {
    statuskasbonOpts: OptionSelect[];
    jeniskasbonOpts: OptionSelect[];
    instansiOpts: OptionSelect[];
    isAdmin: boolean;
    base_route: string;
};
const Create = ({
    statuskasbonOpts,
    instansiOpts,
    jeniskasbonOpts,
    isAdmin,
    base_route,
}: Props) => {
    type FormValues = {
        jumlah_kasbon: string;
        jumlah_penggunaan: string;
        sisa_penggunaan: string;
        keperluan: string;
        status_kasbon: string;
        statuskabonOpt: OptionSelect | undefined;
        instansiOpt: OptionSelect | undefined;
        user: OptionSelect | undefined;
        instansi_id: string;
        user_id: string | null;
        jenis_kasbon: string;
        jeniskabonOpt: OptionSelect | undefined;
        _method: string;
    };
    const cuser = usePage<PageProps>().props.auth.user;

    // const { statuskasbonOpts } = usePage<{ statuskasbonOpts: OptionSelect[] }>().props;
    const { data, setData, errors, post, processing } = useForm<FormValues>({
        jumlah_kasbon: "0",
        jumlah_penggunaan: "0",
        sisa_penggunaan: "0",
        keperluan: "",
        status_kasbon: statuskasbonOpts[0].value,
        statuskabonOpt: statuskasbonOpts[0] || undefined,
        instansiOpt: instansiOpts[0] || undefined,
        user: cuser
            ? { label: cuser.name, value: cuser.id.toString() }
            : undefined,
        user_id: cuser?.id.toString() || "",
        instansi_id: instansiOpts.length > 0 ? instansiOpts[0].value : "",
        jenis_kasbon: jeniskasbonOpts[0].value,
        jeniskabonOpt: jeniskasbonOpts[0] || undefined,
        _method: "POST",
    });

    const getSisaPenggunaan = (jmlKasbon: number, jmlPenggunaan: number) => {
        let xsisaPenggunaan =
            jmlKasbon > jmlPenggunaan ? jmlKasbon - jmlPenggunaan : 0;
        return xsisaPenggunaan.toString();
    };
    const sendMessageToMobileRole = async (
        title: string,
        body: string,
        datas: { navigationId: string } & object
    ) => {
        let xlink = `/admin/messages/api/sendmessagetomobilerole`;
        const response = await apputils.backend.post(xlink, {
            title,
            role: "admin",
            body,
            datas,
        });
        const data = response.data;
    };

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("transaksi.kasbons.store"), {
            onSuccess: () => {
                sendMessageToMobileRole(
                    "Kasbon Baru Dibuat ",
                    data.jenis_kasbon +
                        " - " +
                        data.instansiOpt?.label +
                        " - " +
                        data.keperluan +
                        " (" +
                        cuser?.name +
                        ")",
                    {
                        navigationId: "kasbon",
                    }
                );
            },
        });
    }

    return (
        <StafLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/4 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-100 border-0">
                        <div className="rounded-t mb-0 px-4 py-2">
                            <div className="text-center mb-2">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    New Kasbon
                                </h6>
                            </div>
                            <hr className="mt-4 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <MoneyInput
                                    name="jumlah_kasbon"
                                    label="Jumlah Kasbon"
                                    disabled
                                    errors={errors.jumlah_kasbon}
                                    autoComplete="off"
                                    value={data.jumlah_kasbon}
                                    onValueChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            jumlah_kasbon: e.value,
                                            sisa_penggunaan: getSisaPenggunaan(
                                                Number.parseInt(e.value),
                                                Number.parseInt(
                                                    data.jumlah_penggunaan
                                                )
                                            ),
                                        }))
                                    }
                                />
                                <MoneyInput
                                    name="jumlah_penggunaan"
                                    label="Jumlah Penggunaan"
                                    errors={errors.jumlah_penggunaan}
                                    autoComplete="off"
                                    disabled
                                    value={data.jumlah_penggunaan}
                                    onValueChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            jumlah_penggunaan: e.value,
                                            sisa_penggunaan: getSisaPenggunaan(
                                                Number.parseInt(
                                                    data.jumlah_kasbon
                                                ),
                                                Number.parseInt(e.value)
                                            ),
                                        }))
                                    }
                                />
                                <MoneyInput
                                    name="sisa_penggunaan"
                                    label="Sisa Penggunaan"
                                    errors={errors.sisa_penggunaan}
                                    autoComplete="off"
                                    disabled
                                    value={data.sisa_penggunaan}
                                    onValueChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            sisa_penggunaan: e.value,
                                        }))
                                    }
                                />
                                <Input
                                    name="keperluan"
                                    label="Keperluan"
                                    errors={errors.keperluan}
                                    value={data.keperluan}
                                    onChange={(e) =>
                                        setData("keperluan", e.target.value)
                                    }
                                />
                                <SelectSearch
                                    name="instansi_id"
                                    label="Instansi"
                                    value={data.instansiOpt}
                                    options={instansiOpts}
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            instansiOpt: e ? e : {},
                                            instansi_id: e ? e.value : "",
                                        })
                                    }
                                    errors={errors.instansi_id}
                                />

                                {isAdmin ? (
                                    <AsyncSelectSearch
                                        placeholder="Pilih User"
                                        label="User"
                                        value={data.user}
                                        name="users"
                                        url="/admin/users/api/list/"
                                        errors={errors.user_id}
                                        onChange={(e: any) =>
                                            setData((v) => ({
                                                ...v,
                                                user: e,
                                                user_id: e ? e.value : "",
                                            }))
                                        }
                                        isClearable
                                        optionLabels={["name"]}
                                        optionValue="id"
                                        className="text-blueGray-900"
                                    />
                                ) : null}
                                <Input
                                    name="status_kasbon"
                                    label="Status Kasbon"
                                    errors={errors.status_kasbon}
                                    value={data.status_kasbon}
                                    disabled
                                />

                                <SelectSearch
                                    name="jenis_kasbon"
                                    label="Jenis Kasbon"
                                    value={data.jeniskabonOpt}
                                    options={jeniskasbonOpts}
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            jeniskabonOpt: e ? e : {},
                                            jenis_kasbon: e ? e.value : "",
                                        })
                                    }
                                    errors={errors.jenis_kasbon}
                                />

                                <div className="flex items-center justify-between mt-2">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            base_route +
                                                "transaksi.kasbons.index"
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
            </div>
        </StafLayout>
    );
};

export default Create;
