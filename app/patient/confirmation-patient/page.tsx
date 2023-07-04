import { backendUrl } from "lib/api/backendUrl";
import { endpoint } from "lib/api/endpoint";
import Template from "app/template";
import { Container } from "components/Container";
import { TableContainer } from "components/table/TableContainer";
import { AuthRequiredError } from "lib/errorHandling/exceptions";
import { ConfirmationPatient } from "components/patients/ConfirmationPatient";

export default async function ConfirmationPatientPage() {
    const dataService = await fetch(`${backendUrl}/${endpoint.getServicingHours()}`)
    const result = await dataService.json()
    const getPatientRegistration: { [key: string]: any } | undefined = await result?.data?.find((item: { [key: string]: any }) => item?.id === 'confirmation-patients')

    if (!result?.data) {
        throw new AuthRequiredError('There was an error in the confirmation patients data')
    }
    if (!getPatientRegistration) {
        throw new AuthRequiredError(`There was an error in the confirmation patients data. it might be because it can't find the "data" property in the database`)
    }

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