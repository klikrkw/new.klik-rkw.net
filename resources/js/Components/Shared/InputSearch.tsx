import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge';
import { usePrevious } from 'react-use';
import pickBy from 'lodash/pickBy';
import { router } from "@inertiajs/react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string,
    onChange: (e: any) => void,
    className?: string,
}


const InputSearch: React.FC<InputProps> = ({ value, onChange, className = '', ...props }) => {

    const params = new URLSearchParams(window.location.search);


    return (
        <div className={twMerge("relative mb-3", className)}>
            <input
                name="search"
                value={value}
                onChange={onChange}
                {...props}
                className={`border-0 px-2 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 `}
            />
        </div>
    )
}

export default InputSearch
