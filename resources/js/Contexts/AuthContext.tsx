import React, {
    useContext,
    useState,
    useEffect,
    ReactNode,
    createContext,
    Dispatch,
    SetStateAction,
} from "react";
import app, { auth, storage } from "../firebase";
import {
    signInWithCustomToken,
    UserCredential,
    // signInWithEmailAndPassword,
} from "firebase/auth";
import myapp from "@/bootstrap";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {
    collection,
    collectionGroup,
    deleteDoc,
    doc,
    getFirestore,
    limit,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    where,
} from "firebase/firestore";

// const AuthContext = createContext<typeof value>(value);
interface AuthContextType {
    currentUser: any;
    login: (fbtoken: string) => Promise<UserCredential>;
    signup: (email: string, password: string) => void;
    logout: () => Promise<void>;
    resetPassword: (email: string) => void;
    updateEmail: (email: string) => void;
    updatePassword: (password: string) => void;
    useMessaging: () => any;
    getFcmToken: () => any;
    sendMessage: (msg: { title: string; body: string }) => any;
    requestForToken: () => any;
    onMessageListener: () => any;
    setCloseDialog: Dispatch<SetStateAction<boolean>>;
    getFirestoreDocsRealTime: (
        collectionName: string,
        userId: number,
        cb: (e: any) => void
    ) => Promise<unknown>;
    removeExpiredFirestoreDocuments: (collectionName: string) => void;
    closeDialog: boolean;
}

const AuthContext = createContext<AuthContextType>({
    closeDialog: false,
    currentUser: undefined,
    login: function (fbtoken: string): Promise<UserCredential> {
        throw new Error("Function not implemented.");
    },
    signup: function (email: string, password: string): void {
        throw new Error("Function not implemented.");
    },
    logout: function (): Promise<void> {
        throw new Error("Function not implemented.");
    },
    resetPassword: function (email: string): void {
        throw new Error("Function not implemented.");
    },
    updateEmail: function (email: string): void {
        throw new Error("Function not implemented.");
    },
    updatePassword: function (password: string): void {
        throw new Error("Function not implemented.");
    },
    useMessaging: function () {
        throw new Error("Function not implemented.");
    },
    getFcmToken: function () {
        throw new Error("Function not implemented.");
    },
    sendMessage: function (msg: { title: string; body: string }) {
        throw new Error("Function not implemented.");
    },
    requestForToken: function () {
        throw new Error("Function not implemented.");
    },
    onMessageListener: function () {
        throw new Error("Function not implemented.");
    },
    setCloseDialog: function (value: React.SetStateAction<boolean>): void {
        throw new Error("Function not implemented.");
    },
    getFirestoreDocsRealTime: function (
        collectionName: string,
        userId: number,
        cb: (e: any) => void
    ): Promise<unknown> {
        throw new Error("Function not implemented.");
    },
    removeExpiredFirestoreDocuments: function (collectionName: string): void {
        throw new Error("Function not implemented.");
    },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [closeDialog, setCloseDialog] = useState<boolean>(false);
    const db = getFirestore(app);
    function signup(email: string, password: string) {
        // return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(fbtoken: string) {
        return signInWithCustomToken(auth, fbtoken);
        // return signInWithEmailAndPassword(auth, 'admin@example.com', 'password')
    }

    function logout() {
        return auth.signOut();
    }

    function resetPassword(email: string) {
        // return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email: string) {
        return currentUser.updateEmail(email);
    }

    function updatePassword(password: string) {
        return currentUser.updatePassword(password);
    }
    function useMessaging() {
        return getMessaging(app);
    }
    const getFcmToken = () => {
        const messaging = useMessaging();
        getToken(messaging, {
            vapidKey:
                "BELRgc_WHeMyXH-Fmy7-K6CQxEGs2tyRuPA_D8WaiuP04XDwktfbrEUbwTG897ctBKc1zM3JzVCAJFZ3B67oMwU",
        })
            .then((currentToken) => {
                if (currentToken) {
                    updateFcmToken(currentToken)
                        .then((e) => {
                            console.log(e.data);
                        })
                        .catch((e) => console.log(e.data));
                } else {
                    // Show permission request UI
                    console.log(
                        "No registration token available. Request permission to generate one."
                    );
                    return null;
                }
            })
            .catch((err) => {
                console.log("An error occurred while retrieving token. ", err);
                // ...
            });

        const updateFcmToken = async (fcmToken: string) => {
            return await myapp.backend.patch("/update_fcmtoken", {
                fcm_token: fcmToken,
            });
        };
    };

    const sendMessage = async (msg: { title: string; body: string }) => {
        if (msg.title != "" && msg.body != "") {
            const resp = await myapp.backend.post("/send_message", msg);
            if (resp) {
                console.log(resp.data);
            }
        } else {
            alert("harus diisi");
        }
    };
    function requestForToken() {
        const messaging = useMessaging();
        const updateFcmToken = async (fcmToken: string) => {
            return await myapp.backend.patch("/update_fcmtoken", {
                fcm_token: fcmToken,
            });
        };
        return getToken(messaging, {
            vapidKey:
                "BELRgc_WHeMyXH-Fmy7-K6CQxEGs2tyRuPA_D8WaiuP04XDwktfbrEUbwTG897ctBKc1zM3JzVCAJFZ3B67oMwU",
        })
            .then((currentToken) => {
                if (currentToken) {
                    console.log("update fcm token");
                    updateFcmToken(currentToken)
                        .then((e) => {
                            console.log(e.data);
                        })
                        .catch((e) => console.log(e.data));
                    // Perform any other neccessary action with the token
                } else {
                    // Show permission request UI
                    console.log(
                        "No registration token available. Request permission to generate one."
                    );
                }
            })
            .catch((err) => {
                console.log("An error occurred while retrieving token. ", err);
            });
    }

    const onMessageListener = () =>
        new Promise((resolve) => {
            const messaging = useMessaging();
            onMessage(messaging, (payload) => {
                resolve(payload);
            });
        });

    const getFirestoreDocsRealTime = async (
        collectionName: string,
        userId: number,
        cb: (e: any) => void
    ) => {
        try {
            const q = query(
                collection(db, collectionName),
                limit(10),
                where("users", "array-contains", userId),
                orderBy("timestamp", "desc")
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const cities: any[] = [];
                querySnapshot.forEach((doc) => {
                    cities.push(doc.data());
                });
                cb(cities);
            });
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    const removeExpiredFirestoreDocuments = (collectionName: string) => {
        const now = Timestamp.now();
        const ts = Timestamp.fromMillis(now.toMillis() - 86400000); // 1 week (604800000) milliseconds (24 hours milliseconds = 86400000)
        try {
            const q = query(
                collection(db, collectionName),
                where("timestamp", "<", ts),
                limit(10),
                orderBy("timestamp", "desc")
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const cities: any[] = [];
                querySnapshot.forEach((doc) => {
                    deleteDoc(doc.ref);
                });
            });
        } catch (error) {
            console.log(error);
            return error;
        }
    };
    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        useMessaging,
        getFcmToken,
        sendMessage,
        requestForToken,
        onMessageListener,
        setCloseDialog,
        getFirestoreDocsRealTime,
        removeExpiredFirestoreDocuments,
        closeDialog,
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user: any) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
