import { backendUrl } from "lib/api/backendUrl";
import { endpoint } from "lib/api/endpoint";
import Template from "app/template";
import { Container } from "components/Container";
import { PatientRegistration } from "components/patients/patientRegistration/PatientRegistration";
import { TableContainer } from "components/table/TableContainer";
import { AuthRequiredError } from "lib/errorHandling/exceptions";

export default async function PatientRegistrationPage() {
    const dataService = await fetch(`${backendUrl}/${endpoint.getServicingHours()}`)
    const result = await dataService.json()
    const getPatientRegistration: {[key: string]: any} | undefined = await result?.data?.find((item: {[key: string]: any})=>item?.id === 'patient-registration')

    if(!result?.data){
        throw new AuthRequiredError('There was an error in the patient registration data')
    }
    if(!getPatientRegistration){
        throw new AuthRequiredError(`There was an error in the patient registration data. it might be because it can't find the "data" property in the database`)
    }

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

                <TableContainer
                    style={{
                        marginTop: '3rem'
                    }}
                >
                    <PatientRegistration />
                </TableContainer>
            </Container>
        </Template>
    )
}