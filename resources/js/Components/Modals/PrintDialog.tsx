import React, { useState } from "react";
import Modal from "./Modal";
import Input from "../Shared/Input";
import NumberInput from "../Shared/NumberInput";
import { PrintData } from "@/types";
import Button from "../Shared/Button";
import SelectInput from "../Shared/SelectInput";

type Props = {
    showModal: boolean;
    setShowModal: (e: boolean) => void;
    onCommit: (formdata: PrintData) => void;
};

const PrintDialog = ({ showModal, setShowModal, onCommit }: Props) => {
    const [formData, setFormData] = useState<PrintData>({
        col: "1",
        row: "1",
    });
    return (
        <Modal
            show={showModal}
            maxWidth="md"
            closeable={true}
            onClose={() => setShowModal(false)}
        >
            <div className="p-4 bg-blueGray-100 rounded-md">
                <h1 className="font-bold text-xl text-blueGray-700 mb-4">
                    CETAK QR CODE
                </h1>
                <div className="flex flex-col p-4">
                    <SelectInput
                        label="Baris"
                        name="row"
                        value={formData.row}
                        onChange={(e) =>
                            setFormData({ ...formData, row: e.target.value })
                        }
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </SelectInput>
                    <SelectInput
                        label="Kolom"
                        name="col"
                        value={formData.col}
                        onChange={(e) =>
                            setFormData({ ...formData, col: e.target.value })
                        }
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </SelectInput>
                    <Button theme="black" onClick={(e) => onCommit(formData)}>
                        <i className="fas fa-print"></i>
                        <span className="ml-2">Cetak</span>
                    </Button>
                </div>
            </div>

            <div className="w-full absolute right-1 top-1 flex justify-end items-center px-1 ">
                <button
                    className="text-blueGray-700 background-transparent font-bold uppercase px-0 py-0 text-xl outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={(e) => setShowModal(false)}
                >
                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                </button>
            </div>
        </Modal>
    );
};
export default PrintDialog;
