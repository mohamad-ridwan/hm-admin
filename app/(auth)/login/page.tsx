import Template from "app/template"
import ProtectContainer from "components/protect/ProtectContainer"
import { Login } from 'components/protect/Login'

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