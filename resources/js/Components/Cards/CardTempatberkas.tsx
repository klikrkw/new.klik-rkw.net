import React, { useCallback, useEffect, useState } from "react";
import apputils from "@/bootstrap";
import { Posisiberkas, Ruang, Tempatberkas } from "@/types";
import { useSetState } from "react-use";
import { on } from "events";

type SelectTempatberkas = {
    row: number;
    col: number;
    label: string;
    isDisabled: boolean;
    isSelected: boolean;
};
const CardTempatberkas = ({
    ctempatberkas,
    cposisiberkas,
    onSelectPosisiberkas,
}: {
    ctempatberkas: Tempatberkas;
    cposisiberkas: Posisiberkas | null | undefined;
    onSelectPosisiberkas: (posisiberkas: Posisiberkas | null) => void;
}) => {
    let buttons: SelectTempatberkas[] = [];
    for (
        let index = 0;
        index < ctempatberkas.row_count * ctempatberkas.col_count;
        index++
    ) {
        buttons.push({
            row: Math.floor(index / ctempatberkas.col_count) + 1,
            col: (index % ctempatberkas.col_count) + 1,
            label: (index + 1).toString(),
            isDisabled: false,
            isSelected: false,
        });
    }

    const [isloading, setIsloading] = useState<boolean>(false);
    const [posisiberkases, setPosisiberkases] = useState<Posisiberkas[] | []>(
        []
    );
    const [posisiberkas, setPosisiberkas] = useState<Posisiberkas | null>(null);

    const getPosisiberkases = useCallback(async () => {
        setIsloading(true);
        let xlink = `/posisiberkas/listbytempatberkas/${ctempatberkas.id}`;
        const response = await apputils.backend.get(xlink);
        const data = response.data;
        setPosisiberkases(data);
        setIsloading(false);
    }, [ctempatberkas]);
    useEffect(() => {
        getPosisiberkases();
    }, [getPosisiberkases]);
    let selectTempatberkases: SelectTempatberkas[] = [];

    const findPosisiberkas = (row: number, col: number) => {
        if (posisiberkases.length === 0) return;
        const tmp = posisiberkases.find(
            (item) => item.row === row && item.col === col
        );

        if (tmp) {
            setPosisiberkas(tmp);
            onSelectPosisiberkas(tmp);
        } else {
            setPosisiberkas(null);
            onSelectPosisiberkas(null);
        }
    };
    buttons.map((item, index) => {
        const tmp = posisiberkases.find(
            (itm) => itm.row === item.row && itm.col === item.col
        );
        if (tmp) {
            item.isSelected =
                posisiberkas?.row === item.row &&
                posisiberkas?.col === item.col;
            item.isDisabled = false;
            item.label = "Y";
        } else {
            item.isSelected = false;
            item.isDisabled = true;
            item.label = "N";
        }
        selectTempatberkases.push(item);
    });
    useEffect(() => {
        if (cposisiberkas) {
            setPosisiberkas(cposisiberkas);
        }
    }, [cposisiberkas]);

    return (
        <div className="mt-4 mb-4 flex flex-col">
            <h1>
                {ctempatberkas
                    ? `${ctempatberkas.nama_tempatberkas}`
                    : "Pilih Tempat Berkas"}
            </h1>
            <div
                className={[
                    "w-52 h-auto grid gap-2 border border-gray-300 rounded-md bg-gray-100 p-2",
                    `grid-cols-${ctempatberkas.col_count} gap-2`,
                ].join(" ")}
            >
                {selectTempatberkases.map((item, index) =>
                    item.isDisabled ? (
                        <div
                            className="bg-gray-300 text-gray-800 font-bold py-2 px-2 rounded flex justify-center items-center"
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
                                "bg-gray-300 hover:bg-gray-600 text-gray-800 font-bold py-2 px-2 rounded flex justify-center items-center",
                                item.isSelected ? "bg-gray-500" : "",
                            ].join(" ")}
                            key={index}
                            onClick={(e) => {
                                findPosisiberkas(item.row, item.col);
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

export default CardTempatberkas;
