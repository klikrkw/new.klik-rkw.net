import { BaseSyntheticEvent, Fragment, SyntheticEvent, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";
import { OptionSelect } from "@/types";

type Props = {
    className?: string;
    listOptions: OptionSelect[];
    onListChange: (e: OptionSelect) => void;
};
export default function ListboxSelect({
    className,
    listOptions,
    onListChange,
}: Props) {
    const [selectedItem, setSelectedItem] = useState<OptionSelect>(
        listOptions[0]
    );
    const onChange = (e: OptionSelect) => {
        setSelectedItem(e);
        onListChange(e);
    };
    return (
        <div className={twMerge("relative w-full", className)}>
            <Listbox value={selectedItem} onChange={onChange}>
                <div className="relative">
                    <Listbox.Button className="relative w-full cursor-default rounded-l-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">
                            {selectedItem.label}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {listOptions.map(
                                (
                                    listOption: OptionSelect,
                                    listOptionIdx: number
                                ) => (
                                    <Listbox.Option
                                        key={listOptionIdx}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-4 pr-4 ${
                                                active
                                                    ? "bg-amber-100 text-amber-900"
                                                    : "text-gray-900"
                                            }`
                                        }
                                        value={listOption}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? "font-bold"
                                                            : "font-normal"
                                                    }`}
                                                >
                                                    {listOption.label}
                                                </span>
                                                {/* {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                        <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null} */}
                                            </>
                                        )}
                                    </Listbox.Option>
                                )
                            )}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
}
