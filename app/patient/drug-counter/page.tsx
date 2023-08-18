import { Suspense } from 'react'
import Template from "app/template";
import { Container } from "components/Container";
import { TableContainer } from "components/table/TableContainer";
import { DrugCounter } from "./DrugCounter";
import Loading from 'app/loading';

export default async function DrugCounterPage() {
    return (
        <Suspense
            fallback={<Loading />}
        >
            <Template
                key={10}
                title="Drug Counter | Hospice Medical Admin"
                description="list daftar pasien berada diloket di hospice medical"
                className="min-h-[100vh] w-[100vw]"
            >
                <Container
                    overflow="overflow-x-auto"
                    title="Drug Counter"
                >
                    <TableContainer>
                        <DrugCounter />
                    </TableContainer>
                </Container>
            </Template>
        </Suspense>
    )
}