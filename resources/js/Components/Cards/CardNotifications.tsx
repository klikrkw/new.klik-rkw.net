import React, { useEffect, useState } from "react";

// components
import { useAuth } from "@/Contexts/AuthContext";
import {
    deleteObject,
    getDownloadURL,
    ref as fbRef,
    uploadBytesResumable,
} from "firebase/storage";
import { usePage } from "@inertiajs/react";
import moment from "moment";
import { User } from "@/types";

export default function CardNotifications({ user }: { user: User }) {
    const {
        currentUser,
        login,
        logout,
        getFirestoreDocsRealTime,
        removeExpiredFirestoreDocuments,
    } = useAuth();
    const { fbtoken } = usePage().props;
    const [notifications, setNotifications] = useState<any>();
    useEffect(() => {
        if (!currentUser) {
            login(fbtoken);
        }

        getFirestoreDocsRealTime("notifications", user.id, (notifs: any) => {
            setNotifications(notifs);
        });
        removeExpiredFirestoreDocuments("notifications");
        // return () => {
        //     if (currentUser) {
        //         console.log("logout firebase");
        //         logout();
        //         // getFcmToken()
        //     }
        // };
    }, []);

    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded pb-4">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h3 className="font-semibold text-base text-blueGray-700">
                                Notifikasi
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto h-[530px] px-4">
                    <ol>
                        {notifications &&
                            notifications.map((notif: any, idx: number) => (
                                <li
                                    key={idx}
                                    className="flex flex-col text-sm rounded-md bg-yellow-400/50 mb-2 p-2 shadow-md"
                                >
                                    <div className="flex flex-row justify-between items-center bg-yellow-400/90 rounded-full px-2 shadow-md">
                                        <span className="font-bold">
                                            {notif.title}
                                        </span>
                                        <span className="text-xs italic">
                                            {moment(
                                                notif.timestamp.toDate()
                                            ).format("DD/MM/YYYY H:m:s")}
                                        </span>
                                    </div>
                                    <div className="text-xs px-2 py-1">
                                        {notif.body}
                                    </div>
                                </li>
                            ))}
                    </ol>
                </div>
            </div>
        </>
    );
}
