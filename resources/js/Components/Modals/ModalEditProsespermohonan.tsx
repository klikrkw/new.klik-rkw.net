import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { LoadingButton } from "../Shared/LoadingButton";
import LinkButton from "../Shared/LinkButton";
import {
    Biayaperm,
    OptionSelect,
    Prosespermohonan,
    StatusprosespermProsespermohonan,
} from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import Input from "../Shared/Input";
import useSwal from "@/utils/useSwal";
import SelectSearch from "../Shared/SelectSearch";
import moment from "moment";
import DateInput from "../Shared/DateInput";
import { stat } from "fs";

type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
    prosespermohonan: Prosespermohonan | undefined;
    statusprosesperm: StatusprosespermProsespermohonan | null | undefined;
};
const ModalEditProsespermohonan = ({
    showModal,
    setShowModal,
    prosespermohonan,
    statusprosesperm,
}: Props) => {
    const { statuspermOpts, base_route = "admin." } = usePage<{
        statuspermOpts: OptionSelect[];
        base_route: string;
    }>().props;

    type FormValues = {
        prosespermohonan_id: string;
        prosespermohonan: Prosespermohonan | unknown;
        statusprosesperm_id: string;
        statusprosesperm: OptionSelect | unknown;
        catatan_statusprosesperm: string;
        start: string;
        end: string;
        is_alert: boolean;
        _method: string;
    };
    // const [statuspermOpts, setstatusPermOpts] = useState<OptionSelect[]>([]);
    const cstatusperm = statuspermOpts.find(
        (item) => item.value == statusprosesperm?.id
    );

    const { data, setData, errors, post, processing, reset } =
        useForm<FormValues>({
            prosespermohonan_id: prosespermohonan?.id || "",
            prosespermohonan: prosespermohonan,
            statusprosesperm_id: cstatusperm?.value || "",
            statusprosesperm: cstatusperm,
            catatan_statusprosesperm:
                statusprosesperm?.pivot.catatan_statusprosesperm || "",
            is_alert: prosespermohonan?.is_alert || false,
            start: moment(prosespermohonan?.start || Date.now()).format(
                "YYYY-MM-DD HH:mm"
            ),
            end: moment(prosespermohonan?.end || Date.now()).format(
                "YYYY-MM-DD HH:mm"
            ),
            _method: "POST",
        });

    function handleSubmit(e: any) {
        e.preventDefault();
        useSwal
            .confirm({
                title: "Simpan Data",
                text: "apakah akan menyimpan?",
            })
            .then((result) => {
                if (result.isConfirmed) {
                    post(
                        route(
                            base_route +
                                "transaksi.prosespermohonans.statusprosesperms.store",
                            data.prosespermohonan_id
                        ),
                        {
                            onSuccess: () => {
                                reset(
                                    "prosespermohonan_id",
                                    "statusprosesperm_id",
                                    "catatan_statusprosesperm"
                                );
                                setShowModal(false);
                            },
                        }
                    );
                }
            });
    }
    return (
        <Modal
            show={showModal}
            maxWidth="md"
            closeable={false}
            onClose={() => alert("modal close")}
        >
            <div className="p-4">
                <form onSubmit={handleSubmit}>
                    <SelectSearch
                        name="itemprosesperm_id"
                        label="Status Proses"
                        value={data.statusprosesperm}
                        options={statuspermOpts}
                        onChange={(e: any) =>
                            setData({
                                ...data,
                                statusprosesperm_id: e ? e.value : "",
                                statusprosesperm: e ? e : {},
                            })
                        }
                        errors={errors.statusprosesperm_id}
                    />
                    <Input
                        name="catatan_statusprosesperm"
                        label="Catatan"
                        errors={errors.catatan_statusprosesperm}
                        value={data.catatan_statusprosesperm}
                        onChange={(e) =>
                            setData("catatan_statusprosesperm", e.target.value)
                        }
                    />
                    <div className="relative h-full mr-4 mt-2">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                id="customCheckAlert"
                                type="checkbox"
                                className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                checked={data.is_alert}
                                onChange={(e) =>
                                    setData("is_alert", e.target.checked)
                                }
                            />
                            <span className="ml-2 text-sm font-semibold text-blueGray-600">
                                Ingatkan
                            </span>
                        </label>
                    </div>
                    {data.is_alert ? (
                        <div className="w-full flex flex-col gap-2 mb-4">
                            <DateInput
                                label="Start"
                                // showTimeSelect
                                selected={data.start}
                                value={data.start}
                                name="start"
                                errors={errors.start}
                                showTimeSelect
                                customDateFormat="DD-MMM-YYYY HH:mm"
                                onChange={(e) =>
                                    setData(
                                        "start",
                                        moment(e).format("YYYY-MM-DD HH:mm")
                                    )
                                }
                            />
                            <DateInput
                                label="End"
                                // showTimeSelect
                                selected={data.end}
                                value={data.end}
                                name="end"
                                errors={errors.end}
                                customDateFormat="DD-MMM-YYYY HH:mm"
                                showTimeSelect
                                onChange={(e) =>
                                    setData(
                                        "end",
                                        moment(e).format("YYYY-MM-DD HH:mm")
                                    )
                                }
                            />
                        </div>
                    ) : null}
                    <div className="mt-4 w-full flex justify-between items-center">
                        <LoadingButton
                            theme="black"
                            loading={processing}
                            type="submit"
                        >
                            <span>Simpan</span>
                        </LoadingButton>
                        <LinkButton
                            href="#"
                            theme="blue"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowModal(false);
                            }}
                        >
                            <span>Close</span>
                        </LinkButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ModalEditProsespermohonan;
