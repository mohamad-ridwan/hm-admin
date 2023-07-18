import Template from "app/template";
import { Container } from "components/Container";
import { PatientPDF } from "./PatientPDF";

export default async function DownloadPatientPDF() {
    return (
        <Template
            key={10}
            isNavigateOff={true}
            title="Patient PDF | Hospice Medical Admin"
            description="bukti pendaftaran pasien yang sudah dikonfirmasi oleh hospice medical"
        >
            <Container
                isNavleft={false}
            >
                <PatientPDF/>
            </Container>
        </Template>
    )
}