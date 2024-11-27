import { Fragment, SyntheticEvent, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { OptionSelect } from '@/types'
import { twMerge } from 'tailwind-merge'


type Props = {
    options: OptionSelect[],
    className?: string,
    value?: string | undefined,
    onValueChange: (e: any) => void
}
export default function SearchableCombobox({ options, className, onValueChange, value }: Props) {
    const val = options.find(v => v.value.includes(value ? value : ''))

    const [selected, setSelected] = useState(val)
    const [query, setQuery] = useState('')

    const filteredOption =
        query === ''
            ? options
            : options.filter((person) =>
                person.label
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )
    const onChange = (e: any) => {
        const val = options.find(v => v === e)
        setSelected(val ? val : options[0])
        onValueChange(e)
    }
    return (
        <>
            <Combobox value={selected ? selected : ''} onChange={onChange}>
                <div className="relative">
                    <div className={twMerge("relative w-full cursor-default overflow-hidden bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm", className)} >
                        <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-8 text-sm leading-5 text-gray-900 focus:ring-0"
                            displayValue={(person: OptionSelect) => person.label}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                    >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {filteredOption.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none px-2 py-2 text-gray-700">
                                    Nothing value.
                                </div>
                            ) : (
                                filteredOption.map((person) => (
                                    <Combobox.Option
                                        key={person.value}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-3 pr-2 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                            }`
                                        }
                                        value={person}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                >
                                                    {person.label}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-2 ${active ? 'text-white' : 'text-teal-600'
                                                            }`}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </>
    )
}
