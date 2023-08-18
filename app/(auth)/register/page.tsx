import { Suspense } from 'react'
import Template from "app/template";
import ProtectContainer from "app/(auth)/ProtectContainer";
import { Register } from "app/(auth)/register/Register";
import Loading from 'app/loading';

export default function RegisterPage() {
    return (
        <Suspense
            fallback={<Loading />}
        >
            <Template
                key={2}
                isNavigateOff={true}
                title="Register | Hospice Medical Admin"
                description="register hospice medical admin"
            >
                <ProtectContainer
                    title="Register"
                >
                    <Register />
                </ProtectContainer>
            </Template>
        </Suspense>
    )
}