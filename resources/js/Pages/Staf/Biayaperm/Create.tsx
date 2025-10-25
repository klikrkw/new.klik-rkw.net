// import CardPermohonan from '@/Components/Cards/Admin/CardPermohonan';
import CardPermohonanEditable from "@/Components/Cards/Admin/CardPermohonanEditable";
import CardTableBiayaperms from "@/Components/Cards/Staf/CardTableBiayaperms";
import CardTableKeluarbiayaperms from "@/Components/Cards/Staf/CardTableKeluarbiayaperms";
import ModalAddBiayaperm from "@/Components/Modals/ModalAddBiayaperm";
import ModalAddPermohonan from "@/Components/Modals/ModalAddPermohonan";
import LinkButton from "@/Components/Shared/LinkButton";
import PermohonanSelect from "@/Components/Shared/PermohonanSelect";
import SelectSearch from "@/Components/Shared/SelectSearch";
import TranspermohonanSelect from "@/Components/Shared/TranspermohonanSelect";
import { useAuth } from "@/Contexts/AuthContext";
import AdminLayout from "@/Layouts/AdminLayout";
import StafLayout from "@/Layouts/StafLayout";
import {
    Biayaperm,
    Itemprosesperm,
    OptionSelect,
    OptionSelectDisabled,
    Permohonan,
    Prosespermohonan,
    Statusprosesperm,
    Transpermohonan,
} from "@/types";
import useSwal from "@/utils/useSwal";
import { router, useForm, usePage } from "@inertiajs/react";
import { pickBy, values } from "lodash";
import React, {
    CSSProperties,
    ComponentType,
    LazyExoticComponent,
    Suspense,
    lazy,
    useEffect,
    useRef,
    useState,
} from "react";
import { usePrevious } from "react-use";
type LazyComponentType = LazyExoticComponent<ComponentType<any>>;
const CardPermohonan: LazyComponentType = lazy(
    () => import("@/Components/Cards/Admin/CardPermohonan")
);

