import Template from "app/template";
import { Container } from "components/Container";
import { TableContainer } from "components/table/TableContainer";
import { Rooms } from "./Rooms";

export default function RoomsPage() {
    return (
        <Template
            key="rooms"
            title="Rooms | Hospice Medical Admin"
            description="list daftar ruang berobat pasien pada hospice medical"
            className="min-h-[100vh] w-[100vw]"
        >
            <Container
                overflow="overflow-x-auto"
                title="List of Rooms"
            >
                <TableContainer>
                    <Rooms/>
                </TableContainer>
            </Container>
        </Template>
    )
}