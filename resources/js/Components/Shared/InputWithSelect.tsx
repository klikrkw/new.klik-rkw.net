import { OptionSelect } from '@/types';
import { Combobox } from '@headlessui/react';
import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge';
import SearchableCombobox from './SearchableCombobox';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string,
    comboboxValue: string,
    onInputChange: (e: any, v: string) => void,
    onSelecChange: (e: any) => void,
    className?: string,
}


const InputWithSelect: React.FC<InputProps> = ({ value, comboboxValue, onInputChange, onSelecChange, className = '', ...props }) => {

    // const params = new URLSearchParams(window.location.search);

    const options: OptionSelect[] = [
        { value: '', label: '-- All --' },
        { value: 'nomor_hak', label: 'Nomor Hak' },
        { value: 'nama_pelepas', label: 'Nama Pelepas' },
        { value: 'nama_penerima', label: 'Nama Penerima' },
    ]

    const [selectValue, setSelectValue] = useState(options[0])

    return (
        <div className={twMerge("flex w-full items-start relative mb-3 gap-0 ", className)}>
            {/* <select name="input-select" id="input-select" value={selectValue.value} onChange={(e: any) => {
                const val = options.find(v => v.value === e.target.value)
                setSelectValue(val ? val : options[0])
                onSelecChange(e)
            }
            }
                className={`border-0 border-r-2 border-gray-300 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded-tl-md rounded-bl-md text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 `}
            >
                {
                    options.map((v, i) => (
                        <option key={i} value={v.value}>{v.label}</option>
                    ))
                }
            </select> */}
            <SearchableCombobox options={options} className='rounded-tl-md rounded-bl-md w-full' value={comboboxValue} onValueChange={(e: any) => {
                const val = options.find(v => v.value === e.value)
                setSelectValue(val ? val : options[0])
                onSelecChange(e)
            }} />
            <input
                name="search"
                value={value}
                onChange={(e) => onInputChange(e, selectValue.value)}
                autoComplete={'off'}
                {...props}
                className={`border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded-tr-md rounded-br-md text-sm shadow focus:outline-none focus:ring w-3/5 ease-linear transition-all duration-150 `}
            />
        </div >
    )
}

export default InputWithSelect
