import { NumberFormatBase } from "react-number-format";
import { NumberFormatBaseProps } from "react-number-format/types/types";
import { twMerge } from "tailwind-merge";

type IProps = {
    label?: string;
    errors?: string;
    className?: string;
};
type Props = NumberFormatBaseProps & IProps;

export default function MoneyInput(props: Props) {
    const format = (numStr: any) => {
        if (numStr === "") return "";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(numStr);
    };
    return (
        <div className={twMerge("relative w-full mb-3", props.className)}>
            {props.label && (
                <label
                    className={`block uppercase text-blueGray-600 text-xs font-bold mb-2 ${
                        props.errors ? "text-red-500" : ""
                    } `}
                >
                    {props.label}
                </label>
            )}
            {props.disabled ? (
                <div
                    className={`border-0 px-3 py-2 disabled:border-slate-200 disabled:shadow-none disabled:bg-slate-200  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 `}
                >
                    {format(props.value)}
                </div>
            ) : (
                <NumberFormatBase
                    {...props}
                    format={format}
                    className={`border-0 px-3 py-2 disabled:border-slate-200 disabled:shadow-none disabled:bg-slate-200  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 `}
                />
            )}
            {props.errors ? (
                <span className="text-sm text-red-500">{props.errors}</span>
            ) : null}
        </div>
    );
}
