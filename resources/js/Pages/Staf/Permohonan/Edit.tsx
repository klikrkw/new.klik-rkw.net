import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import SelectSearch from "@/Components/Shared/SelectSearch";
import TextInput from "@/Components/TextInput";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import Select, { MultiValue, OnChangeValue } from "react-select";
import apputils from "@/bootstrap";
import { useEffect, useRef, useState } from "react";
import AsyncSelectSearch from "@/Components/Shared/AsyncSelectSearch";
import InputWithMask from "@/Components/Shared/InputWithMask";
import { OptionSelectActive } from "@/types";
import ListCheckbox from "@/Components/Shared/ListCheckbox";
import StafLayout from "@/Layouts/StafLayout";
import CardCatatanperm from "@/Components/Cards/Admin/CardCatatanperm";

const Edit = () => {
    type OptionSelect = {
        label: string;
        value: string;
    };

    type FormValues = {
        nama_pelepas: string;
        nama_penerima: string;
        jenishak_id: string;
        nomor_hak: string;
        persil: string;
        klas: string;
        luas_tanah: number;
        atas_nama: string;
        jenis_tanah: string;
        jenistanah: OptionSelect;
        desa_id: string;
        // nodaftar_permohonan: number;
        // thdaftar_permohonan: number;
        users: MultiValue<OptionSelect[]>;
        active: boolean;
        desa: OptionSelect | undefined;
        jenispermohonans: MultiValue<OptionSelectActive>;
        jenishak: OptionSelect | undefined;
        kode_unik: string;
        bidang: number;
        _method: string;
    };

    const jenisTanahOptions: OptionSelect[] = [
        { label: "Pertanian", value: "pertanian" },
        { label: "Non Pertanian", value: "non_pertanian" },
    ];

    const {
        permohonan,
        permohonanUsers,
        jenishaks,
        jenispermohonans,
        desa,
        jenishak,
        permohonanJenispermohonans,
        userOpts,
        transpermohonan_id,
    } = usePage<any>().props;
    const jenistanah = jenisTanahOptions.find(
        (v) => v.value === permohonan.jenis_tanah
    );
    const { data, setData, errors, post, processing, transform } =
        useForm<FormValues>({
            nama_pelepas: permohonan.nama_pelepas || "",
            nama_penerima: permohonan.nama_penerima || "",
            jenishak_id: permohonan.jenishak_id || jenishaks[0].value,
            nomor_hak: permohonan.nomor_hak || "",
            persil: permohonan.persil || "",
            klas: permohonan.klas || "",
            luas_tanah: permohonan.luas_tanah || 0,
            atas_nama: permohonan.atas_nama || "",
            jenis_tanah: permohonan.jenis_tanah,
            jenistanah: jenistanah ? jenistanah : jenisTanahOptions[1],
            desa_id: permohonan.desa_id || "",
            users: permohonanUsers,
            active: permohonan.active,
            jenishak: jenishak,
            jenispermohonans: permohonanJenispermohonans,
            desa: desa,
            bidang: permohonan.bidang,
            kode_unik: permohonan.kode_unik,
            _method: "PUT",
        });
    function handleSubmit(e: any) {
        e.preventDefault();
        const code = `${data.jenishak_id}.${parseInt(data.nomor_hak, 10)}${
            data.persil
        }${data.klas}.${data.desa_id}.${data.bidang}`;
        transform((data) => ({
            ...data,
            kode_unik: code,
        }));
        post(route("staf.permohonans.update", permohonan.id));
    }
    const [transpermohonanId, setTranspermohonanId] = useState<
        string | null | undefined
    >(transpermohonan_id);

    const getOptions = async (query: string) => {
        const res = await apputils.backend.get(
            `/admin/users/api/list/?query=${query}`
        );
        const data = res.data;
        const options = data.map((d: any) => ({
            value: d["id"],
            label: d["labelOption"],
        }));
        // this.setState({ selectOptions: options });
        // this.getValue(options);
    };
    const getDesaOptions = async (query: string) => {
        const res = await apputils.backend.get(
            `/admin/desas/api/list/?query=${query}`
        );
        const data = res.data;
        const options = data.map((d: any) => ({
            value: d["id"],
            label: d["labelOption"],
        }));
        // this.setState({ selectOptions: options });
        // this.getValue(options);
    };
    const getTranspermohonan = async (transpermohonanId: string) => {
        const res = await apputils.backend.get(
            `/admin/transpermohonans/api/${transpermohonanId}/show`
        );
        const resData = res.data;
        if (resData) {
            if (resData.atas_namatp != null) {
                setData({
                    ...data,
                    atas_nama: resData.atas_namatp,
                    luas_tanah: resData.luas_tanahtp,
                    nomor_hak: resData.nomor_haktp,
                });
            }
        }
    };

    const onChange = (selectedOptions: OnChangeValue<OptionSelect[], true>) =>
        setData("users", selectedOptions);

    useEffect(() => {
        getOptions("");
        getDesaOptions("");
    }, []);

    const firstInput = useRef<any>(null);

    const beforeMaskedStateChange = ({ nextState }: { nextState: any }) => {
        let { value } = nextState;
        if (value.endsWith("/")) {
            value = value.slice(0, -1);
        }

        return {
            ...nextState,
            value,
        };
    };

    const klasFilter = /([DS])/;
    const romawiFilter = /([IV])/;
    // const letter = /(?!.*[DFIOQU])[A-Z]/;
    // const firstLetter = /([DS])/;
    // const digit = /[0-9]/;
    const mask = [klasFilter, ".", romawiFilter, romawiFilter, romawiFilter];
    const setSelectedJenisPermohonan = (id: string) => {
        let dts = [...data.jenispermohonans];
        for (let index = 0; index < dts.length; index++) {
            const elm = dts[index];
            dts[index].active = elm.value == id;
        }
        setData("jenispermohonans", dts);
    };
    return (
        <StafLayout>
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-2/3 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg shadow-slate-400 rounded-lg bg-blueGray-200 border-0">
                        <div className="rounded-t mb-0 px-6 py-4">
                            <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-lg font-bold">
                                    Edit Permohonan
                                </h6>
                            </div>
                            <hr className="mt-4 border-b-1 border-blueGray-300" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <form onSubmit={handleSubmit}>
                                <Input
                                    ref={firstInput}
                                    focused
                                    name="nama_pelepas"
                                    label="Nama Pelepas"
                                    errors={errors.nama_pelepas}
                                    value={data.nama_pelepas}
                                    type="text"
                                    onChange={(e) =>
                                        setData("nama_pelepas", e.target.value)
                                    }
                                />
                                <Input
                                    name="nama_penerima"
                                    label="Nama Penerima"
                                    errors={errors.nama_penerima}
                                    value={data.nama_penerima}
                                    onChange={(e) =>
                                        setData("nama_penerima", e.target.value)
                                    }
                                />
                                <div className="flex flex-wrap ">
                                    <SelectSearch
                                        name="jenishak_id"
                                        label="Jenis Hak"
                                        value={data.jenishak}
                                        options={jenishaks}
                                        className="w-full lg:w-2/5 pr-1"
                                        onChange={(e: any) =>
                                            setData({
                                                ...data,
                                                jenishak_id: e ? e.value : "",
                                                jenishak: e ? e : {},
                                            })
                                        }
                                    />
                                    <Input
                                        name="nomor_hak"
                                        pattern="[0-9]*"
                                        onInput={(evt: any) => {
                                            const dt = evt.target.validity.valid
                                                ? evt.target.value
                                                : data.nomor_hak;
                                            setData("nomor_hak", dt);
                                        }}
                                        label="Nomor Hak"
                                        errors={errors.nomor_hak}
                                        value={data.nomor_hak}
                                        type="text"
                                        className="w-full lg:w-1/5 px-1"
                                    />
                                    {data.jenishak?.label.toLowerCase() ===
                                    "hak milik adat" ? (
                                        <>
                                            <Input
                                                className="w-full lg:w-1/5 px-1"
                                                name="persil"
                                                label="Persil"
                                                errors={errors.persil}
                                                value={data.persil}
                                                type="text"
                                                onChange={(e) =>
                                                    setData(
                                                        "persil",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputWithMask
                                                mask={mask}
                                                className="w-full lg:w-1/5 px-1"
                                                name="klas"
                                                label="Klas"
                                                errors={errors.klas}
                                                value={data.klas}
                                                beforeMaskedStateChange={
                                                    beforeMaskedStateChange
                                                }
                                                maskPlaceholder={null}
                                                onChange={(e) =>
                                                    setData(
                                                        "klas",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </>
                                    ) : null}
                                    {errors ? (
                                        <span className="text-sm text-red-500">
                                            {errors.kode_unik}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="flex flex-wrap md:flex-nowrap gap-1 ">
                                    <Input
                                        name="luas_tanah"
                                        pattern="[0-9]*"
                                        onInput={(evt: any) => {
                                            const v = evt.target.validity.valid
                                                ? evt.target.value
                                                : data.luas_tanah;
                                            setData("luas_tanah", v);
                                        }}
                                        label="Luas Tanah"
                                        errors={errors.luas_tanah}
                                        value={data.luas_tanah}
                                        type="text"
                                        className="w-full lg:w-1/5 px-1"
                                    />
                                    <Input
                                        name="atas_nama"
                                        label="Atas Nama"
                                        errors={errors.atas_nama}
                                        value={data.atas_nama}
                                        type="text"
                                        onChange={(e) =>
                                            setData("atas_nama", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex gap-2 flex-wrap md:flex-nowrap">
                                    <SelectSearch
                                        isMulti
                                        name="jenispermohonans"
                                        label="Jenis Permohonan"
                                        value={data.jenispermohonans}
                                        options={jenispermohonans}
                                        isClearable={false}
                                        onChange={(e: any, option) => {
                                            if (
                                                option.removedValue &&
                                                option.removedValue.isFixed
                                            )
                                                return;
                                            setData({
                                                ...data,
                                                jenispermohonans: e ? e : {},
                                            });
                                        }}
                                        errors={errors.jenispermohonans}
                                    />
                                    <SelectSearch
                                        name="jenis_tanah"
                                        label="Jenis Tanah"
                                        value={data.jenistanah}
                                        options={jenisTanahOptions}
                                        onChange={(e: any) =>
                                            setData({
                                                ...data,
                                                jenis_tanah: e ? e.value : "",
                                                jenistanah: e ? e : {},
                                            })
                                        }
                                    />
                                </div>
                                {data.jenispermohonans &&
                                data.jenispermohonans.length ? (
                                    <ListCheckbox
                                        list={data.jenispermohonans}
                                        onItemChange={(e) => {
                                            setSelectedJenisPermohonan(e);
                                            getTranspermohonan(e);
                                        }}
                                    />
                                ) : null}
                                <AsyncSelectSearch
                                    name="desa"
                                    url="/admin/desas/api/list/"
                                    isClearable
                                    label="Desa"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            desa_id: e ? e.value : "",
                                            desa: e ? e : {},
                                        })
                                    }
                                    value={data.desa}
                                    optionLabels={[
                                        "nama_desa",
                                        "nama_kecamatan",
                                    ]}
                                    optionValue="id"
                                    errors={errors.desa_id}
                                />
                                <SelectSearch
                                    name="user_id"
                                    label="Petugas"
                                    value={data.users}
                                    isMulti
                                    options={userOpts}
                                    className="w-full lg:w-2/5 pr-1"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            users: e ? e : {},
                                        })
                                    }
                                />

                                {/* <AsyncSelectSearch
                                    name="users"
                                    url="/admin/users/api/list/"
                                    isMulti
                                    label="User"
                                    onChange={onChange}
                                    value={data.users}
                                    optionLabels={["name", "email"]}
                                    optionValue="id"
                                /> */}
                                <div className="mb-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            id="customCheckLogin"
                                            type="checkbox"
                                            className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                            checked={data.active}
                                            disabled
                                            onChange={(e) =>
                                                setData(
                                                    "active",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <span className="ml-2 text-sm font-semibold text-blueGray-600">
                                            Active
                                        </span>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <LinkButton
                                        theme="blueGrey"
                                        href={route("staf.permohonans.index")}
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
                            <div className="w-full lg:w-full pr-2 mt-2">
                                <CardCatatanperm
                                    transpermohonan_id={transpermohonanId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StafLayout>
    );
};

export default Edit;
