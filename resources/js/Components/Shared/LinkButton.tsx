import React, { LinkHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { InertiaLinkProps, Link } from '@inertiajs/react';

interface ButtonProps extends InertiaLinkProps {
    theme?: 'blueGrey' | 'black' | 'blue',
    className?: string,
    children: React.ReactNode
}

export const LinkButton: React.FC<ButtonProps> = ({ theme = 'blueGrey', className, children, ...props }) => {
    let css = ''
    if (theme === 'blue') {
        css = 'bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 inline-flex ease-linear transition-all duration-150  '
    } else if (theme === 'black') {
        css = 'bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none inline-flex mr-1 mb-1 ease-linear transition-all duration-150 '
    } else {
        css = 'bg-white active:bg-blueGray-50 text-blueGray-700 font-bold px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150 '
    }
    return (
        <Link className={twMerge(css, className)} {...props}>
            {children}
        </Link>
    );
};
export default LinkButton
