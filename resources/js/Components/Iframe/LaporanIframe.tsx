import React, { useState } from "react";
import { createPortal } from "react-dom";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ThreeDots } from "react-loader-spinner";

type Props = {
    children?: React.ReactNode;
    title: string;
    src: string;
};
const LaporanIframe = ({ children, src, ...props }: Props) => {
    const [contentRef, setContentRef] = useState<any>(null);
    const [loadingIframe, setLoadingIframe] = useState(true);

    const cache = createCache({
        key: "css",
        container: contentRef?.contentWindow?.document?.head,
        prepend: true,
    });

    const mountNode = contentRef?.contentWindow?.document?.body;

    return (
        <CacheProvider value={cache}>
            <>
                <iframe
                    {...props}
                    ref={setContentRef}
                    className="w-full h-600-px"
                    src={src}
                    onLoad={() => setLoadingIframe(false)}
                    loading="lazy"
                >
                    {mountNode && createPortal(children, mountNode)}
                </iframe>
                {loadingIframe ? (
                    <div className="m-auto h-full w-full flex justify-center items-center absolute">
                        <ThreeDots
                            visible={true}
                            height="80"
                            width="80"
                            color="#4fa94d"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                ) : null}
            </>
        </CacheProvider>
    );
};

export default LaporanIframe;
