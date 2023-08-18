import { Suspense } from 'react'
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Template from "app/template";
import ProtectContainer from "app/(auth)/ProtectContainer";
import { ForgotPassword } from "app/(auth)/forgot-password/ForgotPassword";
import Loading from 'app/loading';

export default function ForgotPasswordPage() {
    return (
        <Suspense
            fallback={<Loading />}
        >
            <Template
                key={3}
                isNavigateOff={true}
                title="Forgot Password | Hospice Medical Admin"
                description="lupa password pada akun admin hospice medical"
            >
                <ProtectContainer
                    icon={<FontAwesomeIcon icon={faKey} />}
                    title="Forgot Password?"
                    desc={`No worries, we'll send you reset instructions`}
                >
                    <ForgotPassword />
                </ProtectContainer>
            </Template>
        </Suspense>
    )
}