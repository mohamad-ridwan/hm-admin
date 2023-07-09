import { backendUrl } from "lib/api/backendUrl";
import { endpoint } from "lib/api/endpoint";
import Template from "app/template";
import ProtectContainer from "app/(auth)/ProtectContainer";
import { AuthRequiredError } from "lib/errorHandling/exceptions";
import { AdminT } from "lib/types/AdminT.types"
import { Verification } from "app/(auth)/register/verification/Verification";
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type ParamVerif = {
    _id: string
    id: string
    userId: string
    verification: {
        token: string
        date: string
    }
    createdAt: string
    updatedAt: string
    __v: number
}

export async function generateStaticParams() {
    const admin = await fetch(`${backendUrl}/${endpoint.getVerification()}`, {next: {revalidate: 10}})
    const result = await admin.json()
    const data = result?.data?.length > 0 ? result.data.map((verif: ParamVerif) => ({
        userId: verif.userId
    })) : [{ userId: '1682354552405' }]

    return data
}

export default async function VerificationPage({
    params
}: { params: { userId: string } }) {
    const { userId } = params

    const admin = await fetch(`${backendUrl}/${endpoint.getAdmin()}`, {next: {revalidate: 10}})
    const result = await admin.json()
    const data = await result?.data

    if (typeof data === 'undefined') {
        throw new AuthRequiredError('has occurred because there are no accounts in the database, or the "data" property is missing')
    }

    if (Array.isArray(data) && data.length === 0) {
        throw new AuthRequiredError('has occurred because there is no account in the database')
    }

    const findAdmin: AdminT | undefined = await data?.find((resAdmin: any) =>
        resAdmin?.id === userId &&
        resAdmin?.isVerification === false
    )

    return (
        <Template
            key={2}
            isNavigateOff={true}
            title={`${findAdmin?.name} | Verification | Hospice Medical Admin`}
            description="verifikasi akun admin hospice medical"
        >
            <ProtectContainer
                icon={<FontAwesomeIcon icon={faKey} />}
                title="Please check your email"
                desc={`We've sent a code to`}
                adminEmail={findAdmin?.email}
            >
                <Verification adminData={findAdmin}/>
            </ProtectContainer>
        </Template>
    )
}