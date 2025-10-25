import AsyncSelectSearch from "@/Components/Shared/AsyncSelectSearch";
import Button from "@/Components/Shared/Button";
import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import MoneyInput from "@/Components/Shared/MoneyInput";
import SelectSearch from "@/Components/Shared/SelectSearch";
import UploadImage from "@/Components/Shared/UploadImage";
import { storage } from "@/firebase";
import AdminLayout from "@/Layouts/AdminLayout";
import { OptionSelect, Postingjurnal } from "@/types";
import { resizeImage } from "@/utils/images";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { BaseSyntheticEvent, useRef, useState } from "react";
import Select, { MultiValue, OnChangeValue } from "react-select";

const Edit = () => {
    type UserOption = {
        label: string;
        value: string;
    };

    type FormValues = {
        uraian: string;
        akundebet: OptionSelect | undefined;
        akunkredit: OptionSelect | undefined;
        akun_debet: string;
        akun_kredit: string;
        jumlah: string;
        image: string;
        _method: string;
    };

    const { postingjurnal, akunOpts, selAkunDebetOpt, selAkunKreditOpt } =
        usePage<{
            postingjurnal: Postingjurnal;
            akunOpts: OptionSelect[];
            selAkunDebetOpt: OptionSelect;
            selAkunKreditOpt: OptionSelect;
        }>().props;

    const { data, setData, errors, post, processing } = useForm<FormValues>({
        uraian: postingjurnal.uraian || "",
        akun_debet: postingjurnal.akun_debet || "",
        akun_kredit: postingjurnal.akun_kredit || "",
        akundebet: selAkunDebetOpt || undefined,
        akunkredit: selAkunKreditOpt || undefined,
        jumlah: postingjurnal.jumlah || "",
        image: postingjurnal.image || "",
        _method: "PUT",
    });
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>();
    // const [imageUrls, setImageUrls] = useState<string[]>([]);
    // const imagesListRef = ref(storage, "/images/biayaperms/");
    const fileRef = useRef<any>();

    const uploadFile = async () => {
        if (imageUpload == null) return;
        const newImg = await resizeImage(imageUpload, 500, 500);
        let rand = Math.random() * 100000;
        const imageRef = ref(
            storage,
            `/images/postingjurnals/${rand}_${imageUpload.name}`
        );

        const uploadTask = uploadBytesResumable(imageRef, newImg);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //         // Observe state change events such as progress, pause, and resume
                //         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                setUploadProgress(progress);
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    //   console.log('File available at', downloadURL);
                    setData("image", downloadURL);
                    setUploadProgress(null);
                    fileRef.current.value = null;
                    setImageUpload(null);
                });
            }
        );
    };

    const deleteFile = async (imageUrl: string) => {
        // setLoading(true);
        // const start = imageUrl.lastIndexOf("biayaperms%2F");
        // const end = imageUrl.lastIndexOf("?alt=media");
        // const fbimg = imageUrl.substring(start + 13, end);
        // const imgDir = "/images/biayaperms/";
        const imageRef = ref(storage, imageUrl);
        // Delete the file
        deleteObject(imageRef)
            .then(() => {
                setImageUpload(null);
                setData("image", "");
                console.log("image deleted from firebase");
                // File deleted successfully
            })
            .catch((error) => {
                console.log("error delete : ", error);
                // Uh-oh, an error occurred!
            });
    };

    function handleSubmit(e: any) {
        e.preventDefault();
        post(route("admin.transaksi.postingjurnals.update", postingjurnal.id));
    }
    const firstInput = useRef<any>(null);

    return (
        <AdminLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/4 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-2">
                            <div className="text-center mb-2">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Edit Item Kegiatan
                                </h6>
                            </div>
                            <hr className="mt-6 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-4 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input
                                    ref={firstInput}
                                    focused
                                    name="uraian"
                                    label="Uraian"
                                    errors={errors.uraian}
                                    value={data.uraian}
                                    onChange={(e) =>
                                        setData("uraian", e.target.value)
                                    }
                                />
                                <SelectSearch
                                    name="akun_debet"
                                    label="Akun Debet"
                                    value={data.akundebet}
                                    options={akunOpts}
                                    className="w-full"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            akun_debet: e ? e.value : "",
                                            akundebet: e ? e : {},
                                        })
                                    }
                                    errors={errors.akun_debet}
                                />
                                <SelectSearch
                                    name="akun_debet"
                                    label="Akun Kredit"
                                    value={data.akunkredit}
                                    options={akunOpts}
                                    className="w-full"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            akun_kredit: e ? e.value : "",
                                            akunkredit: e ? e : {},
                                        })
                                    }
                                    errors={errors.akun_kredit}
                                />
                                <MoneyInput
                                    name="jumlah"
                                    label="Jumlah"
                                    errors={errors.jumlah}
                                    autoComplete="off"
                                    value={data.jumlah}
                                    onValueChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            jumlah: e.value,
                                        }))
                                    }
                                />
                                <UploadImage
                                    name={"image_biayaperm"}
                                    image={data.image}
                                    imagePath={"/images/postingjurnals/"}
                                    setImage={(imgfile) =>
                                        setData("image", imgfile)
                                    }
                                />

                                <div className="flex items-center justify-between mt-4">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route(
                                            "admin.transaksi.postingjurnals.index"
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

export default Edit;
