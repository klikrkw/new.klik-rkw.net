import { usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
import { toast, Toaster, ToastBar, Toast } from "react-hot-toast";
const ToastMessages = () => {
    const { flash, errors } = usePage<any>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        } else if (flash.error) {
            toast.error(flash.error);
        } else if (flash.message) {
            toast(flash.message);
        }
    }, [flash]);
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
                // Define default options
                className: "",
                duration: 5000,
                style: {
                    background: "#363636",
                    color: "#fff",
                },

                // Default options for specific types
                success: {
                    style: {
                        background: "green",
                    },
                },
                error: {
                    style: {
                        background: "red",
                    },
                },
            }}
        >
            {(t) => (
                <ToastBar
                    toast={t}
                    style={{
                        ...t.style,
                    }}
                >
                    {({ icon, message }) => (
                        <>
                            {icon}
                            {message}
                            {t.type !== "loading" && (
                                <button
                                    className="text-sm border-none rounded-full shadow-sm hover:text-green-200"
                                    onClick={() => toast.dismiss(t.id)}
                                >
                                    x
                                </button>
                            )}
                        </>
                    )}
                </ToastBar>
            )}
        </Toaster>
    );
};

export default ToastMessages;
