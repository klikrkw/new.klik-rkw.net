import React, { useCallback, useEffect, useState } from "react";
import apputils from "@/bootstrap";
import { Ruang, Tempatarsip } from "@/types";
import { useSetState } from "react-use";
import { on } from "events";

type SelectTempatarsip = {
    row: number;
    col: number;
    label: string;
    isDisabled: boolean;
    isSelected: boolean;
};
const CardTempatarsip = ({
    ruangId,
    ctempatarsip,
    onSelectTempatarsip,
}: {
    ruangId: string;
    ctempatarsip: Tempatarsip | null | undefined;
    onSelectTempatarsip: (tempatarsip: Tempatarsip | null) => void;
}) => {
    let buttons: SelectTempatarsip[] = [];
    for (let index = 0; index < 12; index++) {
        buttons.push({
            row: Math.floor(index / 3) + 1,
            col: (index % 3) + 1,
            label: (index + 1).toString(),
            isDisabled: false,
            isSelected: false,
        });
    }

    const [isloading, setIsloading] = useState<boolean>(false);
    const [tempatarsips, setTempatarsips] = useState<Tempatarsip[] | []>([]);
    const [tempatarsip, setTempatarsip] = useState<Tempatarsip | null>(null);

    const getTempatarsips = useCallback(async () => {
        setIsloading(true);
        let xlink = `/tempatarsips/listbyruang/${ruangId}`;
        const response = await apputils.backend.get(xlink);
        const data = response.data;
        setTempatarsips(data);
        setIsloading(false);
    }, [ruangId]);
    useEffect(() => {
        getTempatarsips();
    }, [getTempatarsips]);
    let selectTempatarsips: SelectTempatarsip[] = [];

    const findTempatarsip = (row: number, col: number) => {
        if (tempatarsips.length === 0) return;
        const tmp = tempatarsips.find(
            (item) => item.baris === row && item.kolom === col
        );

        if (tmp) {
            setTempatarsip(tmp);
            onSelectTempatarsip(tmp);
        } else {
            setTempatarsip(null);
            onSelectTempatarsip(null);
        }
    };
    buttons.map((item, index) => {
        const tmp = tempatarsips.find(
            (itm) => itm.baris === item.row && itm.kolom === item.col
        );
        if (tmp) {
            item.isSelected =
                tempatarsip?.baris === item.row &&
                tempatarsip?.kolom === item.col;
            item.isDisabled = false;
            item.label = "Y";
        } else {
            item.isSelected = false;
            item.isDisabled = true;
            item.label = "N";
        }
        selectTempatarsips.push(item);
    });
    useEffect(() => {
        if (ctempatarsip) {
            setTempatarsip(ctempatarsip);
        }
    }, [ctempatarsip]);

    return (
        <div className="mt-4 mb-4 flex flex-col">
            <h1>
                {tempatarsip
                    ? `${tempatarsip.nama_tempatarsip}`
                    : "Pilih Tempat Berkas"}
            </h1>
            <div className="w-52 h-auto flex justify-between items-center p-1 flex-wrap gap-1 border border-gray-300 rounded-md bg-gray-100 ">
                {selectTempatarsips.map((item, index) =>
                    item.isDisabled ? (
                        <div
                            className="bg-gray-300 text-gray-800 font-bold py-2 px-2 rounded flex justify-center items-center w-[31%]"
                            key={index}
                        >
                            <div className="p-1 rounded-full w-10 h-10 bg-gray-800 flex items-center justify-center">
                                <span className="text-white text-md">
                                    {item.row}|{item.col}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <a
                            href="#"
                            className={[
                                "bg-gray-300 hover:bg-gray-600 text-gray-800 font-bold py-2 px-2 rounded flex justify-center items-center w-[31%]",
                                item.isSelected ? "bg-gray-500" : "",
                            ].join(" ")}
                            key={index}
                            onClick={(e) => {
                                findTempatarsip(item.row, item.col);
                            }}
                        >
                            <div className="p-1 rounded-full w-10 h-10 bg-gray-800 flex items-center justify-center">
                                <span className="text-white text-md">
                                    {item.row}|{item.col}
                                </span>
                            </div>
                        </a>
                    )
                )}
            </div>
        </div>
    );
};

export default CardTempatarsip;
