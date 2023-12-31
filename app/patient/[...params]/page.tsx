import { Suspense } from 'react'
import Template from "app/template";
import { Container } from "components/Container";
import { PersonalData } from "app/patient/[...params]/PersonalData";
import Loading from 'app/loading';

export default function PersonalDataRegistration({
    params
}: {
    params: { params: string }
}) {
    return (
        <Suspense
            fallback={<Loading />}
        >
            <Template
                key={7}
                title={`${params.params[3]} | Personal data | Hospice Medical Admin`}
                description="detail data pasien hospice medical"
            >
                <Container
                    overflow="overflow-x-auto"
                >
                    <PersonalData
                        params={params.params}
                    />
                </Container>
            </Template>
        </Suspense>
    )
}