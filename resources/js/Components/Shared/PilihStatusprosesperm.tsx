import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Statusprosesperm } from "@/types";

export default function Pilihstatusprosesperm({
    statusprosesperms,
    statusprosesperm,
    setStatusprosesperm,
}: {
    statusprosesperms: Statusprosesperm[];
    statusprosesperm: Statusprosesperm | undefined;
    setStatusprosesperm: (e: Statusprosesperm) => void;
}) {
    return (
        <div className="mx-auto w-full max-w-md mb-2">
            <RadioGroup value={statusprosesperm} onChange={setStatusprosesperm}>
                <RadioGroup.Label className="sr-only">
                    Server size
                </RadioGroup.Label>
                <div className="space-y-2">
                    {statusprosesperms.map((item) => (
                        <RadioGroup.Option
                            key={item.id}
                            value={item}
                            className={({ active, checked }) =>
                                `${
                                    active
                                        ? "ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300"
                                        : ""
                                }
                  ${checked ? "bg-sky-700/75 text-white" : "bg-white"}
                    relative flex cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none`
                            }
                        >
                            {({ active, checked }) => (
                                <>
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="text-sm">
                                                <RadioGroup.Label
                                                    as="p"
                                                    className={`flex gap-2 items-center font-medium  ${
                                                        checked
                                                            ? "text-white"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    <img
                                                        src={
                                                            item.image_statusprosesperm
                                                        }
                                                        className="w-7 h-auto rounded-full"
                                                    />
                                                    <span>
                                                        {
                                                            item.nama_statusprosesperm
                                                        }
                                                    </span>
                                                </RadioGroup.Label>
                                            </div>
                                        </div>
                                        {checked && (
                                            <div className="shrink-0 text-white">
                                                <CheckIcon className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </RadioGroup.Option>
                    ))}
                </div>
            </RadioGroup>
        </div>
    );
}

function CheckIcon(props: any) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
            <path
                d="M7 13l3 3 7-7"
                stroke="#fff"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
