import { omit } from "lodash";
import React, { HtmlHTMLAttributes, RefAttributes, useEffect } from "react";
import Select, {
    GroupBase,
    MultiValue,
    OnChangeValue,
    Props,
    SelectInstance,
} from "react-select";
import { twMerge } from "tailwind-merge";

// interface InputProps extends React.HTMLAttributes<HTMLSelectElement | HTMLInputElement> {
//     label: string,
//     name: string,
//     className?: string,
//     errors: string | undefined,
//     isClearable?: boolean,
// }
type SelectProps<
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>
> = Props<Option, IsMulti, Group> & {
    label?: string;
    id?: string;
    className?: string;
    errors?: string | undefined;
    isClearable?: boolean;
    xref?: any;
    focused?: boolean;
};
const SelectSearch = <
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>
>(
    props: SelectProps<Option, IsMulti, Group>
) => {
    const id = props.id || Math.random().toString();
    const reactSelectProps = omit(props, ["label", "className"]);
    useEffect(() => {
        if (props.focused) props.xref.current.focus();
        // console.log('first')
    }, []);

    return (
        <div className={twMerge("relative w-full mb-2", props.className)}>
            {props.label && (
                <label
                    htmlFor={id}
                    className={`block uppercase text-blueGray-600 text-xs font-bold mb-2 ${
                        props.errors ? "text-red-500" : ""
                    } `}
                >
                    {props.label}
                </label>
            )}
            <Select
                ref={props.xref}
                className="shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                {...reactSelectProps}
                theme={(theme) => ({
                    ...theme,
                    // colors: {
                    //     ...theme.colors,
                    //     primary: "var(--primary-500)",
                    // },
                })}
            />
            {props.errors ? (
                <span className="text-sm text-red-500">{props.errors}</span>
            ) : null}
        </div>
    );
};

export default SelectSearch;

// const SelectSearch: React.FC<InputProps> = ({
//     label = '',
//     name = '',
//     className = '',
//     errors = [],
//     ...props
// }) => {
//     return (
//         <div className={twMerge("relative w-full mb-3", className)}>
//             {label && (
//                 <label
//                     className={`block uppercase text-blueGray-600 text-xs font-bold mb-2 `}
//                     htmlFor={name}>
//                     {label}:
//                 </label>
//             )}
//             <Select
//                 name={name}
//                 id={name}
//                 {...props}
//                 className='shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150' />
//             {errors && <div className="form-error">{errors}</div>}
//         </div>
//     );
// };

// export default SelectSearch;
