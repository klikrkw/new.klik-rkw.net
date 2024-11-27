import { useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ArchiveBoxIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, DocumentDuplicateIcon } from "@heroicons/react/20/solid";

const people = [
    { id: 1, name: "Durward Reynolds" },
    { id: 2, name: "Kenton Towne" },
    { id: 3, name: "Therese Wunsch" },
    { id: 4, name: "Benedict Kessler" },
    { id: 5, name: "Katelyn Rohan" },
];

function DropdownMenu() {


    return (
        <div className="w-full flex justify-end">
            <Menu as="div" className="relative">
                {({ open }) => (
                    <Fragment>
                        <Menu.Button className={`inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none
                focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500`}>
                            Option Menu
                            {open ? <ChevronUpIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" /> : <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />}

                        </Menu.Button>
                        <Transition show={open}
                            enter="transform transition duration-100 ease-in"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transform transition duration-75 ease-out"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none" static>
                                <Menu.Item>
                                    {({ active, disabled }) => (
                                        <a href="#" className={`flex items-center px-4 py-2 text-sm ${disabled ? "text-gray-300" :
                                            active ? "bg-indigo-500 text-white" : "text-gray-700"} `} aria-hidden="true">
                                            <DocumentDuplicateIcon className={`mr-3 h-5 ${active ? "text-white" : "text-gray-400"} `} aria-hidden="true" />
                                            Duplicate
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item disabled>
                                    {({ active, disabled }) => (
                                        <a href="#" className={`flex items-center px-4 py-2 text-sm ${disabled ? "text-gray-300" :
                                            active ? "bg-indigo-500 text-white" : "text-gray-700"} `} aria-hidden="true">
                                            <ArchiveBoxIcon className={`mr-3 h-5 ${disabled ? "text-gray-200" : active ? "text-white" : "text-gray-400"} `} aria-hidden="true" />
                                            Duplicate
                                        </a>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Fragment>
                )}
            </Menu>
        </div>
    )
}
export default DropdownMenu;
