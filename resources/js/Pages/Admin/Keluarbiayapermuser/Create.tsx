import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import MoneyInput from "@/Components/Shared/MoneyInput";
import { Instansi, OptionSelect } from "@/types";
import SelectSearch from "@/Components/Shared/SelectSearch";
import moment, { now } from "moment";

type Props = {
    instansiOpts: OptionSelect[];
    metodebayarOpts: OptionSelect[];
    kasbonOpts: OptionSelect[];
    base_route: string;
    rekeningOpts: OptionSelect[];
};
const Create = ({
    instansiOpts,
    kasbonOpts,
    metodebayarOpts,
    base_route,
    rekeningOpts,
}: Props) => {
    type FormValues = {
        instansi: Instansi | undefined;
        instansiOpt: OptionSelect | undefined;
        metodebayar: OptionSelect | undefined;
        kasbon: OptionSelect | undefined;
        instansi_id: string;
        metodebayar_id: string;
        kasbon_id: string;
        jumlah_kasbon: string;
        jumlah_penggunaan: string;
        sisa_penggunaan: string;
        rekeningOpt: OptionSelect | undefined;
        rekening_id: string;
        _method: string;
    };

    // const { statuskasbonOpts } = usePage<{ statuskasbonOpts: OptionSelect[] }>().props;
    const { data, setData, errors, post, processing } = useForm<FormValues>({
        instansi: undefined,
        instansiOpt: undefined,
        metodebayar: undefined,
        kasbon: kasbonOpts.length > 0 ? kasbonOpts[0] : undefined,
        instansi_id: "",
        metodebayar_id: "",
        kasbon_id: kasbonOpts.length > 0 ? kasbonOpts[0].value : "",
        jumlah_kasbon: "0",
        jumlah_penggunaan: "0",
        sisa_penggunaan: "0",
        rekeningOpt: undefined,
        rekening_id: "",
        _method: "POST",
    });

    const getSisaPenggunaan = (jmlKasbon: number, jmlPenggunaan: number) => {
        let xsisaPenggunaan =
            jmlKasbon > jmlPenggunaan ? jmlKasbon - jmlPenggunaan : 0;
        return xsisaPenggunaan.toString();
    };

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route(base_route + "transaksi.keluarbiayapermusers.store"));
    }

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center relative -top-2">
                <div className="w-full lg:w-11/12 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-100 border-0">
                        <div className="rounded-t mb-1 px-4 py-2 ">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-lightBlue-800 text-lightBlue-100 px-2 py-2 shadow-md rounded-lg">
                                <div className="text-left">
                                    <h6 className="font-semibold">
                                        PENGELUARAN BIAYA PERMOHONAN
                                    </h6>
                                </div>
                                <div className="text-left md:text-right">
                                    {moment(new Date()).format(
                                        "DD MMM YYYY HH:mm"
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <SelectSearch
                                        className="mb-2"
                                        name="metodebayar_id"
                                        label="Metode Bayar"
                                        value={data.metodebayar}
                                        options={metodebayarOpts}
                                        onChange={(e: any) =>
                                            setData({
                                                ...data,
                                                metodebayar: e ? e : {},
                                                metodebayar_id: e
                                                    ? e.value
                                                    : "",
                                            })
                                        }
                                        errors={errors.metodebayar_id}
                                    />
                                    {data.metodebayar?.value == "1" ? (
                                        <SelectSearch
                                            className="mb-2"
                                            name="kasbon_id"
                                            label="Kasbon"
                                            value={data.kasbon}
                                            options={kasbonOpts}
                                            onChange={(e: any) => {
                                                setData({
                                                    ...data,
                                                    kasbon: e ? e : {},
                                                    kasbon_id: e ? e.value : "",
                                                    instansi: e
                                                        ? e.instansi
                                                        : {},
                                                    instansi_id: e
                                                        ? e.instansi.id
                                                        : "",
                                                });
                                            }}
                                            errors={errors.kasbon_id}
                                        />
                                    ) : (
                                        <div className="flex flex-col">
                                            <div className="mb-2 font-bold text-xs">
                                                KASBON
                                            </div>
                                            <div className="px-2 py-2 rounded text-sm bg-blueGray-200 text-blueGray-600">
                                                <span>No Kasbon</span>
                                            </div>
                                        </div>
                                    )}
                                    <SelectSearch
                                        name="rekening_id"
                                        label="Rekening"
                                        className="mb-2"
                                        value={data.rekeningOpt}
                                        options={rekeningOpts}
                                        onChange={(e: any) =>
                                            setData({
                                                ...data,
                                                rekeningOpt: e ? e : {},
                                                rekening_id: e ? e.value : "",
                                            })
                                        }
                                        errors={errors.rekening_id}
                                    />

                                    {data.instansi &&
                                    data.metodebayar?.value == "1" ? (
                                        <Input
                                            name="instansi"
                                            value={data.instansi.nama_instansi}
                                            label="Instansi"
                                            disabled
                                            errors={errors.instansi_id}
                                        />
                                    ) : (
                                        <SelectSearch
                                            className="mb-2"
                                            name="instansi_id"
                                            label="Instansi"
                                            value={data.instansiOpt}
                                            options={instansiOpts}
                                            onChange={(e: any) =>
                                                setData({
                                                    ...data,
                                                    instansiOpt: e ? e : {},
                                                    instansi_id: e
                                                        ? e.value
                                                        : "",
                                                })
                                            }
                                            errors={errors.instansi_id}
                                        />
                                    )}

                                    {/* <MoneyInput name='jumlah_kasbon' label='Jumlah Kasbon' errors={errors.jumlah_kasbon}
                                        autoComplete='off'
                                        value={data.jumlah_kasbon}
                                        onValueChange={e => setData(prev => ({
                                            ...prev, 'jumlah_kasbon': e.value,
                                            'sisa_penggunaan': getSisaPenggunaan(Number.parseInt(e.value), Number.parseInt(data.jumlah_penggunaan))
                                        }))} /> */}
                                </div>

                                <div className="flex items-center justify-between">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            base_route +
                                                "transaksi.keluarbiayapermusers.index"
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
        </AdminLayout>
    );
};

export default Create;
