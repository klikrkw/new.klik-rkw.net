import {
    CashActiveIcon,
    CashInactiveIcon,
    DeleteActiveIcon,
    DeleteInactiveIcon,
    EditActiveIcon,
    EditInactiveIcon,
} from "@/Components/Icon";
import ModalBayarBiayaperm from "@/Components/Modals/ModalBayarBiayaperm";
import ModalBayarbiayaperms from "@/Components/Modals/ModalBayarbiayaperms";
import ModalEditBiayaperm from "@/Components/Modals/ModalEditBiayaperm";
import ModalRincianbiayaperms from "@/Components/Modals/ModalRincianbiayaperms";
import DropdownMenu from "@/Components/Shared/DropdownMenu";
import { OptionSelect, Biayaperm, OptionSelectDisabled } from "@/types";
import useSwal from "@/utils/useSwal";
import { Menu } from "@headlessui/react";
import { ListBulletIcon } from "@heroicons/react/20/solid";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { router, useForm, usePage } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useEffect, useState } from "react";
import { Lightbox } from "react-modal-image";
import { usePrevious } from "react-use";

type Props = {
    biayaperms: Biayaperm[];
};

function CardTableBiayaperms({ biayaperms }: Props) {
    const handleRemoveData = (biayaperm_id: string) => {
        router.delete(route("transaksi.biayaperms.destroy", [biayaperm_id]));
    };
    const params = new URLSearchParams(window.location.search);
    const { permohonan_id, transpermohonan_id } = usePage<any>().props;
    const [values, setValues] = useState({
        permohonan_id,
        transpermohonan_id,
        biayaperm_id: params.get("biayaperm_id"),
    });
    const prevValues = usePrevious(values);

    const [showModalBiayaperm, setShowModalBiayaperm] = useState(false);
    const [showModalBayarbiayaperm, setShowModalBayarbiayaperm] =
        useState(false);
    const [showModalBayarbiayaperms, setShowModalBayarbiayaperms] =
        useState(false);
    const [showModalRincianbiayaperms, setShowModalRincianbiayaperms] =
        useState(false);
    const [biayapermId, setBiayapermId] = useState<string>();
    const { biayaperm } = usePage<{ biayaperm: Biayaperm }>().props;
    useEffect(() => {
        if (prevValues) {
            const query = Object.keys(pickBy(values)).length
                ? pickBy(values)
                : {};
            router.get(
                route(route().current() ? route().current() + "" : ""),
                query,
                {
                    replace: true,
                    preserveState: true,
                    // only: ['biayaperm']
                }
            );
        }
    }, [values]);
    const [viewImage, setViewImage] = useState<boolean>(false);
    const [image, setImage] = useState<string | null>(null);

    return (
        <div className="w-full mt-4">
            <div className="flex flex-row w-full px-4 justify-center items-center rounded-t-md text-xs bg-lightBlue-600 border-blueGray-400 py-2  text-lightBlue-50 font-semibold">
                <div className="w-[5%]">No</div>
                <div className="w-[10%]">Tanggal</div>
                <div className="w-[25%] md:w-[12%]">Jumlah Biaya</div>
                <div className="w-[25%] md:w-[12%]">Jumlah Bayar</div>
                <div className="w-[25%] md:w-[12%]">Kurang Bayar</div>
                <div className="hidden md:block w-[20%]">Catatan</div>
                <div className="hidden md:flex md:w-[9%]">Image</div>
                <div className="hidden md:flex md:w-[10%]">User</div>
                <div className="w-[10%] flex justify-center items-center">
                    <span>Menu</span>
                </div>
            </div>
            <ul className="list-none container-snap max-h-80 overflow-x-hidden rounded-b-md">
                {biayaperms &&
                    biayaperms.map((biayaperm: Biayaperm, index: number) => (
                        <li
                            key={biayaperm.id}
                            className="w-full flex flex-col overflow-hidden bg-lightBlue-100 px-4 border-b-2 border-lightBlue-200"
                        >
                            <div className="flex text-xs py-2 items-center justify-center font-semibold text-lightBlue-600 ">
                                <div className="w-[5%] ">{index + 1}</div>
                                <div className="w-[10%]">
                                    {biayaperm.tgl_biayaperm}
                                </div>
                                <div className="w-[20%] md:w-[12%]">
                                    {biayaperm.jumlah_biayaperm}
                                </div>
                                <div className="w-[20%] md:w-[12%]">
                                    {biayaperm.jumlah_bayar}
                                </div>
                                <div className="w-[20%] md:w-[12%]">
                                    {biayaperm.kurang_bayar}
                                </div>
                                <div className="hidden md:block md:w-[20%]">
                                    {biayaperm.catatan_biayaperm}
                                </div>
                                <div className="hidden md:block md:w-[9%]">
                                    {biayaperm.image_biayaperm && (
                                        <button
                                            onClick={() => {
                                                setImage(
                                                    biayaperm.image_biayaperm
                                                );
                                                setViewImage(true);
                                            }}
                                        >
                                            <i
                                                className={
                                                    "fas fa-image mr-2 text-sm cursor-pointer"
                                                }
                                            ></i>
                                        </button>
                                    )}
                                </div>
                                <div className="hidden md:flex md:w-[10%]">
                                    <span>{biayaperm.user.name}</span>
                                </div>
                                <div className="w-[10%] flex justify-center items-center">
                                    <div className="absolute">
                                        <DropdownMenu>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        className={`${
                                                            active
                                                                ? "bg-violet-500 text-white"
                                                                : "text-gray-900"
                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                        onClick={(e) => {
                                                            // setValues((prev) => ({ ...prev, biayaperm_id: biayaperm.id }))
                                                            setBiayapermId(
                                                                biayaperm.id
                                                            );
                                                            setShowModalRincianbiayaperms(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        {active ? (
                                                            <ListBulletIcon
                                                                className="mr-2 h-4 w-4"
                                                                stroke="#C4B5FD"
                                                                fill="none"
                                                                strokeWidth={2}
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            <ListBulletIcon
                                                                className="mr-2 h-4 w-4"
                                                                stroke="#A78BFA"
                                                                fill="none"
                                                                strokeWidth={2}
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                        Rincian Biaya
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        className={`${
                                                            active
                                                                ? "bg-violet-500 text-white"
                                                                : "text-gray-900"
                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                        onClick={(e) => {
                                                            // setValues((prev) => ({ ...prev, biayaperm_id: biayaperm.id }))
                                                            setBiayapermId(
                                                                biayaperm.id
                                                            );
                                                            setShowModalBayarbiayaperms(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        {active ? (
                                                            <ListBulletIcon
                                                                className="mr-2 h-4 w-4"
                                                                stroke="#C4B5FD"
                                                                fill="none"
                                                                strokeWidth={2}
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            <ListBulletIcon
                                                                className="mr-2 h-4 w-4"
                                                                stroke="#A78BFA"
                                                                fill="none"
                                                                strokeWidth={2}
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                        List Pembayaran
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
            </ul>
            {biayapermId && (
                <>
                    <ModalBayarbiayaperms
                        biayaperm_id={biayapermId}
                        showModal={showModalBayarbiayaperms}
                        setShowModal={setShowModalBayarbiayaperms}
                    />
                    <ModalRincianbiayaperms
                        biayaperm_id={biayapermId}
                        showModal={showModalRincianbiayaperms}
                        setShowModal={setShowModalRincianbiayaperms}
                    />
                </>
            )}
            {viewImage && (
                <Lightbox
                    small={image ? image : ""}
                    medium={image ? image : ""}
                    large={image ? image : ""}
                    alt="View Image"
                    onClose={() => setViewImage(false)}
                />
            )}
        </div>
    );
}

export default CardTableBiayaperms;
