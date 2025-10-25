import React from "react";
declare const window: {
    parent: { parentCallback: (permohonan: object | undefined) => void };
} & Window;

const ModalAddbiaya = () => {
    const closeDialog = async (id: string) => {
        const perm: object = { id: 1 };
        if (perm) {
            window.parent.parentCallback(perm);
        } else {
            window.parent.parentCallback(undefined);
        }
    };

    return <div>ModalAddbiaya</div>;
};

export default ModalAddbiaya;
