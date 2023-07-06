import Template from "app/template";
import { Container } from "components/Container";
import { RegistrationData } from "components/views/personalData/RegistrationData";

export default function PersonalDataRegistration() {
    return (
        <Template
            key={7}
            title="Ridwan | Patient Data"
            description="detail data pasien hospice medical"
        >
            <Container
                overflow="overflow-x-auto"
            >
                <RegistrationData/>
            </Container>
        </Template>
    )
}