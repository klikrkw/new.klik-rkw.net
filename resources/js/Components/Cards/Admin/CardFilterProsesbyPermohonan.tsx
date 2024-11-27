import Button from "@/Components/Shared/Button";
import PermohonanSelect from "@/Components/Shared/PermohonanSelect";
import Pilihstatusprosesperm from "@/Components/Shared/PilihStatusprosesperm";
import SelectSearch from "@/Components/Shared/SelectSearch";
import TranspermohonanSelect from "@/Components/Shared/TranspermohonanSelect";
import { Permohonan, Statusprosesperm, Transpermohonan } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { usePrevious, useStateList } from "react-use";

type Props = {
    itemprosespermsOpts: any;
};
const CardFilterProsesbyPermohonan = ({ itemprosespermsOpts }: Props) => {
    const transPermSelectRef = useRef<any>();

    const {
        itemprosesperm_id,
        statusprosesperms,
        statusprosesperm_id,
        transpermohonan_id,
        transpermohonan,
    } = usePage<{
        itemprosesperm_id: string;
        statusprosesperms: Statusprosesperm[];
        statusprosesperm_id: string;
        transpermohonan_id: string;
        transpermohonan: Transpermohonan;
    }>().props;
    // const params = new URLSearchParams(window.location.search);

    const [values, setValues] = useState({
        itemprosesperm_id: itemprosesperm_id,
        statusprosesperm_id: statusprosesperm_id,
        transpermohonan_id: transpermohonan_id,
    });

    const prevValues = usePrevious(values);
    const itemprosesperm = itemprosespermsOpts.find(
        (e: any) => e.value == itemprosesperm_id
    );
    const statusprosesperm = statusprosesperms.find(
        (e: any) => e.id == statusprosesperm_id
    );
    const [ctranspermohonan, setCtranspermohonan] = useState<
        Transpermohonan | null | undefined
    >(transpermohonan);

    useEffect(() => {
        // https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state

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
    useEffect(() => {
        if (ctranspermohonan) {
            if (transPermSelectRef.current) {
                transPermSelectRef.current.value =
                    ctranspermohonan.permohonan.nama_penerima;
            }
        }
    }, []);

    return (
        <div className="py-2 px-4 bg-blueGray-200 shadow-lg rounded-lg flex flex-col shadow-gray-400">
            <h1 className="font-bold text-lightBlue-700 mb-2">Permohonan</h1>
            <TranspermohonanSelect
                inputRef={transPermSelectRef}
                value={ctranspermohonan}
                className="mb-1"
                onValueChange={(e) => {
                    setCtranspermohonan(e);
                    setValues((v) => ({
                        ...v,
                        transpermohonan_id: e ? e.id : "",
                    }));
                }}
            />
            {/* <Button
                theme="blue"
                onClick={(e) =>
                    setValues((v) => ({
                        ...v,
                        permohonan: null,
                        transpermohonan_id: null,
                    }))
                }
            >
                Semua Permohonan
            </Button> */}
            <h1 className="font-bold text-lightBlue-700 mb-2">Nama Proses</h1>
            <SelectSearch
                options={itemprosespermsOpts}
                value={itemprosesperm}
                onChange={(e) => {
                    setValues((v) => ({ ...v, itemprosesperm_id: e.value }));
                }}
            />
            <h1 className="font-bold text-lightBlue-700 mb-2">Status Proses</h1>
            <Pilihstatusprosesperm
                statusprosesperms={statusprosesperms}
                statusprosesperm={statusprosesperm}
                setStatusprosesperm={(e) => {
                    setValues((v) => ({ ...v, statusprosesperm_id: e.id }));
                }}
            />
        </div>
    );
};

export default CardFilterProsesbyPermohonan;
