type Props = {
} & React.SVGProps<SVGSVGElement>
function EditInactiveIcon(props: Props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 13V16H7L16 7L13 4L4 13Z"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
        </svg>
    )
}

function EditActiveIcon(props: Props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 13V16H7L16 7L13 4L4 13Z"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
        </svg>
    )
}

function DuplicateInactiveIcon(props: Props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 4H12V12H4V4Z"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
            <path
                d="M8 8H16V16H8V8Z"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
        </svg>
    )
}

function DuplicateActiveIcon(props: Props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 4H12V12H4V4Z"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
            <path
                d="M8 8H16V16H8V8Z"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
        </svg>
    )
}

function ArchiveInactiveIcon(props: Props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="8"
                width="10"
                height="8"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
            <rect
                x="4"
                y="4"
                width="12"
                height="4"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
            <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
        </svg>
    )
}

function ArchiveActiveIcon(props: Props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="8"
                width="10"
                height="8"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
            <rect
                x="4"
                y="4"
                width="12"
                height="4"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
            <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
        </svg>
    )
}

function MoveInactiveIcon(props: Props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M10 4H16V10" stroke="#A78BFA" strokeWidth="2" />
            <path d="M16 4L8 12" stroke="#A78BFA" strokeWidth="2" />
            <path d="M8 6H4V16H14V12" stroke="#A78BFA" strokeWidth="2" />
        </svg>
    )
}

function MoveActiveIcon(props: Props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M10 4H16V10" stroke="#C4B5FD" strokeWidth="2" />
            <path d="M16 4L8 12" stroke="#C4B5FD" strokeWidth="2" />
            <path d="M8 6H4V16H14V12" stroke="#C4B5FD" strokeWidth="2" />
        </svg>
    )
}

function DeleteInactiveIcon(props: Props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="6"
                width="10"
                height="10"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
            <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
            <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
        </svg>
    )
}

function DeleteActiveIcon(props: Props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="6"
                width="10"
                height="10"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
            <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
            <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
        </svg>
    )
}
function CashInactiveIcon(props: Props) {
    return (

        <svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g id="SVGRepo_bgCarrier" stroke="#C4B5FD" stroke-width="2"></g><g id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M14 7C14 6.44771 14.4477 6 15 6H16V5C16 4.44772 16.4477 4 17 4C17.5523 4 18 4.44772 18 5V6H19C19.5523 6 20 6.44771 20 7C20 7.55229 19.5523 8 19 8H18V9C18 9.55228 17.5523 10 17 10C16.4477 10 16 9.55228 16 9V8H15C14.4477 8 14 7.55229 14 7Z" fill="#a3b6ff"></path>
                <path d="M14 15C14 14.4477 14.4477 14 15 14H19C19.5523 14 20 14.4477 20 15C20 15.5523 19.5523 16 19 16H15C14.4477 16 14 15.5523 14 15Z" fill="#a3b6ff"></path> <path d="M15 18C14.4477 18 14 18.4477 14 19C14 19.5523 14.4477 20 15 20H19C19.5523 20 20 19.5523 20 19C20 18.4477 19.5523 18 19 18H15Z" fill="#a3b6ff"></path> <path d="M5 6C4.44772 6 4 6.44771 4 7C4 7.55229 4.44772 8 5 8H9C9.55228 8 10 7.55229 10 7C10 6.44771 9.55228 6 9 6H5Z" fill="#a3b6ff"></path> <path d="M5.92512 14.5109C5.5346 14.1204 4.90143 14.1204 4.51091 14.5109C4.12039 14.9014 4.12039 15.5346 4.51091 15.9251L5.5858 17L4.50337 18.0824C4.11284 18.4729 4.11284 19.1061 4.50337 19.4966C4.89389 19.8872 5.52705 19.8872 5.91758 19.4966L7.00002 18.4142L8.08944 19.5036C8.47996 19.8941 9.11313 19.8941 9.50365 19.5036C9.89418 19.1131 9.89418 18.4799 9.50365 18.0894L8.41423 17L9.50194 15.9123C9.89246 15.5218 9.89246 14.8886 9.50194 14.4981C9.11141 14.1075 8.47825 14.1075 8.08772 14.4981L7.00002 15.5858L5.92512 14.5109Z" fill="#a3b6ff"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V11H13V3H20ZM21 13V20C21 20.5523 20.5523 21 20 21H13V13H21ZM4 3H11V11H3V4C3 3.44772 3.44772 3 4 3ZM3 20V13H11V21H4C3.44772 21 3 20.5523 3 20Z" fill="#a3b6ff"></path>
            </g>
        </svg>
    )
}

function CashActiveIcon(props: Props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>

    )
}

export {
    EditInactiveIcon,
    EditActiveIcon,
    DuplicateInactiveIcon,
    DuplicateActiveIcon,
    ArchiveInactiveIcon,
    ArchiveActiveIcon,
    MoveInactiveIcon,
    MoveActiveIcon,
    DeleteInactiveIcon,
    DeleteActiveIcon,
    CashActiveIcon,
    CashInactiveIcon
}
