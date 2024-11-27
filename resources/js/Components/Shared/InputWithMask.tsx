import React, { InputHTMLAttributes } from 'react';

import InputMask, { BeforeMaskedStateChangeStates, InputState, ReactInputMask } from "react-input-mask"
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    maskPlaceholder?: string | null | undefined,
    beforeMaskedStateChange: ((states: BeforeMaskedStateChangeStates) => InputState) | undefined,
    mask: (string | RegExp)[],
    className?: string,
    label?: string,
    errors?: string,
    autoComplete?: string,
}

const InputWithMask: React.FC<InputProps> = ({
    maskPlaceholder,
    beforeMaskedStateChange,
    mask,
    className,
    label,
    errors,
    autoComplete = 'off',
    ...rest
}: InputProps) => {

    return (
        <div className={twMerge("relative w-full mb-3", className)}>
            {label && (<label
                className={`block uppercase text-blueGray-600 text-xs font-bold mb-2 ${errors ? 'text-red-500' : ''} `}
            >
                {label}
            </label>)}

            <InputMask
                mask={mask}
                autoComplete={autoComplete}
                maskPlaceholder={maskPlaceholder}
                className={`border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 `}
                {...rest}
            />
            {errors ? <span className='text-sm text-red-500'>{errors}</span> : null}
        </div>

    );
};

export default InputWithMask;
