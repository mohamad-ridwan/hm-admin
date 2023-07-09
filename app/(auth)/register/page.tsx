import Template from "app/template";
import ProtectContainer from "app/(auth)/ProtectContainer";
import { Register } from "app/(auth)/register/Register";

export default function RegisterPage(){
    return(
        <Template
        key={2}
        isNavigateOff={true}
        title="Register | Hospice Medical Admin"
        description="register hospice medical admin"
        >
            <ProtectContainer
            title="Register"
            >
                <Register/>
            </ProtectContainer>
        </Template>
    )
}