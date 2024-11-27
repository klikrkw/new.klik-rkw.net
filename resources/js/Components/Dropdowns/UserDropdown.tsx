import React, { useEffect, useRef } from "react";
import { createPopper } from "@popperjs/core";
import ResponsiveNavLink from "../ResponsiveNavLink";

const UserDropdown = () => {
    // dropdown props
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef<any>();
    const popoverDropdownRef = React.createRef<any>();
    const wrapperRef = useRef<any>(null);
    const openDropdownPopover = () => {
        createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "bottom-end",
        });
        setDropdownPopoverShow(true);
    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            //@ts-ignore
            if (
                wrapperRef.current &&
                wrapperRef.current.contains(event.target)
            ) {
                // closeDropdownPopover();
            } else {
                closeDropdownPopover();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    return (
        <div ref={wrapperRef}>
            <a
                className="text-blueGray-500 block"
                href="#pablo"
                ref={btnDropdownRef}
                onClick={(e) => {
                    e.preventDefault();
                    dropdownPopoverShow
                        ? closeDropdownPopover()
                        : openDropdownPopover();
                }}
            >
                <div className="items-center flex">
                    <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                        <img
                            alt="..."
                            className="w-full rounded-full align-middle border-none shadow-lg"
                            src={"/img/team-1-800x800.jpg"}
                        />
                    </span>
                </div>
            </a>
            <div
                ref={popoverDropdownRef}
                className={
                    (dropdownPopoverShow ? "block " : "hidden ") +
                    "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
                }
            >
                <a
                    href={route("profile.edit")}
                    className={
                        "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    }
                    // onClick={(e) => e.preventDefault()}
                >
                    <i className="fas fa-user"></i>
                    <span className="ml-2">Profile</span>
                </a>
                <div className="h-0 my-2 border border-solid border-blueGray-100" />
                <ResponsiveNavLink
                    method="post"
                    href={route("logout")}
                    as="button"
                    className={
                        "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    }
                >
                    <i className="fas fa-sign-out"></i>
                    <span className="ml-2">Log Out</span>
                </ResponsiveNavLink>
            </div>
        </div>
    );
};

export default UserDropdown;
