import { omit } from 'lodash';
import React, { HtmlHTMLAttributes, RefAttributes, useState } from 'react';
import { ControlProps, GroupBase, InputActionMeta, MultiValue, MultiValueGenericProps, OnChangeValue, Props, SelectInstance, SingleValueProps } from 'react-select'
import { twMerge } from 'tailwind-merge';
import AsyncSelect from 'react-select/async';
import apputils from '@/bootstrap'
import { components } from 'react-select'
type SelectProps<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>> = Props<Option, IsMulti, Group> & {
    label?: string;
    id?: string;
    url: string;
    className?: string;
    errors?: string | undefined;
    optionLabels: string[],
    optionValue: string
}
const AsyncSelectSearch = <
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>
>(props: SelectProps<Option, IsMulti, Group>) => {
    const id = props.id || Math.random().toString()
    const reactSelectProps = omit(props, ['label', 'className'])
    const getOptions = async (inputValue: string) => {
        const response = await apputils.backend.get(`${props.url}?query=${inputValue}`)
        const data = response.data.reduce((r: any, i: any) => {
            const labels = props.optionLabels.reduce((results: any, item: any, idx: number) => results += `${idx > 0 ? ' - ' : ''} ${i[item]}`, '')
            r.push({ label: labels, value: i[props.optionValue] })
            return r
        }, [])
        return data
    }
    // const Option = (props: any) => {
    //     const { data } = props;
    //     return (
    //         <components.Option {...props}>
    //             {data.name}
    //         </components.Option>
    //     );
    // };
    const MultiValueLabel = (props: MultiValueGenericProps<any>) => {
        const lbl = props.data.label
        const idx = lbl.indexOf('-')
        const label = lbl.substr(0, idx != -1 ? idx : lbl.length)
        return (
            <components.MultiValueLabel {...props}>{label}</components.MultiValueLabel>
        );
    };
    return (
        <div className={twMerge("relative w-full mb-3", props.className)}>
            {props.label && (
                <label htmlFor={id} className={`block uppercase text-blueGray-600 text-xs font-bold mb-2 ${props.errors ? 'text-red-500' : ''} `}>
                    {props.label}
                </label>
            )}

            <AsyncSelect
                className='shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150'
                {...reactSelectProps}
                // components={{ MultiValueLabel }}
                // getOptionLabel={(option: any) => {
                //     return `${option ? option.label : ''} - ${option ? option.value : ''}`
                // }}
                // let vals = props.optionLabels.map((val, index) => {
                //     return `<span>${option[val]}</span>`
                // })
                // return vals.toString()
                // }}
                // getOptionValue={option => `${option}`}

                loadOptions={getOptions}
                theme={(theme) => ({
                    ...theme,
                    // colors: {
                    //     ...theme.colors,
                    //     primary: "var(--primary-500)",
                    // },
                })}

            />
            {props.errors ? <span className='text-sm text-red-500'>{props.errors}</span> : null}
        </div>
    );
}


export default AsyncSelectSearch

