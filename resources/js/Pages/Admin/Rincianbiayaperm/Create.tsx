import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import MoneyInput from "@/Components/Shared/MoneyInput";
import {
    Instansi,
    Itemrincianbiayaperm,
    OptionSelect,
    Permohonan,
    Transpermohonan,
    User,
} from "@/types";
import SelectSearch from "@/Components/Shared/SelectSearch";
import AsyncSelectSearch from "@/Components/Shared/AsyncSelectSearch";
import moment, { now } from "moment";
import StafLayout from "@/Layouts/StafLayout";
import PermohonanSelect from "@/Components/Shared/PermohonanSelect";
import { useEffect, useRef, useState } from "react";
import CardPermohonanEditable from "@/Components/Cards/Admin/CardPermohonanEditable";
import ModalAddPermohonan from "@/Components/Modals/ModalAddPermohonan";
import { usePrevious } from "react-use";
import { pickBy } from "lodash";
import TranspermohonanSelect from "@/Components/Shared/TranspermohonanSelect";
import apputils from "@/bootstrap";

type Props = {
    transpermohonan_id: string;
    permohonan_id: string;
    transpermohonanOpts: OptionSelect[];
    transpermohonanOpt: OptionSelect;
    metodebayarOpts: OptionSelect[];
    rekeningOpts: OptionSelect[];
    permohonan: Permohonan;
    base_route: string;
    isAdmin: boolean;
    allPermohonan: boolean;
    userOpts: User[];
    userId: string;
};
const Create = ({
    permohonan_id,
    transpermohonan_id,
    permohonan,
    transpermohonanOpts,
    transpermohonanOpt,
    metodebayarOpts,
    rekeningOpts,
    base_route,
    isAdmin,
    allPermohonan,
    userOpts,
    userId,
}: Props) => {
    type FormValues = {
        itemrincianbiayapermOpt: OptionSelect | undefined;
        itemrincianbiayaperm_id: "";
        jenisitemrincianbiayaOpt: OptionSelect | undefined;
        jenis_itemrincianbiaya: string;
        permohonan: Permohonan | undefined;
        transpermohonan_id: string;
        total_pemasukan: string;
        total_pengeluaran: string;
        sisa_saldo: string;
        ket_rincianbiayaperm: string;
        user: OptionSelect | undefined;
        user_id: string;
        metodebayarOpt: OptionSelect | undefined;
        metodebayar_id: string;
        rekeningOpt: OptionSelect | undefined;
        rekening_id: string;
        _method: string;
    };

    // const { statuskasbonOpts } = usePage<{ statuskasbonOpts: OptionSelect[] }>().props;
    const { data, setData, errors, post, processing } = useForm<FormValues>({
        itemrincianbiayapermOpt: undefined,
        itemrincianbiayaperm_id: "",
        permohonan: permohonan,
        jenisitemrincianbiayaOpt: undefined,
        jenis_itemrincianbiaya: "",
        transpermohonan_id: transpermohonan_id,
        total_pemasukan: "0",
        total_pengeluaran: "0",
        sisa_saldo: "0",
        ket_rincianbiayaperm: "",
        user: undefined,
        metodebayarOpt: undefined,
        metodebayar_id: "",
        rekeningOpt: undefined,
        rekening_id: "",
        user_id: "",
        _method: "POST",
    });
    const firstInput = useRef<any>();

    const getSisaPenggunaan = (jmlKasbon: number, jmlPenggunaan: number) => {
        let xsisaPenggunaan =
            jmlKasbon > jmlPenggunaan ? jmlKasbon - jmlPenggunaan : 0;
        return xsisaPenggunaan.toString();
    };
    const [showModalAddPermohonan, setShowModalAddPermohonan] =
        useState<boolean>(false);

    const sendMessageToMobileRole = async (
        title: string,
        body: string,
        datas: {
            navigationId: string;
            param1_name: string;
            param1_value: string;
        } & object
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
        post(route(base_route + "transaksi.rincianbiayaperms.store"), {
            onSuccess: () => {
                const pmh: string = data.permohonan
                    ? data.ket_rincianbiayaperm +
                      ", " +
                      data.permohonan.transpermohonan.jenispermohonan
                          .nama_jenispermohonan +
                      ", " +
                      data.permohonan?.nama_penerima +
                      ", " +
                      data.permohonan?.nomor_hak +
                      "/" +
                      data.permohonan?.letak_obyek +
                      " " +
                      "(" +
                      data.permohonan.users.map((u: any) => u.name).join(", ") +
                      ")"
                    : data.ket_rincianbiayaperm;
                sendMessageToMobileRole("Rincian Baru", pmh, {
                    navigationId: "BiayaPerm",
                    param1_name: "transpermohonanId",
                    param1_value: data.transpermohonan_id,
                });
            },
        });
    }

    const setPermohonan = (permohonan: Permohonan | undefined | null) => {
        firstInput.current.value = permohonan?.nama_penerima;
        if (permohonan) {
            setData({
                ...data,
                transpermohonan_id: permohonan.transpermohonan.id,
                permohonan: permohonan,
            });
            setValues((prev) => ({
                ...prev,
                transpermohonan_id: permohonan.transpermohonan.id,
                permohonan_id: permohonan ? permohonan.id : "",
            }));
        }

        // setValues((prev) => ({
        //     ...prev,
        //     transpermohonan_id: perm ? perm.transpermohonan.id : "",
        //     permohonan_id: perm ? perm.id : "",
        // }));
        // // setData({
        //     ...data,
        //     permohonan: perm,
        //     transpermohonan_id: perm?.transpermohonan
        //         ? perm.transpermohonan.id
        //         : "",
        // });
    };
    const [values, setValues] = useState({
        permohonan_id: permohonan_id,
        transpermohonan_id: transpermohonan_id,
    });

    const xuser = userOpts.find((usr: any) => usr.value == userId);
    const [cuser, setCuser] = useState(xuser);

    const prevValues = usePrevious(values);
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
                    preserveState: true,
                }
            );
        }
    }, [values]);
    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center relative -top-2">
                <div className="w-full lg:w-11/12 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-100 border-0">
                        <div className="rounded-t mb-1 px-4 py-2 ">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-lightBlue-800 text-lightBlue-100 px-2 py-2 shadow-md rounded-lg">
                                <div className="text-left">
                                    <h6 className="font-semibold">
                                        RINCIAN BIAYA PERMOHONAN BARU
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
                                {/* <SelectSearch
                                        name="jenis_itemrincianbiaya"
                                        label="Metode Bayar"
                                        value={data.jenisitemrincianbiayaOpt}
                                        options={jenisitemrincianbiayaOpts}
                                        onChange={(e: any) =>
                                            setData({
                                                ...data,
                                                jenisitemrincianbiayaOpt: e
                                                    ? e
                                                    : {},
                                                jenis_itemrincianbiaya: e
                                                    ? e.value
                                                    : "",
                                            })
                                        }
                                        errors={errors.jenis_itemrincianbiaya}
                                    /> */}
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="w-full grid grid-cols-1">
                                        {/* <MoneyInput name='jumlah_kasbon' label='Jumlah Kasbon' errors={errors.ket}
                                        autoComplete='off'
                                        value={data.jumlah_kasbon}
                                        onValueChange={e => setData(prev => ({
                                            ...prev, 'jumlah_kasbon': e.value,
                                            'sisa_penggunaan': getSisaPenggunaan(Number.parseInt(e.value), Number.parseInt(data.jumlah_penggunaan))
                                        }))} /> */}
                                        <div className="flex flex-row justify-between items-center">
                                            <TranspermohonanSelect
                                                inputRef={firstInput}
                                                value={
                                                    data.permohonan
                                                        ?.transpermohonan
                                                }
                                                className="mb-1 w-full mr-2"
                                                errors={
                                                    errors.transpermohonan_id
                                                }
                                                isDisabledCheck={!allPermohonan}
                                                isChecked={false}
                                                onValueChange={(e) => {
                                                    if (e) {
                                                        setPermohonan(
                                                            e.permohonan
                                                        );
                                                        setValues((prev) => ({
                                                            ...prev,
                                                            transpermohonan_id:
                                                                e.id,
                                                            permohonan_id:
                                                                e.permohonan.id,
                                                        }));
                                                    } else {
                                                        setValues((prev) => ({
                                                            ...prev,
                                                            transpermohonan_id:
                                                                "",
                                                            permohonan_id: "",
                                                        }));
                                                    }
                                                }}
                                            />

                                            {/* <PermohonanSelect
                                                inputRef={firstInput}
                                                value={data.permohonan}
                                                className="mb-1 w-full mr-2"
                                                errors={
                                                    errors.transpermohonan_id
                                                }
                                                onValueChange={(e) => {
                                                    setPermohonan(e);
                                                    // setValues((prev) => ({
                                                    //     ...prev,
                                                    //     transpermohonan_id: e
                                                    //         ? e.transpermohonan
                                                    //               .id
                                                    //         : "",
                                                    //     permohonan_id: e
                                                    //         ? e.id
                                                    //         : "",
                                                    // }));
                                                }}
                                            /> */}

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
                                        <div className="flex flex-row items-start w-full gap-2 ">
                                            {isAdmin ? (
                                                <SelectSearch
                                                    name="user_id"
                                                    value={cuser}
                                                    options={userOpts}
                                                    placeholder="Pilih Petugas"
                                                    className="text-gray-800"
                                                    onChange={(e: any) => {
                                                        setData((v) => ({
                                                            ...v,
                                                            user_id: e
                                                                ? e.value
                                                                : "",
                                                        }));
                                                        setCuser(e);
                                                    }}
                                                />
                                            ) : // <AsyncSelectSearch
                                            //     placeholder="Pilih User"
                                            //     value={data.user}
                                            //     name="users"
                                            //     url="/admin/users/api/list/"
                                            //     errors={errors.user_id}
                                            //     onChange={(e: any) =>
                                            //         setData((v) => ({
                                            //             ...v,
                                            //             user: e,
                                            //             user_id: e
                                            //                 ? e.value
                                            //                 : "",
                                            //         }))
                                            //     }
                                            //     isClearable
                                            //     optionLabels={["name"]}
                                            //     optionValue="id"
                                            //     className="text-blueGray-900"
                                            // />
                                            null}
                                        </div>
                                        <SelectSearch
                                            name="metodebayar_id"
                                            label="Metode Bayar"
                                            className="mb-2"
                                            value={data.metodebayarOpt}
                                            options={metodebayarOpts}
                                            onChange={(e: any) =>
                                                setData({
                                                    ...data,
                                                    metodebayarOpt: e ? e : {},
                                                    metodebayar_id: e
                                                        ? e.value
                                                        : "",
                                                })
                                            }
                                            errors={errors.metodebayar_id}
                                        />
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
                                                    rekening_id: e
                                                        ? e.value
                                                        : "",
                                                })
                                            }
                                            errors={errors.rekening_id}
                                        />

                                        <Input
                                            name="ket_rincianbiayaperm"
                                            placeholder="Keterangan"
                                            value={data.ket_rincianbiayaperm}
                                            onChange={(e) =>
                                                setData(
                                                    "ket_rincianbiayaperm",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="w-full flex flex-col items-start">
                                        <SelectSearch
                                            options={transpermohonanOpts}
                                            value={transpermohonanOpt}
                                            onChange={(e: any) => {
                                                setData({
                                                    ...data,
                                                    transpermohonan_id: e.value,
                                                });
                                                setValues((prev) => ({
                                                    ...prev,
                                                    transpermohonan_id: e
                                                        ? e.value
                                                        : "",
                                                }));
                                            }}
                                            className="mb-0"
                                            placeholder="Pilih Jenis Permohonan"
                                        />
                                        <CardPermohonanEditable
                                            permohonan={permohonan}
                                            base_route={base_route}
                                            setPermohonan={setPermohonan}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            base_route +
                                                "transaksi.rincianbiayaperms.index"
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
            <ModalAddPermohonan
                showModal={showModalAddPermohonan}
                setShowModal={setShowModalAddPermohonan}
                setPermohonan={setPermohonan}
                src={route(base_route + "permohonans.modal.create")}
            />
        </AdminLayout>
    );
};

export default Create;
