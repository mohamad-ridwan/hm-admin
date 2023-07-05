import Template from "app/template";
import { Container } from "components/Container";
import { TableContainer } from "components/table/TableContainer";
import { ConfirmationPatient } from "components/patients/ConfirmationPatient";

export default async function ConfirmationPatientPage() {
    return (
        <Template
            key={9}
            title="Confirmation Patient Registration | Admin Hospice Medical"
            description="konfirmasi pendaftaran pasien yang siap dipanggil di Hospice Medical"
            className="min-h-[100vh] w-[100vw]"
        >
            <Container
                overflow="overflow-x-auto"
            >
                <h1
                    className="text-3xl font-semibold text-font-color-3"
                >List of Confirmed Patients</h1>

                <TableContainer>
                    <ConfirmationPatient />
                </TableContainer>
            </Container>
        </Template>
    )
}