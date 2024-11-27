import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker';
import { DateRange } from 'react-number-format/types/types';
import { twMerge } from 'tailwind-merge';
import "react-datepicker/dist/react-datepicker.css";
import Button from './Button';

const MonthRangeInput = ({ onDataChange, className, errors, label, value }: { onDataChange: (dates: DateRange) => void, className?: string, errors?: string, label?: string, value: DateRange }) => {
    const renderMonthContent = (month = 0, shortMonth = '', longMonth = '', day = 0) => {
        const fullYear = new Date(day).getFullYear();
        const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;

        return <span title={tooltipText}>{shortMonth}</span>;
    };
    const [dates, setDates] = useState<DateRange>({ date1: value.date1 ? value.date1 : moment().format('YYYY-MM-DD'), date2: value.date2 ? value.date2 : moment().format('YYYY-MM-DD') })

    const handleChange = useCallback((field: 'date1' | 'date2', value: any) => {
        setDates(d => ({ ...d, [field]: moment(value).format('YYYY-MM-DD') }))
    }, [dates]);

    // useEffect(() => {
    //     // onDataChange(dates)
    //     console.log('first')
    // }, [dates])

    return (
        <div className={twMerge("relative w-full mb-3 text-black ", className)}>
            {label && (<label
                className={`block uppercase text-blueGray-600 text-xs font-bold mb-2 ${errors ? 'text-red-500' : ''} `}
            >
                {label}
            </label>)}
            <div className='flex flex-row gap-0'>
                <ReactDatePicker
                    selected={moment(dates.date1).toDate()}
                    value={moment(dates.date1).format('MMM-YYYY')}
                    renderMonthContent={renderMonthContent}
                    showMonthYearPicker
                    dateFormat="MM/yyyy"
                    className=' px-3 py-2 placeholder-blueGray-300 text-blueGray-600 border-blueGray-300 bg-white rounded-l-md text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150'
                    onChange={(e) => handleChange('date1', moment(e).toISOString())}
                />
                <ReactDatePicker
                    selected={moment(dates.date2).toDate()}
                    value={moment(dates.date2).format('MMM-YYYY')}
                    renderMonthContent={renderMonthContent}
                    showMonthYearPicker
                    dateFormat="MM/yyyy"
                    className='px-3 py-2 placeholder-blueGray-300 text-blueGray-600 border-blueGray-300 bg-white text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150'
                    onChange={(e) => handleChange('date2', moment(e).toISOString())}
                />
                <Button theme='blue' className='text-sm rounded-r-md' onClick={(e) => onDataChange(dates)}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </Button>
            </div>
        </div>
    )
}

export default MonthRangeInput
