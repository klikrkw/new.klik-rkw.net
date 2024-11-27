import ReactInputMask from "react-input-mask";
import { NumberFormatBaseProps } from "react-number-format/types/types";
import { id } from "date-fns/locale";
import ReactDatePicker from "react-datepicker";
import { twMerge } from "tailwind-merge";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

type Props = NumberFormatBaseProps & {
    selected: string;
    value: string;
    onChange: (e: any) => void;
    errors?: string;
    label?: string;
    className?: string;
    showTimeSelect?: boolean;
    customDateFormat?: string;
};
export default function DateInput(props: Props) {
    // /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
    const mask = [/\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
    // [/\d/, /\d/, "\-", /\d/, /\d/, "\-", /\d/, /\d/, /\d/, /\d/]
    const format = (numStr: any) => {
        if (numStr === "") return "";
        return new Intl.NumberFormat("id-ID", {
            maximumFractionDigits: 0,
        }).format(numStr);
    };
    return (
        <div
            className={twMerge(
                "relative w-full text-black flex flex-col ",
                props.className
            )}
        >
            {props.label && (
                <label
                    className={`block uppercase text-blueGray-600 text-sm font-bold ${
                        props.errors ? "text-red-500" : ""
                    } `}
                >
                    {props.label}
                </label>
            )}

            <ReactDatePicker
                selected={moment(props.selected).toDate()}
                value={
                    props.customDateFormat
                        ? moment(props.value).format(props.customDateFormat)
                        : moment(props.value).format("DD-MMM-YYYY")
                }
                showTimeSelect={props.showTimeSelect}
                dateFormat="DD/MM/yyyy"
                // renderMonthContent={renderMonthContent}
                // showMonthYearPicker
                // dateFormat={
                //     props.customDateFormat
                //         ? props.customDateFormat
                //         : "DD/MM/yyyy"
                // }
                className="px-3 py-2 placeholder-blueGray-300 rounded text-blueGray-600 border-blueGray-300 bg-white text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                onChange={props.onChange}
            />

            {props.errors ? (
                <span className="text-sm text-red-500">{props.errors}</span>
            ) : null}
        </div>
    );
    // return <NumberFormatBase {...props} format={format} />;
}
