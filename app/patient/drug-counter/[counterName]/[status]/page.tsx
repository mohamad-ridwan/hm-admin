import Template from "app/template";
import { Container } from "components/Container";
import { TableContainer } from "components/table/TableContainer";
import { DrugCounter } from "./DrugCounter";

type ParamsProps = {
    params: {
        counterName: string
        status: string
    }
}

export default async function ListDrugCounter({ params }: ParamsProps) {
    const counterName = params?.counterName
    const status = params?.status
    return (
        <Template
            key={8}
            title={`Counter ${counterName} | ${status} | Hospice Medical Admin`}
            description="list daftar pasien berada diloket hospice medical"
            className="min-h-[100vh] w-[100vw]"
        >
            <Container
                overflow="overflow-x-auto"
                title='Patient Queue List from Counter'
                desc={counterName}
                classHeadDesc="text-3xl font-semibold"
            >
                <TableContainer>
                    <DrugCounter params={params}/>
                </TableContainer>
            </Container>
        </Template>
    )
}