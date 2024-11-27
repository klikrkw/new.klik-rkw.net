import React, { useEffect, useState } from "react";

const MenuItem = ({
    expanded = true,
    label,
    children,
}: {
    expanded: boolean;
    label: string;
    children: React.ReactNode;
}) => {
    const [expand, setExpand] = useState(expanded);
    return (
        <>
            <ul
                className={`md:flex-col md:min-w-full flex flex-col list-none relative`}
            >
                <li
                    className={
                        "items-center px-2 " +
                        (expand ? "bg-lightBlue-100 rounded-md " : "")
                    }
                >
                    <a
                        href="#"
                        className={
                            "text-xs uppercase py-3 font-bold flex flex-row justify-start items-center w-full transition-all duration-150 " +
                            (window.location.href.indexOf("/admin/settings") !==
                            -1
                                ? "text-lightBlue-500 hover:text-lightBlue-600"
                                : "text-blueGray-700 hover:text-blueGray-500")
                            // +
                            // (expand ?
                            //     " bg-blueGray-200 rounded-md px-2" : "")
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            setExpand(!expand);
                        }}
                    >
                        <i
                            className={
                                "fas fa-tools mr-2 text-sm " +
                                (expand ? "opacity-75" : "text-blueGray-300")
                            }
                        ></i>
                        <div className="flex-1 uppercase w-auto">{label}</div>
                        <i
                            className={`fa-solid ${
                                expand ? "fa-chevron-up" : "fa-chevron-down"
                            }`}
                        ></i>
                    </a>
                </li>
                <div
                    className={`relative duration-100 delay-75 transition-all origin-top ease-in-out overflow-hidden ${
                        expand ? "translateY(100%)" : "translateY(0%)"
                    }`}
                >
                    <div
                        className={`duration-100 delay-75 transition-all origin-top ease-in-out overflow-hidden rounded-md mt-2 relative ${
                            // expand ? "h-full scale-y-100" : "h-0 scale-y-0"
                            expand
                                ? "translateY(100%) h-full"
                                : "translateY(0%) h-0"
                        }`}
                    >
                        {children}
                    </div>
                </div>
            </ul>
        </>
    );
};

export default MenuItem;
