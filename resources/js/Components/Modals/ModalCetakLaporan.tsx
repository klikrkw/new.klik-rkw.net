import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import apputils from '@/bootstrap'
import LaporanIframe from '../Iframe/LaporanIframe'
import { ThreeDots } from 'react-loader-spinner'

type Props = {
    showModal: boolean,
    setShowModal: (e: boolean) => void,
    src: string,
}

const ModalCetakLaporan = ({ showModal, setShowModal, src }: Props) => {
    // useEffect(() => {
    //     if (biayaperm_id && showModal) {
    //         getBayarbiayaperms(biayaperm_id)
    //     }
    // }, [showModal])
    const [dataBase64, setDataBase64] = useState<string>()
    const [isLoading, setisLoading] = useState(false)
    const base64toBlob = (data: string) => {
        // Cut the prefix `data:application/pdf;base64` from the raw base 64
        const base64WithoutPrefix = data.substring('data:application/pdf;base64,'.length);

        const bytes = atob(base64WithoutPrefix);
        let length = bytes.length;
        let out = new Uint8Array(length);

        while (length--) {
            out[length] = bytes.charCodeAt(length);
        }

        return new Blob([out], { type: 'application/pdf' });
    };
    useEffect(() => {
        setisLoading(true)
        const getLaporan = async () => {
            // setIsloading(true)
            const response = await apputils.backend.get(src)
            const data = response.data
            setDataBase64(URL.createObjectURL(base64toBlob(data)))
            setisLoading(false)
        }
        if (showModal) {
            getLaporan()
        }
    }, [showModal])
    return (
        <Modal show={showModal} maxWidth='2xl' closeable={true} onClose={() => setShowModal(false)}>
            <div className='p-4 bg-blueGray-100 rounded-md text-xs'>
                <div className='w-full absolute right-1 top-1 flex justify-between items-center px-1'>
                    <h1 className='text-lg mb-2 font-semibold text-blueGray-500 ml-4 '>Cetak Laporan</h1>
                    <button className="text-lightBlue-500 background-transparent font-bold uppercase px-0 py-0 text-xl outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={(e) => setShowModal(false)}
                    >
                        <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </button>
                </div>
                {isLoading && (
                    <div className='m-auto mt-6 h-16 w-full flex justify-center items-center absolute z-50'>
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
                )}

                <div className='w-full relative bg-slate-500 rounded-sm mt-6'>
                    {dataBase64 ? <LaporanIframe src={dataBase64} title='Laporan' /> : null}
                </div>
            </div>
        </Modal >
    )
}

export default ModalCetakLaporan