const Create = () => {
    const {
        permohonan,
        biayaperms,
        transpermohonan,
        transpermohonanopt,
        transpermohonans,
        permohonan_id,
        transpermohonan_id,
        base_route,
        allPermohonan,
    } = usePage<{
        permohonan: Permohonan;
        biayaperms: Biayaperm[];
        transpermohonan: Transpermohonan;
        transpermohonanopt: OptionSelect;
        transpermohonans: Transpermohonan[];
        permohonan_id: string;
        transpermohonan_id: string;
        base_route: string;
        allPermohonan: boolean;
    }>().props;
    type FormValues = {
        permohonan_id: string;
        permohonan: Permohonan | unknown;
        jumlah_biayaperm: string;
        jumlah_bayar: string;
        kurang_bayar: string;
        catatan_biayaperm: string;
        _method: string;
    };
    const { data, setData, errors, post, processing, reset } =
        useForm<FormValues>({
            permohonan_id: permohonan ? permohonan.id : "",
            permohonan: null,
            jumlah_biayaperm: "",
            jumlah_bayar: "",
            kurang_bayar: "",
            catatan_biayaperm: "",
            _method: "POST",
        });
    const [AddMode, setAddMode] = useState(false);

    function handleSubmit(e: any) {
        e.preventDefault();
        useSwal
            .confirm({
                title: "Simpan Data",
                text: "akan menyimpan perubahan?",
            })
            .then((result) => {
                if (result.isConfirmed) {
                    post(route("staf.transaksi.prosespermohonans.store"), {
                        onSuccess: () => {
                            // reset('itemprosesperm', 'itemprosesperm_id', 'catatan_prosesperm', 'active')
                            setAddMode(false);
                        },
                    });
                }
            });
    }
    const setPermohonan = (permohonan: Permohonan | undefined) => {
        if (permohonan) {
            setData({ ...data, permohonan_id: permohonan.id });
            setValues((prev) => ({
                ...prev,
                permohonan_id: permohonan.id,
                transpermohonan_id: permohonan?.transpermohonan.id,
            }));
        } else {
            setData({ ...data, permohonan_id: "" });
            setValues((prev) => ({
                ...prev,
                permohonan_id: "",
                transpermohonan_id: "",
            }));
        }
        // router.get(route('admin.prosespermohonans.create', { permohonan_id: permohonan.permohonan.id }), {}, { preserveState: true, preserveScroll: true })
    };
    // const params = new URLSearchParams(window.location.search);

    const [values, setValues] = useState({
        permohonan_id: permohonan_id,
        transpermohonan_id: transpermohonan_id,
    });
    const prevValues = usePrevious(values);
    const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };
    const [showModalBiayaperm, setShowModalBiayaperm] = useState(false);
    const [showModalAddPermohonan, setShowModalAddPermohonan] =
        useState<boolean>(false);

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
    const { currentUser, login, logout } = useAuth();
    const { fbtoken } = usePage().props;
    useEffect(() => {
        if (!currentUser) {
            login(fbtoken);
        }
    }, []);

    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <StafLayout>
            {AddMode ? (
                <div className="z-20 absolute h-full w-full left-0"></div>
            ) : null}
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-10/12 md:px-4 px-0">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mt-2 px-4">
                            <div className="text-center">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    BIAYA PERMOHONAN
                                </h6>
                            </div>
                        </div>
                        <div className="flex-auto px-4 py-2">
                            {/* <form onSubmit={handleSubmit}> */}
                            <div className="flex flex-col md:flex-row items-center w-full gap-1 mb-3">
                                {/* <PermohonanSelect
                                    isStaf={true}
                                    className={`w-full ${
                                        AddMode ? "z-10" : ""
                                    }`}
                                    value={permohonan}
                                    onValueChange={setPermohonan}
                                    errors={errors.permohonan_id}
                                /> */}
                                <TranspermohonanSelect
                                    inputRef={inputRef}
                                    className={`w-full mr-2 ${
                                        AddMode ? "z-10" : ""
                                    }`}
                                    value={transpermohonan}
                                    onValueChange={(e) =>
                                        setPermohonan(e?.permohonan)
                                    }
                                    errors={errors.permohonan_id}
                                    isDisabledCheck={!allPermohonan}
                                />
                            </div>
                            <Suspense
                                fallback={
                                    <div className="w-full">
                                        <div className="flex items-center justify-center h-52 m-auto">
                                            Loading...
                                        </div>
                                    </div>
                                }
                            >
                                <div>
                                    {permohonan ? (
                                        <CardPermohonanEditable
                                            permohonan={permohonan}
                                            base_route={base_route}
                                            setPermohonan={setPermohonan}
                                        />
                                    ) : null}
                                </div>
                            </Suspense>
                            {/* <CardPermohonan permohonan={permohonan.permohonan} /> : null} */}
                            {permohonan ? (
                                <div className="bg-blueGray-300 rounded-md shadow-md py-2 px-2 flex justify-between items-center">
                                    <div className="w-1/2 md:w-1/3">
                                        <SelectSearch
                                            options={transpermohonans}
                                            value={transpermohonanopt}
                                            onChange={(e: any) =>
                                                setValues((prev) => ({
                                                    ...prev,
                                                    transpermohonan_id: e
                                                        ? e.value
                                                        : "",
                                                }))
                                            }
                                            className="mb-0"
                                            placeholder="Pilih Jenis Permohonan"
                                        />
                                    </div>
                                    {/* <LinkButton href='#' theme='black' className='shrink-0 py-2 mt-1  mb-0 text-xs' onClick={(e) => {
                                        e.preventDefault()
                                        setShowModalBiayaperm(true)
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hidden md:block w-4 h-4 text-sm mr-1 ">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                        </svg>


                                        <span> Tambah</span>
                                    </LinkButton> */}
                                </div>
                            ) : null}
                            {/* </form> */}
                            {biayaperms && biayaperms.length > 0 ? (
                                <CardTableBiayaperms biayaperms={biayaperms} />
                            ) : null}
                            {transpermohonan && (
                                <>
                                    <CardTableKeluarbiayaperms
                                        transpermohonan={transpermohonan}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ModalAddBiayaperm
                transpermohonan_id={transpermohonan_id}
                showModal={showModalBiayaperm}
                setShowModal={setShowModalBiayaperm}
            />
            <ModalAddPermohonan
                showModal={showModalAddPermohonan}
                setShowModal={setShowModalAddPermohonan}
                setPermohonan={setPermohonan}
                src={route(base_route + "permohonans.modal.create")}
            />
        </StafLayout>
    );
};

export default Create;
