import { Fragment, SyntheticEvent, useCallback, useMemo, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { OptionSelect, Permohonan, TPermohonan } from '@/types'
import { twMerge } from 'tailwind-merge'
import useSWR from 'swr'
import apputils from '@/bootstrap';
import ListboxSelect from './ListboxSelect'
import { resolve } from 'path'

type Props = {
    className?: string,
    value?: string | unknown,
    onValueChange: (e: Permohonan, opt: OptionSelect) => void
}
export default function MultiColumnSelect({ className, onValueChange, value }: Props) {
    const [selectedPerson, setSelectedPerson] = useState<Permohonan | undefined>(undefined,);
    const listOptions: OptionSelect[] = [
        { label: 'All', value: '' },
        { label: 'Penerima', value: 'nama_penerima' },
        { label: 'Pelepas', value: 'nama_pelepas' },
        { label: 'No Hak', value: 'nomor_hak' },
        { label: 'No Daftar', value: 'nodaftar_permohonan' },
    ]
    const [searchKey, setSearchKey] = useState<string>('')

    function LoadingSpinner() {
        return (
            <svg
                className="h-5 w-5 animate-spin text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        );
    }
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    async function fetcher(url: string, query: string | unknown): Promise<Permohonan[]> {
        if (searchKey) {
            const result = await apputils.backend.get(`${url}?search=${query}&search_key=${searchKey}`);
            return result.data
        } else {
            const result = await apputils.backend.get(`${url}?search=${query}`);
            return result.data
        }
    }

    const [query, setQuery] = useState('')
    const { data: filteredOption, error } = useSWR<Permohonan[]>(['/admin/permohonans/api/list/', query], ([url, query]) => fetcher(url, query));

    const isLoading = !error && !filteredOption;


    const onChange = (e: Permohonan) => {
        setSelectedPerson((prev) => prev ? e : undefined)
        onValueChange(e, listOptions[0])
    }
    const comparePeople = (a?: Permohonan, b?: Permohonan): boolean =>
        a?.nama_penerima.toLowerCase() === b?.nama_penerima.toLowerCase();
    return (
        <>
            <Combobox
                value={selectedPerson}
                by={comparePeople}
                onChange={onChange}
            >
                <div className="relative">
                    <div className={twMerge("relative overflow-visible flex w-full cursor-default bg-white text-left rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm", className)} >
                        <ListboxSelect className='w-2/5' listOptions={listOptions} onListChange={(e) => setSearchKey(e.value)} />
                        <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-8 text-sm leading-5 text-gray-900 focus:ring-0 rounded-r-lg"
                            displayValue={(permohonan: Permohonan) => permohonan?.nama_penerima ?? ''}
                            onChange={(event) => setQuery(event.target.value)}
                            autoComplete={'off'}

                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            {isLoading && <LoadingSpinner />}
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
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full md:w-[100vh] overflow-auto rounded-md bg-white py-0 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-xs">
                            {
                                filteredOption && filteredOption.length > 0 ? (<div className={`flex flex-row p-2 w-full font-bold bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700`}>
                                    <div className='w-1/3'>No Daftar</div><div className='w-3/5'>Pelepas</div><div className='w-3/5'>Penerima</div><div className='w-3/5'>Alas Hak</div><div className='w-60'>Luas</div><div className='w-full'>Letak</div>
                                </div>) : null
                            }
                            {filteredOption && filteredOption.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none px-2 py-2 text-gray-700">
                                    Nothing value.
                                </div>
                            ) : (
                                filteredOption && filteredOption.map((permohonan: Permohonan) => (

                                    <Combobox.Option
                                        key={permohonan.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none pr-2 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                            }`
                                        }
                                        value={permohonan}
                                    >
                                        {({ selected, active }) => (
                                            <div className={`flex flex-row p-2 w-full ${selected ? 'font-bold' : ''}`}>
                                                {/* {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-2 ${active ? 'text-white' : 'text-teal-600'
                                                            }`}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null} */}
                                                <div className='w-1/3'>
                                                    {permohonan.no_daftar}
                                                </div>
                                                <div className='w-3/5'>
                                                    {permohonan.nama_pelepas}
                                                </div>
                                                <div className='w-3/5'>
                                                    {permohonan.nama_penerima}
                                                </div>
                                                <div className='w-3/5'>
                                                    {permohonan.nomor_hak}
                                                </div>
                                                <div className='w-60'>
                                                    {permohonan.luas_tanah} m2
                                                </div>
                                                <div className='w-full'>
                                                    {permohonan.letak_obyek}
                                                </div>

                                            </div>
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
