import { Suspense } from 'react'
import Template from "app/template";
import { Container } from "components/Container";
import { TableContainer } from "components/table/TableContainer";
import { FinishedTreatment } from "./FinishedTreatment";
import Loading from 'app/loading';

export default async function FinishedTreatmentPage() {
    return (
        <Suspense
            fallback={<Loading />}
        >
            <Template
                key={11}
                title="Finished Treatment | Hospice Medical Admin"
                description="list daftar pendaftaran pasien telah selesai berobat. hospice medical"
                className="min-h-[100vh] w-[100vw]"
            >
                <Container
                    overflow="overflow-x-auto"
                    title="Patient List Completed Treatment"
                >
                    <TableContainer>
                        <FinishedTreatment />
                    </TableContainer>
                </Container>
            </Template>
        </Suspense>
    )
}