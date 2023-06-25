import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Template from "app/template";
import ProtectContainer from "components/protect/ProtectContainer";
import { ForgotPassword } from "components/protect/forgotPassword/ForgotPassword";

export default function ForgotPasswordPage() {
    return (
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
                <ForgotPassword/>
            </ProtectContainer>
        </Template>
    )
}