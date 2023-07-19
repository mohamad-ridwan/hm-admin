import Template from "app/template";
import { Container } from "components/Container";
import { PatientPDF } from "./PatientPDF";

export default function DownloadPatientPDF({params}: {params: {params: string}}) {
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
                <PatientPDF params={params}/>
            </Container>
        </Template>
    )
}