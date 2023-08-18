import { Suspense } from 'react'
import Template from "app/template"
import ProtectContainer from "app/(auth)/ProtectContainer"
import { Login } from 'app/(auth)/login/Login'
import Loading from 'app/loading'

export default function LoginPage() {
    return (
        <Suspense
            fallback={<Loading />}
        >
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
        </Suspense>
    )
}