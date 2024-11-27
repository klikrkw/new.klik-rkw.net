import React from "react";

type Props = {
    qrCode: any;
};
const Qrcode = ({ qrCode }: Props) => {
    return (
        <div className="flex justify-center items-center p-4">
            {qrCode ? (
                <img src={`/${qrCode}`} alt="" className="w-24 h-24" />
            ) : null}
        </div>
    );
};

export default Qrcode;
