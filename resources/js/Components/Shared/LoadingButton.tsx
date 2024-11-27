import React from "react";
import cx from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    theme?: "blue" | "black" | "blueGray" | "red";
    loading: boolean;
    className?: string;
    errors?: string;
    buttonClass?: string;
    children: React.ReactNode;
}

export const LoadingButton: React.FC<ButtonProps> = ({
    theme = "blueGray",
    loading,
    className,
    children,
    ...props
}) => {
    let css = "";
    if (theme === "blue") {
        css =
            "bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md mb-1 outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ";
    } else if (theme === "black") {
        css =
            "bg-blueGray-800 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md mb-1 outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ";
    } else if (theme === "red") {
        css =
            "bg-red-800 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md mb-1 outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ";
    } else {
        css =
            "bg-white active:bg-blueGray-50 text-blueGray-700 font-bold px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150 ";
    }

    const classNames = cx(
        "flex items-center",
        "focus:outline-none",
        {
            "pointer-events-none bg-opacity-75 select-none ": loading,
        },
        css,
        className
    );
    return (
        <button disabled={loading} className={classNames} {...props}>
            {loading && <div className="mr-2 btn-spinner" />}
            {children}
        </button>
    );
};
