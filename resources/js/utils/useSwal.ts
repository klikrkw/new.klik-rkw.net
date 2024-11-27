import Swal from "sweetalert2";

type Props = {
    title?: string;
    text?: string;
    icon?: "warning";
    // cb: ({}) => void;
};
const confirm = ({ title, text, icon }: Props) =>
    Swal.fire({
        title: title ? title : "Are you sure?",
        text: text ? text : "You won't be able to revert this!",
        icon: icon ? icon : "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
    });
export default { confirm };
