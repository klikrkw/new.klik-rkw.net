// import CardPermohonan from '@/Components/Cards/Admin/CardPermohonan';
import CardPermohonanEditable from "@/Components/Cards/Admin/CardPermohonanEditable";
import CardTableProsespermohonans from "@/Components/Cards/Admin/CardTableProsespermohonans";
import ModalAddPermohonan from "@/Components/Modals/ModalAddPermohonan";
import ModalCetakLaporan from "@/Components/Modals/ModalCetakLaporan";
import PrintDialog from "@/Components/Modals/PrintDialog";
import Button from "@/Components/Shared/Button";
import TranspermohonanSelect from "@/Components/Shared/TranspermohonanSelect";
import AdminLayout from "@/Layouts/AdminLayout";
import { Permohonan, PrintData, Transpermohonan } from "@/types";
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
    const { transpermohonan, base_route, img } = usePage<{
        transpermohonan: Transpermohonan;
        base_route: string;
        img: string;
    }>().props;

    const [ctranspermohonan, setCtranspermohonan] = useState<
        Transpermohonan | null | undefined
    >(transpermohonan);
    const setPermohonan = (permohonan: Permohonan | undefined) => {
        if (permohonan) {
            // setData({
            //     ...data,
            //     transpermohonan_id: permohonan.transpermohonan.id,
            //     permohonan: permohonan,
            // });
            setValues((prev) => ({
                ...prev,
                transpermohonan_id: permohonan.transpermohonan.id,
                permohonan_id: permohonan.id,
            }));
            // } else {
            //     setValues((prev) => ({
            //         ...prev,
            //         transpermohonan_id: "",
            //     }));
        }
        // router.get(route('admin.prosespermohonans.create', { transpermohonan_id: permohonan.transpermohonan.id }), {}, { preserveState: true, preserveScroll: true })
    };
    const params = new URLSearchParams(window.location.search);
    const [values, setValues] = useState({
        transpermohonan_id: params.get("transpermohonan_id"),
        permohonan_id: params.get("permohonan_id"),
    });
    const [showModalAddPermohonan, setShowModalAddPermohonan] =
        useState<boolean>(false);
    const [showModalLaporan, setShowModalLaporan] = useState<boolean>(false);
    const [showModalPrint, setShowModalPrint] = useState<boolean>(false);
    const [showModalLabelberkas, setShowModalLabelberkas] =
        useState<boolean>(false);
    const [printData, setPrintData] = useState<PrintData>({
        row: "1",
        col: "1",
    });
    const prevValues = usePrevious(values);
    // const itemprosesId = itemprosesperms.find(
    //     (e) => e.value === values.itemprosesperm_id
    // );
    const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };
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
    const firstInput = useRef<any>();
    const transpermSelectRef = useRef<any>(null);
    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/3 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-2 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mt-2 px-4">
                            <div className="text-center">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    CETAK LABEL BERKAS DAN QR CODE
                                </h6>
                            </div>
                        </div>
                        <div className="flex-auto p-4">
                            <div className="flex flex-row justify-between items-center">
                                <TranspermohonanSelect
                                    inputRef={firstInput}
                                    value={ctranspermohonan}
                                    className="mb-1 w-full mr-2"
                                    onValueChange={(e) => {
                                        setPermohonan(e?.permohonan);
                                    }}
                                    isChecked={false}
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
                            {transpermohonan && transpermohonan.permohonan ? (
                                <>
                                    <CardPermohonanEditable
                                        permohonan={transpermohonan.permohonan}
                                        base_route={base_route}
                                        setPermohonan={setPermohonan}
                                    />
                                    <Button
                                        theme="black"
                                        onClick={(e) => setShowModalPrint(true)}
                                    >
                                        <span>Cetak Qrcode</span>
                                    </Button>
                                    <Button
                                        theme="black"
                                        onClick={(e) =>
                                            setShowModalLabelberkas(true)
                                        }
                                    >
                                        <span>Cetak Label Berkas</span>
                                    </Button>
                                </>
                            ) : null}
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
            <PrintDialog
                showModal={showModalPrint}
                setShowModal={(e) => setShowModalPrint(e)}
                onCommit={(e: PrintData) => {
                    setPrintData(e);
                    setShowModalPrint(false);
                    setShowModalLaporan(true);
                }}
            />
            <ModalCetakLaporan
                showModal={showModalLaporan}
                setShowModal={setShowModalLaporan}
                src={route(base_route + "permohonans.qrcode.cetak", {
                    transpermohonan:
                        transpermohonan && transpermohonan.permohonan
                            ? transpermohonan.id
                            : "",
                    row: printData.row,
                    col: printData.col,
                })}
            />
            <ModalCetakLaporan
                showModal={showModalLabelberkas}
                setShowModal={setShowModalLabelberkas}
                src={route(
                    base_route + "permohonans.labelberkas.cetak",
                    transpermohonan && transpermohonan.permohonan
                        ? transpermohonan.id
                        : ""
                )}
            />
        </AdminLayout>
    );
};

export default Create;
