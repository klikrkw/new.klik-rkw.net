import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Bars3BottomLeftIcon, Bars3Icon, ChevronDownIcon } from '@heroicons/react/20/solid'

type Props = {
    children: React.ReactNode,
    title?: string
}
export default function DropdownMenu({ children, title }: Props) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black/20 px-1 py-1 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                    {title ? <span>{title}</span> :
                        <Bars3Icon
                            className="m-auto h-5 w-5 text-violet-200 hover:text-violet-100"
                            aria-hidden="true"
                        />
                    }
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute z-50 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="px-1 py-1">
                        {children}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}


