import {
    Fragment,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Combobox, ComboboxInputProps, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    XCircleIcon,
    QrCodeIcon,
} from "@heroicons/react/20/solid";
import {
    OptionSelect,
    Permohonan,
    TPermohonan,
    Transpermohonan,
} from "@/types";
import { twMerge } from "tailwind-merge";
import useSWR from "swr";
import apputils from "@/bootstrap";
import ListboxSelect from "./ListboxSelect";
import { all } from "axios";
import ModalTakePicture from "../Modals/ModalTakePicture";
import ModalQRCode from "../Modals/ModalQRCode";
import { Result } from "@zxing/library";
import useScreenSize from "@/Hooks/useScreenSize";

type Props = {
    className?: string;
    value?: Transpermohonan | undefined | null;
    errors?: string;
    inputRef?: any;
    isStaf?: boolean;
    isChecked?: boolean;
    isDisabledCheck?: boolean;
    isAllPermohonan?: boolean;
    onValueChange: (e: Transpermohonan | null, opt: OptionSelect) => void;
    zIndex?: string;
};
export default function TranspermohonanSelect({
    className,
    onValueChange,
    value,
    errors,
    inputRef,
    isStaf,
    isChecked = false,
    isDisabledCheck = false,
    isAllPermohonan = false,
    zIndex = "z-50",
}: Props) {
    const [selectedPerson, setSelectedPerson] = useState<
        Transpermohonan | undefined | null
    >(value ? value : undefined);
    const listOptions: OptionSelect[] = [
        { label: "ALL", value: "" },
        { label: "PENERIMA", value: "nama_penerima" },
        { label: "PELEPAS", value: "nama_pelepas" },
        { label: "NO HAK", value: "nomor_hak" },
        { label: "NO DAFTAR", value: "nodaftar_permohonan" },
    ];
    const [allPerm, setAllPerm] = useState(isChecked);
    const [searchKey, setSearchKey] = useState<string>("");
    const [showCamera, setshowCamera] = useState<boolean>(false);
    // const inputRef = useRef<HTMLInputElement>(null);
    const screenSize = useScreenSize();
    const isMobile = screenSize.width < 768;

    function LoadingSpinner() {
        return (
            <svg
                className="h-5 w-5 animate-spin text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        );
    }
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    async function fetcher(
        url: string,
        query: string | unknown
    ): Promise<Transpermohonan[]> {
        const isstaf = allPerm ? false : true;
        if (searchKey) {
            const result = await apputils.backend.get(
                // `${url}?search=${query}&search_key=${searchKey}`
                `${url}?search=${query}&search_key=${searchKey}&is_staf=${isstaf}`
            );
            return result.data;
        } else {
            const result = await apputils.backend.get(
                // `${url}?search=${query}`
                `${url}?search=${query}&is_staf=${isstaf}`
            );
            return result.data;
        }
    }

    const [query, setQuery] = useState("");
    const { data: filteredOption, error } = useSWR<Transpermohonan[]>(
        ["/admin/transpermohonans/api/list/", query],
        ([url, query]) => fetcher(url, query)
    );

    const isLoading = !error && !filteredOption;

    const onChange = (e: Transpermohonan) => {
        setSelectedPerson((prev) => (prev ? e : undefined));
        onValueChange(e, listOptions[0]);
    };
    const comparePeople = (a?: Transpermohonan, b?: Transpermohonan): boolean =>
        a?.permohonan?.nama_penerima.toLowerCase() ===
        b?.permohonan?.nama_penerima.toLowerCase();

    const clearValue = (e: SyntheticEvent) => {
        e.preventDefault();
        if (inputRef && inputRef.current) {
            inputRef.current.value = "";
            onValueChange(null, listOptions[0]);
            // setSelectedPerson(undefined);
        }
    };

    const getPermohonan = async (
        id: string
    ): Promise<Transpermohonan | null> => {
        const url = "/admin/transpermohonans/api/list/";
        const result = await apputils.backend.get(
            `${url}?search=${id}&is_staf=${false}`
        );
        if (result.data.length > 0) {
            return result.data[0];
        }
        return null;
    };
    function handleReadQRCode(text: Result | undefined): void {
        if (text) {
            getPermohonan(text.getText()).then((res) => {
                console.log(res);
                inputRef.current.value = res?.permohonan.nama_penerima ?? "";
                onValueChange(res ?? null, listOptions[0]);
            });
        }
    }

    return (
        <>
            <Combobox
                value={selectedPerson ?? undefined}
                by={comparePeople}
                onChange={onChange}
            >
                <div className={twMerge(`relative`, className, zIndex)}>
                    <div
                        className={twMerge(
                            "relative overflow-visible items-center flex w-full cursor-default bg-white text-left rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm ",
                            className
                        )}
                    >
                        <ListboxSelect
                            className="w-full md:w-2/6 text-gray-800"
                            listOptions={listOptions}
                            onListChange={(e) => setSearchKey(e.value)}
                        />
                        <div className="flex items-center">
                            <input
                                tabIndex={-1}
                                type="checkbox"
                                className="w-3 h-3 rounded-md text-sm text-gray-600 mx-1"
                                disabled={isDisabledCheck}
                                onChange={() => {
                                    setAllPerm((prev) => !prev);
                                }}
                                defaultChecked={isChecked}
                            />
                            <label className="text-xs text-gray-800 mr-1">
                                all
                            </label>
                        </div>
                        <Combobox.Input
                            ref={inputRef}
                            className="w-full border-none py-2 pl-3 pr-8 text-sm leading-5 text-gray-900 focus:ring-0 rounded-r-lg"
                            displayValue={(transpermohonan: Transpermohonan) =>
                                transpermohonan.permohonan?.nama_penerima ?? ""
                            }
                            onChange={(event) => setQuery(event.target.value)}
                            autoComplete={"off"}
                            placeholder="Pilih Permohonan"
                        />
                        {inputRef.current && inputRef.current.value != "" && (
                            <a
                                tabIndex={-1}
                                href="#"
                                className="absolute inset-y-0 right-10 flex items-center pr-2"
                                onClick={clearValue}
                            >
                                <XCircleIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </a>
                        )}

                        <Combobox.Button className="absolute inset-y-0 right-5 flex items-center pr-2 ">
                            {isLoading && <LoadingSpinner />}
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                        <a
                            className="absolute inset-y-0 right-0 flex items-center pr-2"
                            href="#"
                        >
                            <QrCodeIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                                onClick={() => {
                                    setshowCamera(true);
                                }}
                            />
                        </a>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <Combobox.Options className="absolute mt-1 max-h-60 -ml-6 w-[calc(100vw-1rem)] md:w-[110vh] overflow-auto rounded-md bg-white py-0 shadow-lg ring-1 ring-black/5 focus:outline-none text-xs">
                            {filteredOption && filteredOption.length > 0 ? (
                                <div
                                    className={`flex flex-row p-2 w-full font-bold bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700 z-50`}
                                >
                                    <div className="w-[18%] md:w-[8%]">
                                        No Daftar
                                    </div>
                                    <div className="w-[10%] hidden md:block">
                                        Proses
                                    </div>
                                    <div className="w-[16%] hidden md:block">
                                        Pelepas
                                    </div>
                                    <div className="w-[36%] md:w-[16%]">
                                        Penerima
                                    </div>
                                    <div className="w-[18%] md:w-[20%]">
                                        Alas Hak
                                    </div>
                                    <div className="w-[27%] md:w-[20%]">
                                        Letak
                                    </div>
                                    <div className="w-[10%] hidden md:block">
                                        Users
                                    </div>
                                </div>
                            ) : null}
                            {filteredOption &&
                            filteredOption.length === 0 &&
                            query !== "" ? (
                                <div className="relative cursor-default select-none px-2 py-2 text-gray-700">
                                    Nothing value.
                                </div>
                            ) : (
                                filteredOption &&
                                filteredOption.map(
                                    (transpermohonan: Transpermohonan) => (
                                        <Combobox.Option
                                            key={transpermohonan.id}
                                            className={({ active }) =>
                                                `relative cursor-default select-none pr-2 ${
                                                    active
                                                        ? "bg-lightBlue-600 text-white"
                                                        : "text-lightBlue-950"
                                                }`
                                            }
                                            value={transpermohonan}
                                        >
                                            {({ selected, active }) => (
                                                <div
                                                    className={`flex flex-row p-2 w-full ${
                                                        selected
                                                            ? "font-bold"
                                                            : ""
                                                    }`}
                                                >
                                                    {/* {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-2 ${active ? 'text-white' : 'text-teal-600'
                                                            }`}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null} */}
                                                    <div className="w-[18%] md:w-[8%]">
                                                        {
                                                            transpermohonan.no_daftar
                                                        }
                                                    </div>
                                                    <div className="w-[10%] hidden md:block">
                                                        {
                                                            transpermohonan
                                                                .jenispermohonan
                                                                .nama_jenispermohonan
                                                        }
                                                    </div>
                                                    <div className="w-[16%] hidden md:block">
                                                        {
                                                            transpermohonan
                                                                .permohonan
                                                                ?.nama_pelepas
                                                        }
                                                    </div>
                                                    <div className="w-[36%] md:w-[16%]">
                                                        {
                                                            transpermohonan
                                                                .permohonan
                                                                ?.nama_penerima
                                                        }
                                                    </div>
                                                    <div className="w-[18%] md:w-[20%]">
                                                        {
                                                            transpermohonan
                                                                .permohonan
                                                                ?.nomor_hak
                                                        }
                                                        , L.
                                                        {
                                                            transpermohonan
                                                                .permohonan
                                                                .luas_tanah
                                                        }
                                                        M2
                                                    </div>
                                                    <div className="w-[27%] md:w-[20%]">
                                                        {
                                                            transpermohonan
                                                                .permohonan
                                                                ?.letak_obyek
                                                        }
                                                    </div>
                                                    <div className="w-[10%] hidden md:block">
                                                        {transpermohonan
                                                            .permohonan.users &&
                                                            transpermohonan.permohonan.users.map(
                                                                (usr, i) => (
                                                                    <span
                                                                        key={i}
                                                                    >
                                                                        {
                                                                            usr.name
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                    </div>
                                                </div>
                                            )}
                                        </Combobox.Option>
                                    )
                                )
                            )}
                        </Combobox.Options>
                    </Transition>
                    {errors ? (
                        <span className="text-sm text-red-500">{errors}</span>
                    ) : null}
                </div>
            </Combobox>
            <ModalQRCode
                showModal={showCamera}
                setShowModal={() => setshowCamera(false)}
                onReadQRCode={handleReadQRCode}
            />
        </>
    );
}
