import Template from "app/template";
import { Container } from "components/Container";
import { PatientRegistration } from "components/patients/PatientRegistration";
import { TableContainer } from "components/table/TableContainer";

export default async function PatientRegistrationPage() {
    return (
        <Template
            key={8}
            title="Patient Registration | Hospice Medical Admin"
            description="list daftar pendaftaran pasien hospice medical"
            className="min-h-[100vh] w-[100vw]"
        >
            <Container
            overflow="overflow-x-auto"
            >
                <h1
                    className="text-3xl font-semibold text-font-color-3"
                >List of Patient Registration</h1>

                <TableContainer>
                    <PatientRegistration />
                </TableContainer>
            </Container>
        </Template>
    )
}