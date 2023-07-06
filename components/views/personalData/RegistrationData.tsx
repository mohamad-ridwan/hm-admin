'use client'

import {useParams} from 'next/navigation'
import { faCheckToSlot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Container } from "components/Container"
import { HeadInfo } from "components/dataInformation/HeadInfo"
import { AdminT } from "lib/types/AdminT.types"
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT } from "lib/types/PatientT.types"

type Props = {
    dataPatientRegis: PatientRegistrationT[]
    dataConfirmationPatients: ConfirmationPatientsT[]
    dataFinishTreatment: PatientFinishTreatmentT[]
    dataAdmin: AdminT[]
}

export function RegistrationData(){
    const params = useParams()
    const getPatientName = params?.params?.split('/')
    return (
        <Container
        isNavleft={false}
        title="Patient of"
        desc={getPatientName[3]}
        classHeadDesc="text-3xl font-semibold flex-col"
        >
            <div
                className="flex justify-end overflow-hidden"
            >
                <div
                className="flex flex-wrap items-center text-green mt-2"
                >
                    <FontAwesomeIcon 
                    icon={faCheckToSlot} 
                    className="text-3xl mr-2 justify-end"
                    />
                    <h1 
                    className="text-3xl font-semibold"
                    >Have Finished Treatment</h1>
                </div>
            </div>

            <Container
            isNavleft={false}
            classWrapp="flex-col shadow-sm bg-white p-4 mx-1 my-8 rounded-md"
            maxWidth="auto"
            >
                <HeadInfo
                    title="Confirmed"
                    titleInfo="Patient Information"
                />
            </Container>
        </Container>
    )
}