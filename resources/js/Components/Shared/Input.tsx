import React, {
    ComponentProps,
    ComponentPropsWithRef,
    ForwardedRef,
    LegacyRef,
    useEffect,
} from "react";
import { twMerge } from "tailwind-merge";
// React.InputHTMLAttributes<HTMLInputElement>
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    name: string;
    className?: string;
    autoComplete?: string;
    errors?: string | undefined;
    focused?: boolean;
}
// type InputProps = React.HTMLProps<HTMLInputElement>
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            errors,
            className,
            focused,
            name,
            autoComplete = "off",
            ...props
        },
        ref: any
    ) => {
        useEffect(() => {
            if (focused) ref.current.focus();
            // console.log('first')
        }, []);

        return (
            <div className={twMerge("relative w-full mb-3", className)}>
                {label && (
                    <label
                        className={`block uppercase text-blueGray-600 text-xs font-bold mb-2 ${
                            errors ? "text-red-500" : ""
                        } `}
                    >
                        {label}
                    </label>
                )}
                {props.disabled ? (
                    <div
                        className={`border-0 px-3 py-2 border-slate-500  bg-slate-300  placeholder-blueGray-300 text-blueGray-600  rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 `}
                    >
                        {props.value}
                    </div>
                ) : (
                    <input
                        id={name}
                        ref={ref}
                        name={name}
                        autoComplete={autoComplete}
                        {...props}
                        className={`border-0 px-3 py-2 disabled:bg-blueGray-200 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 `}
                    />
                )}
                {errors ? (
                    <span className="text-sm text-red-500">{errors}</span>
                ) : null}
            </div>
        );
    }
);

export default Input;
