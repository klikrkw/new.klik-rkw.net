import moment from "moment";
import Calendar from "../Calender";
import "./index.css";
import { Event as EventC } from "@/types";
import { ComponentType, FunctionComponent, useState } from "react";
import Modal from "@/Components/Modal";
import { Event, EventProps, Views } from "react-big-calendar";

// const events = [
//     {
//         start: moment("2024-07-02T10:00:00").toDate(),
//         end: moment("2024-07-03T11:00:00").toDate(),
//         title: "MRI Registration",
//     },
//     {
//         start: moment("2024-07-04T14:00:00").toDate(),
//         end: moment("2024-07-04T15:30:00").toDate(),
//         title: "ENT Appointment",
//     },
// ];

type Props = {
    events: EventC[];
};
export default function BasicCalendar({ events }: Props) {
    const event = ({ event }: { event: any }) => {
        return (
            <div className="text-xs py-1 flex flex-col items-start w-full px-1">
                <div className="flex flex-col h-16 overflow-x-auto no-scrollbar">
                    <div
                        className="request-top"
                        style={{
                            whiteSpace: "pre-wrap",
                            overflowWrap: "break-word",
                        }}
                    >
                        {event.title}
                    </div>
                    <div
                        className="request-top"
                        style={{
                            whiteSpace: "pre-wrap",
                            overflowWrap: "break-word",
                        }}
                    >
                        {event.data}
                    </div>
                </div>
            </div>
        );
    };

    for (let index = 0; index < events.length; index++) {
        var element = events[index];
        element.start = moment(element.start).toDate();
        element.end = moment(element.end).toDate();
        events[index] = element;
    }
    const [showEvent, setShowEvent] = useState<boolean>(false);
    const [eventDetail, setEventDetail] = useState<Event | null>();
    const onSelectEvent = (slotInfo: any) => {
        setShowEvent(true);
        setEventDetail(slotInfo);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg w-full h-full inline-block">
            <Calendar
                events={events}
                style={{ minHeight: 500 }}
                components={{ event: event }}
                step={10}
                // onSelectEvent={onSelectEvent}
                defaultView={Views.MONTH}
            />
        </div>
    );
}
