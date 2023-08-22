import { Suspense } from 'react'
import Template from "app/template";
import { Container } from "components/Container";
import { PatientRegistration } from "app/patient/patient-registration/PatientRegistration";
import { TableContainer } from "components/table/TableContainer";
import Loading from 'app/loading';

export default async function PatientRegistrationPage() {
    return (
        <Suspense
            fallback={<Loading />}
        >
            <Template
                key={8}
                title="Patient Registration | Hospice Medical Admin"
                description="list daftar pendaftaran pasien hospice medical"
                className="min-h-[100vh] w-[100vw]"
            >
                <Container
                    overflow="overflow-x-auto"
                    title="List of Patient Registration"
                    maxWidth='w-[1560px]'
                >
                    <TableContainer>
                        <PatientRegistration />
                    </TableContainer>
                </Container>
            </Template>
        </Suspense>
    )
}