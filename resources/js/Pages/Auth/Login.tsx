import { useEffect, FormEventHandler, useState, useCallback } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import BlankLayout from "@/Layouts/BlankLayout";
import Input from "@/Components/Shared/Input";
import LinkButton from "@/Components/Shared/LinkButton";
import { LoadingButton } from "@/Components/Shared/LoadingButton";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"));
    };
    const [showEffect, setShowEffect] = useState<boolean>(false);

    const bounceEffect = useCallback(() => {
        setShowEffect(true);
        return new Promise((resolve) =>
            setTimeout(() => {
                resolve(setShowEffect(false));
            }, 250)
        );
    }, []);
    useEffect(() => {
        bounceEffect();
        return () => {};
    }, [bounceEffect]);

    return (
        <main>
            <section className="relative w-full h-full py-30 min-h-screen">
                <div
                    className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
                    style={{
                        backgroundImage:
                            "url(" + "/img/register_bg_2.png" + ")",
                    }}
                ></div>
                <div className="container mx-auto px-4 h-full">
                    <div className="flex content-center items-center justify-center h-full">
                        <div className="w-full lg:w-4/12 px-4 h-screen flex justify-center flex-col">
                            {status && (
                                <div className="mb-4 font-medium text-sm text-green-600">
                                    {status}
                                </div>
                            )}

                            <div
                                className={`relative flex ite flex-col min-w-0 break-words justify-center
                            transition-all scale-100
                            w-full mb-6 shadow-md rounded-lg bg-blueGray-200 border-0 p-2 ${
                                showEffect ? "scale-50 opacity-10" : "scale-100"
                            }`}
                            >
                                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                                    <div className="text-blueGray-400 text-center mb-3 font-bold">
                                        <span>SIGN IN</span>
                                    </div>
                                    <form onSubmit={submit}>
                                        <Input
                                            name="email"
                                            label="Email"
                                            errors={errors.email}
                                            value={data.email}
                                            type="email"
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                        />
                                        <Input
                                            name="password"
                                            autoComplete="false"
                                            label="Password"
                                            errors={errors.password}
                                            value={data.password}
                                            type="password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <div className="text-center mt-6">
                                            <LoadingButton
                                                theme="black"
                                                className="w-full items-center justify-center"
                                                loading={processing}
                                                type="submit"
                                            >
                                                <span>Log In</span>
                                            </LoadingButton>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="flex flex-wrap relative">
                                <div className="w-1/2">
                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            onClick={(e) => e.preventDefault()}
                                            className="text-blueGray-200 hover:text-blueGray-500"
                                        >
                                            <span>Forgot password?</span>
                                        </Link>
                                    )}
                                </div>
                                <div className="w-1/2 text-right">
                                    <Link
                                        href={"register"}
                                        className="text-blueGray-200 hover:text-blueGray-500"
                                    >
                                        <span>Register</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
