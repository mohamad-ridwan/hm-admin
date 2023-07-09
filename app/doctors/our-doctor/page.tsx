import Template from "app/template";
import { Container } from "components/Container";
import { TableContainer } from "components/table/TableContainer";
import { OurDoctor } from "./OurDoctor";

export default function OurDoctorPages() {
    return (
        <Template
            key={9}
            title="Our Doctor | Hospice Medical Admin"
            description="list of doctors available at hospice medical hospitals"
            className="min-h-[100vh] w-[100vw]"
        >
            <Container
                overflow="overflow-x-auto"
                title="List of Doctors"
            >
                <TableContainer>
                    <OurDoctor/>
                </TableContainer>
            </Container>
        </Template>
    )
}