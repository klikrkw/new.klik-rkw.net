import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import Input from "@/Components/Shared/Input";
import { LoadingButton } from "@/Components/Shared/LoadingButton";
import LinkButton from "@/Components/Shared/LinkButton";

export default function twoFactor() {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // post(route("verification.send"));
        post(route("two-factor.verify"));
    };

    return (
        <GuestLayout>
            <Head title="Two Factor Code" />
            <div className="mb-4 text-sm text-gray-600">
                isikan code otp yang dikirimkan melalui email
            </div>

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <Input
                        name="code"
                        label="Masukkan Kode OTP"
                        errors={errors.code}
                        value={data.code}
                        type="code"
                        onChange={(e) => setData("code", e.target.value)}
                    />
                </div>
                <div className="text-center mt-6 flex w-full justify-between">
                    <LinkButton href={route("two-factor.logout")}>
                        Logout
                    </LinkButton>
                    <LoadingButton
                        theme="black"
                        className="items-center justify-center"
                        loading={processing}
                        type="submit"
                    >
                        <span>Verify</span>
                    </LoadingButton>
                </div>
            </form>
        </GuestLayout>
    );
}
