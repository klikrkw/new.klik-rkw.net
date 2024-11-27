import React from 'react'
type Props = {
    neracas: never[] | undefined,
    totDebet: string | undefined,
    totKredit: string | undefined,
}
const SubCardNeracaTblKeluarBiayaPermUser = ({ neracas, totDebet, totKredit }: Props) => {
    return (
        <ul>
            <li
                className="relative rounded-md p-2 hover:bg-gray-100 text-sm"
            >
                {neracas ?
                    <div className='p-1 w-full flex-col'>
                        <div className='w-full font-bold mb-2'>NERACA</div>
                        <table className='w-full'>
                            <thead>
                                <tr className='border-y-2 font-semibold bg-slate-300'>
                                    <td width="10%">Kode</td>
                                    <td width="50%">Nama Akun</td>
                                    <td width="20%" align='right'>Debet</td>
                                    <td width="20%" align='right'>Kredit</td>
                                </tr>
                            </thead>
                            <tbody>
                                {neracas.map((neraca, i) => (
                                    <tr key={i} className='border-b-2'>
                                        {Object.keys(neraca).map((item, idx) => (
                                            <td
                                                className={`${idx > 1 ? 'text-right' : ''}`}
                                                key={idx}>{neraca[item]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className='font-semibold border-b-2 bg-slate-300'>
                                    <td width="10%">&nbsp;</td>
                                    <td width="50%">Total</td>
                                    <td width="20%" align='right'>{totDebet}</td>
                                    <td width="20%" align='right'>{totKredit}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    : null}
            </li>
        </ul>
    )
}

export default SubCardNeracaTblKeluarBiayaPermUser
