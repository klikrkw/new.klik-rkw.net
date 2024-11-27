import { Jenispermohonan, OptionSelect, OptionSelectActive } from "@/types";
import React, { SyntheticEvent, useState } from "react";
import { MultiValue } from "react-select";

type Props = {
    list: MultiValue<OptionSelectActive>;
    onItemChange: (v: string) => void;
};

const ListCheckbox = ({ list, onItemChange }: Props) => {
    return (
        <div className="w-full px-2 py-2 mb-2 border rounded-md shadow-md flex flex-row flex-wrap">
            {list.map((lst, i: number) => (
                <div key={i}>
                    <input
                        type="radio"
                        value={lst.value}
                        checked={lst.active}
                        onChange={(e) => onItemChange(e.target.value)}
                    />
                    <span className="mx-2">{lst.label}</span>
                </div>
            ))}
        </div>
    );
};

export default ListCheckbox;
