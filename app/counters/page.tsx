import Template from "app/template";
import { Container } from "components/Container";
import { TableContainer } from "components/table/TableContainer";
import { Counters } from "./Counters";

export default function CountersPage() {
    return (
        <Template
            key="counters"
            title="Counters | Hospice Medical Admin"
            description="list daftar ruang loket pasien pada hospice medical"
            className="min-h-[100vh] w-[100vw]"
        >
            <Container
                overflow="overflow-x-auto"
                title="List of Counters"
            >
                <TableContainer>
                    <Counters />
                </TableContainer>
            </Container>
        </Template>
    )
}