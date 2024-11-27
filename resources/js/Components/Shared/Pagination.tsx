import classNames from 'classnames';
import { Link } from '@inertiajs/react';
import React from 'react';

const IconNextPrev = ({ label }: { label: string }) => {
    let hasil: React.ReactNode
    if (label.includes('Previous')) {
        hasil = <i className="fas fa-chevron-left -ml-px"></i>
    } else if (label.includes('Next')) {
        hasil = <i className="fas fa-chevron-right -mr-px"></i>
    } else {
        hasil = <span dangerouslySetInnerHTML={{ __html: label }}></span>
    }
    return hasil
}

const PageLink = ({ active, label, url }: { active: boolean, label: string, url: string }) => {
    const className = classNames(
        [
            "first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid "
        ],
        {
            'border-lightBlue-500 text-white bg-lightBlue-500': active
        },
        {
            'border-lightBlue-500 bg-white text-lightBlue-500': !active
        }
    );
    return (
        <Link className={className} href={url}>
            <IconNextPrev label={label} />
        </Link>
    );
};

// Previous, if on first page
// Next, if on last page
// and dots, if exists (...)
const PageInactive = ({ label }: { label: string }) => {
    const className = classNames(
        'first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-lightBlue-200 text-white bg-lightBlue-200 '
    );
    return (
        <div className={className}>
            <IconNextPrev label={label} />
        </div>
    );
};

export default ({ links, labelLinks }: { links: [], labelLinks?: { first: string, last: string, next: string, prev: string } }) => {
    // dont render, if there's only 1 page (previous, 1, next)
    if (links.length ? links.length === 3 : null) return null;
    return (

        <div className="py-2">
            <nav className="block">
                <ul className="flex pl-0 rounded list-none flex-wrap">
                    <li>
                        {labelLinks ?
                            <Link href={labelLinks.first} className="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-lightBlue-500 bg-white text-lightBlue-500">
                                <i className="fas fa-chevron-left -ml-px"></i>
                                <i className="fas fa-chevron-left -ml-px"></i>
                            </Link>
                            : null}
                    </li>
                    {links.map(({ active, label, url }) => {
                        return url === null ? (
                            <PageInactive key={label} label={label} />
                        ) : (
                            <PageLink key={label} label={label} active={active} url={url} />
                        );
                    })}
                    <li>
                        {labelLinks ?
                            <Link href={labelLinks.last} className="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-lightBlue-500 bg-white text-lightBlue-500">
                                <i className="fas fa-chevron-right -mr-px"></i>
                                <i className="fas fa-chevron-right -mr-px"></i>
                            </Link>
                            : null}
                    </li>
                </ul>
            </nav>
        </div >)
};
