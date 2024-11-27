import {
    Calendar as BigCalendar,
    CalendarProps,
    momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "moment/dist/locale/id";
// import "./index.css";

// moment.defineLocale("id", {
//     parentLocale: "en",
//     /* */
// });
// moment.updateLocale("id", {
//     /**/
// });
moment.locale("id");

const localizer = momentLocalizer(moment);
export default function Calendar(props: Omit<CalendarProps, "localizer">) {
    return <BigCalendar {...props} localizer={localizer} />;
}
