import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import SelectSearch from "@/Components/Shared/SelectSearch";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import Select, { MultiValue, OnChangeValue } from "react-select";
import apputils from "@/bootstrap";
import { useEffect, useRef } from "react";
import AsyncSelectSearch from "@/Components/Shared/AsyncSelectSearch";
import InputWithMask from "@/Components/Shared/InputWithMask";
import { Jenispermohonan, OptionSelectActive, Permohonan } from "@/types";
import ListCheckbox from "@/Components/Shared/ListCheckbox";
import BlankLayout from "@/Layouts/BlankLayout";
import { useAuth } from "@/Contexts/AuthContext";
import useScreenSize from "@/Hooks/useScreenSize";

declare const window: {
    parent: { parentCallback: (permohonan: Permohonan | undefined) => void };
} & Window;

const Create = () => {
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
        bidang: number;
        // nodaftar_permohonan: number;
        // thdaftar_permohonan: number;
        users: MultiValue<OptionSelect[]>;
        jenispermohonans: MultiValue<OptionSelectActive>;
        active: boolean;
        desa: OptionSelect | undefined;
        jenishak: OptionSelect | undefined;
        kode_unik: string;
        _method: string;
    };

    const jenisTanahOptions: OptionSelect[] = [
        { label: "Pertanian", value: "pertanian" },
        { label: "Non Pertanian", value: "non_pertanian" },
    ];

    const { permohonanUsers, jenishaks, jenispermohonans, flash, userOpts } =
        usePage<any>().props;
    const { data, setData, errors, post, processing, transform } =
        useForm<FormValues>({
            nama_pelepas: "",
            nama_penerima: "",
            jenishak_id: jenishaks.length > 0 ? jenishaks[0].value : "",
            nomor_hak: "",
            persil: "",
            klas: "",
            luas_tanah: 0,
            atas_nama: "",
            jenis_tanah: jenisTanahOptions[1].value,
            jenistanah: jenisTanahOptions[1],
            desa_id: "",
            users: permohonanUsers,
            jenispermohonans: [],
            active: false,
            jenishak: jenishaks.length > 0 ? jenishaks[0] : "",
            desa: undefined,
            bidang: 1,
            kode_unik: "",
            _method: "POST",
        });
    const getPermohonan = async (id: string) => {
        const res = await apputils.backend.get(
            `/admin/permohonans/api/show/${id}`
        );
        const xdata = res.data;
        return xdata;
    };

    function handleSubmit(e: any) {
        e.preventDefault();
        const code = `${data.jenishak_id}.${parseInt(data.nomor_hak, 10)}${
            data.persil
        }${data.klas}.${data.desa_id}.${data.bidang}`;
        transform((data) => ({
            ...data,
            kode_unik: code,
        }));

        post(route("staf.permohonans.modal.store"), {
            onSuccess: (d: any) => {
                if (d.props.flash) {
                    closeDialog(d.props.flash.closedialog);
                }
            },
        });
    }
    const closeDialog = async (id: string) => {
        const perm: Permohonan[] = await getPermohonan(id);
        if (perm.length > 0) {
            window.parent.parentCallback(perm[0]);
        } else {
            window.parent.parentCallback(undefined);
        }
    };

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

    const onChange = (selectedOptions: OnChangeValue<OptionSelect[], true>) =>
        setData("users", selectedOptions);

    useEffect(() => {
        getOptions("");
        getDesaOptions("");
    }, []);

    const firstInput = useRef<any>(null);
    const klasFilter = /([DS])/;
    const romawiFilter = /([IV])/;
    // const letter = /(?!.*[DFIOQU])[A-Z]/;
    // const firstLetter = /([DS])/;
    // const digit = /[0-9]/;
    const mask = [klasFilter, ".", romawiFilter, romawiFilter, romawiFilter];

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
    const setSelectedJenisPermohonan = (id: string) => {
        let dts = [...data.jenispermohonans];
        for (let index = 0; index < dts.length; index++) {
            const elm = dts[index];
            dts[index].active = elm.value == id;
        }
        setData("jenispermohonans", dts);
    };
    useEffect(() => {
        getOptions("");
        getDesaOptions("");
    }, []);
    const screenSize = useScreenSize();
    const isMobile = screenSize.width < 768;

    return (
        <div className="flex content-center items-center justify-center h-full ">
            <div className="w-full">
                <div className="relative flex flex-col min-w-0 break-words w-full border-0 md:px-2">
                    <div className="rounded-t mb-0 px-4 py-2">
                        <div className="text-center mb-1">
                            <h6 className="text-blueGray-500 text-lg font-bold">
                                PERMOHONAN BARU
                            </h6>
                        </div>
                    </div>
                    <div className="flex-auto px-2 lg:px-10 py-4 pt-0">
                        <form onSubmit={handleSubmit}>
                            <div className="flex gap-2">
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
                                    type="text"
                                    errors={errors.nama_penerima}
                                    value={data.nama_penerima}
                                    onChange={(e) =>
                                        setData("nama_penerima", e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex ">
                                <SelectSearch
                                    name="jenishak_id"
                                    label="Jenis Hak"
                                    value={data.jenishak}
                                    options={jenishaks}
                                    className="w-full lg:w-2/5 pr-1 md:pr-2"
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
                                    label={`${isMobile}` ? "No" : "Nomor"}
                                    errors={errors.nomor_hak}
                                    value={data.nomor_hak}
                                    type="text"
                                    className="w-1/2 lg:w-1/5 pr-1"
                                />
                                {data.jenishak?.label.toLowerCase() ===
                                "hak milik adat" ? (
                                    <div className="flex gap-1">
                                        <Input
                                            className="w-1/2 lg:w-1/5 "
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
                                            className="w-1/2 lg:w-1/5 "
                                            name="klas"
                                            label="Klas"
                                            errors={errors.klas}
                                            value={data.klas}
                                            beforeMaskedStateChange={
                                                beforeMaskedStateChange
                                            }
                                            maskPlaceholder={null}
                                            onChange={(e) =>
                                                setData("klas", e.target.value)
                                            }
                                        />
                                    </div>
                                ) : null}
                                {errors ? (
                                    <span className="text-sm text-red-500">
                                        {errors.kode_unik}
                                    </span>
                                ) : null}
                            </div>

                            <div className="flex gap-2 ">
                                <Input
                                    name="luas_tanah"
                                    pattern="[0-9]*"
                                    onInput={(evt: any) => {
                                        const v = evt.target.validity.valid
                                            ? evt.target.value
                                            : data.luas_tanah;
                                        setData("luas_tanah", v);
                                    }}
                                    label="Luas (M2)"
                                    errors={errors.luas_tanah}
                                    value={data.luas_tanah}
                                    type="text"
                                    className="w-1/2 lg:w-1/5 px-1"
                                />
                                <Input
                                    name="bidang"
                                    pattern="[0-9]*"
                                    onInput={(evt: any) => {
                                        const v = evt.target.validity.valid
                                            ? evt.target.value
                                            : data.bidang;
                                        setData("bidang", v);
                                    }}
                                    label="Bidang"
                                    errors={errors.luas_tanah}
                                    value={data.bidang}
                                    type="text"
                                    className="w-1/2 lg:w-1/6 px-1"
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
                            <div className="flex gap-2">
                                <SelectSearch
                                    isMulti
                                    name="jenispermohonans"
                                    label="Jenis Permohonan"
                                    value={data.jenispermohonans}
                                    options={jenispermohonans}
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            jenispermohonans: e ? e : {},
                                        })
                                    }
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
                                    errors={errors.jenis_tanah}
                                />
                            </div>
                            {data.jenispermohonans &&
                            data.jenispermohonans.length ? (
                                <ListCheckbox
                                    list={data.jenispermohonans}
                                    onItemChange={(e) =>
                                        setSelectedJenisPermohonan(e)
                                    }
                                />
                            ) : null}
                            <div className="flex flex-col md:flex-row gap-1">
                                <AsyncSelectSearch
                                    name="desa"
                                    url="/admin/desas/api/list/"
                                    isClearable
                                    className="w-full md:w-1/2"
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
                                    className="w-full md:w-1/2"
                                    onChange={(e: any) =>
                                        setData({
                                            ...data,
                                            users: e ? e : {},
                                        })
                                    }
                                />
                            </div>
                            <div className="flex flex-row justify-between mb-2 w-full px-2">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        id="customCheckLogin"
                                        type="checkbox"
                                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                        checked={data.active}
                                        disabled
                                        onChange={(e) =>
                                            setData("active", e.target.checked)
                                        }
                                    />
                                    <span className="ml-2 text-sm font-semibold text-blueGray-600">
                                        Active
                                    </span>
                                </label>
                            </div>
                            <div className="flex items-center justify-end mt-4">
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
    );
};

export default Create;
