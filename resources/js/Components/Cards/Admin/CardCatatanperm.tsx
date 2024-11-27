import { Catatanperm, Fieldcatatan, OptionSelect } from "@/types";
import { useEffect, useState } from "react";
import apputils from "@/bootstrap";
import Input from "@/Components/Shared/Input";
import SelectInput from "@/Components/Shared/SelectInput";
import SelectSearch from "@/Components/Shared/SelectSearch";
import { router, useForm, usePage } from "@inertiajs/react";
import useSwal from "@/utils/useSwal";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import UploadImage from "@/Components/Shared/UploadImage";
import { Lightbox } from "react-modal-image";

type Props = {
    transpermohonan_id: string | null | undefined;
};

const CardCatatanperm = ({ transpermohonan_id }: Props) => {
    const [catatanperms, setCatatanperms] = useState<Catatanperm[] | []>();
    const [isloading, setIsloading] = useState(false);
    const [formdata, setFormdata] = useState<{
        fieldcatatan: OptionSelect | null;
        isi_catatanperm: string;
        image_catatanperm: string;
    }>({ fieldcatatan: null, isi_catatanperm: "", image_catatanperm: "" });
    const { fieldcatatanOpts } = usePage<{ fieldcatatanOpts: OptionSelect[] }>()
        .props;
    const getCatatanperms = async (xtranspermohonan_id: string) => {
        setIsloading(true);
        if (xtranspermohonan_id.length > 3) {
            let xlink = `/admin/catatanperms/api/list?transpermohonan_id=${xtranspermohonan_id}`;
            const response = await apputils.backend.get(xlink);
            const data = response.data;
            // setNextLinkUser(data.links.next);
            // setPrevLinkUser(data.links.prev);
            setCatatanperms(data.data);
        }
        setIsloading(false);
    };
    useEffect(() => {
        if (transpermohonan_id) {
            getCatatanperms(transpermohonan_id);
        }
        return () => {
            setCatatanperms([]);
        };
    }, [transpermohonan_id]);
    type FormValues = {
        fieldcatatan_id: string;
        fieldcatatan: Fieldcatatan | null;
        isi_catatanperm: string;
        image_catatanperm: string;
        transpermohonan_id: string;
        _method: string;
    };
    const { data, setData, errors, post, processing, reset } =
        useForm<FormValues>({
            fieldcatatan: null,
            fieldcatatan_id: "",
            isi_catatanperm: "",
            image_catatanperm: "",
            transpermohonan_id: transpermohonan_id ?? "",
            _method: "POST",
        });
    const [AddMode, setAddMode] = useState(false);

    function handleSubmit(e: any) {
        e.preventDefault();
        // useSwal
        //     .confirm({
        //         title: "Simpan Data",
        //         text: "akan menyimpan perubahan?",
        //     })
        //     .then((result) => {
        // if (result.isConfirmed) {
        post(route("admin.catatanperms.store"), {
            onSuccess: () => {
                reset();
                setAddMode(false);
                if (transpermohonan_id) {
                    getCatatanperms(transpermohonan_id);
                }
            },
            preserveState: true,
            preserveScroll: true,
        });
        //     }
        // });
    }
    const [viewImage, setViewImage] = useState<boolean>(false);
    const [image, setImage] = useState<string | null>(null);
    const handleRemoveData = (id: string) => {
        router.delete(route("admin.catatanperms.destroy", id));
        if (transpermohonan_id) {
            getCatatanperms(transpermohonan_id);
        }
    };
    useEffect(() => {
        if (transpermohonan_id) {
            setData("transpermohonan_id", transpermohonan_id);
        }
    }, [transpermohonan_id]);

    return (
        <div className="relative rounded-md p-2 bg-white/80 hover:bg-gray-100 text-sm shadow-md">
            <div className="w-full font-bold mb-2">
                CATATAN : {transpermohonan_id}
            </div>
            {transpermohonan_id && transpermohonan_id.length > 3 && (
                <form onSubmit={handleSubmit}>
                    <div className="w-full flex flex-row gap-1">
                        <SelectSearch
                            name="jenishak_id"
                            value={data.fieldcatatan}
                            options={fieldcatatanOpts}
                            className="w-full lg:w-full "
                            onChange={(e: any) =>
                                setData({
                                    ...data,
                                    fieldcatatan: e,
                                    fieldcatatan_id: e ? e.value : "",
                                })
                            }
                            errors={errors.fieldcatatan_id}
                        />
                        <Input
                            name="Isi Catatan"
                            placeholder="Isi Catatan"
                            value={data.isi_catatanperm}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    isi_catatanperm: e.target.value,
                                })
                            }
                            errors={errors.isi_catatanperm}
                        />
                        <UploadImage
                            image={data.image_catatanperm}
                            imagePath="/images/catatanperms/"
                            setImage={(image) =>
                                setData("image_catatanperm", image)
                            }
                            name="image_catatanperm"
                        />
                        {/* <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            "admin.itemkegiatans.index"
                                        )}
                                    >
                                        <span>Kembali</span>
                                    </LinkButton> */}
                        <div>
                            <LoadingButton
                                theme="red"
                                loading={processing}
                                type="submit"
                            >
                                <span>ADD</span>
                            </LoadingButton>
                        </div>
                    </div>
                </form>
            )}
            {catatanperms ? (
                <div className="p-1 w-full flex-col">
                    <table className="w-full">
                        <thead>
                            <tr className="border-y-2 font-semibold bg-slate-300">
                                <td width="20%">Nama Catatan</td>
                                <td width="50%">Isi Catatan</td>
                                <td width="20%">Image</td>
                                <td width="10%">Opt</td>
                            </tr>
                        </thead>
                        <tbody>
                            {catatanperms.map((catatanperm, i) => (
                                <tr key={i}>
                                    <td>
                                        {
                                            catatanperm.fieldcatatan
                                                .nama_fieldcatatan
                                        }
                                    </td>
                                    <td>{catatanperm.isi_catatanperm}</td>
                                    <td>
                                        {catatanperm.image_catatanperm && (
                                            <button
                                                onClick={() => {
                                                    setImage(
                                                        catatanperm.image_catatanperm
                                                    );
                                                    setViewImage(true);
                                                }}
                                            >
                                                <i
                                                    className={
                                                        "fas fa-image mr-2 text-md cursor-pointer"
                                                    }
                                                ></i>
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            onClick={(e) =>
                                                useSwal
                                                    .confirm({
                                                        title: "Hapus Data",
                                                        text: "apakah akan menghapus?",
                                                    })
                                                    .then((result) => {
                                                        if (
                                                            result.isConfirmed
                                                        ) {
                                                            handleRemoveData(
                                                                catatanperm.id
                                                            );
                                                        }
                                                    })
                                            }
                                            className="text-lightBlue-500 background-transparent font-bold px-3 py-1 text-xs outline-none focus:outline-none hover:text-lightBlue-100 hover:scale-105 mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                        >
                                            <i
                                                className={
                                                    "fas fa-trash mr-2 text-md cursor-pointer"
                                                }
                                            ></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}
            {viewImage && (
                <Lightbox
                    small={image ? image : ""}
                    medium={image ? image : ""}
                    large={image ? image : ""}
                    alt="View Image"
                    onClose={() => setViewImage(false)}
                />
            )}
        </div>
    );
};
export default CardCatatanperm;
