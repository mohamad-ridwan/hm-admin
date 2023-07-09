import Template from "app/template"
import ProtectContainer from "app/(auth)/ProtectContainer"
import { Login } from 'app/(auth)/login/Login'

export default function LoginPage() {
    return (
        <Template
        key={1}
        isNavigateOff={true}
        title="Login | Hospice Medical Admin"
        description="login hospice medical admin"
        >
            <ProtectContainer
                title="Login"
            >
                <Login />
            </ProtectContainer>
        </Template>
    )
}