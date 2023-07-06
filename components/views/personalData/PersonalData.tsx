'use client'

import ServicingHours from "lib/actions/ServicingHours"
import { RegistrationData } from "./RegistrationData"

export function PersonalData() {
    const {
        dataService,
        dataPatientRegis,
        dataConfirmationPatients,
        dataFinishTreatment,
        dataAdmin,
        dataRooms,
        doctors,
        loadDataService,
        loadDataDoctors,
        loadGetDataAdmin,
        pushTriggedErr
    } = ServicingHours()

    return (
        <>
            <RegistrationData/>
        </>
    )
}