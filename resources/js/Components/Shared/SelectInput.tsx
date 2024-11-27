import React from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    name: string;
    className?: string;
    children: React.ReactNode;
    errors?: [];
}

const SelectInput: React.FC<InputProps> = ({
    label = "",
    name = "",
    className = "",
    children = null,
    errors = [],
    ...props
}) => {
    return (
        <div className={twMerge("relative w-full mb-3", className)}>
            {label && (
                <label className="form-label" htmlFor={name}>
                    {label}:
                </label>
            )}
            <select
                id={name}
                name={name}
                {...props}
                className={`border-0 px-3 py-2 disabled:bg-blueGray-200 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150  ${
                    errors.length ? "error" : ""
                }`}
            >
                {children}
            </select>
            {errors && <div className="form-error">{errors}</div>}
        </div>
    );
};

export default SelectInput;
