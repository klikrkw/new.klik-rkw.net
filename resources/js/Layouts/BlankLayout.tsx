import ToastMessages from "@/Components/Shared/ToastMessages";
import { PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const BlankLayout = ({
    children,
    className,
}: PropsWithChildren<{ header?: ReactNode; className?: string }>) => {
    return (
        <>
            <main>
                <section className="relative w-full h-full min-h-screen">
                    {/* <div
                        className="absolute top-0 w-full h-full bg-blueGray-50 bg-no-repeat bg-full"
                        style={{
                            backgroundImage: "url(" + "/img/register_bg_2.png" + ")"

                        }}
                    ></div> */}
                    <div className="container mx-auto px-4 py-4 h-full">
                        <ToastMessages />
                        {children}
                    </div>
                </section>
            </main>
        </>
    );
};

export default BlankLayout;
