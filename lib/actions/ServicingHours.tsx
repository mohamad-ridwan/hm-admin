'use client'

import { useEffect, useState } from "react"
import { useSwr } from "lib/useFetch/useSwr"
import { endpoint } from "../api/endpoint"
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT, RoomTreatmentT } from "lib/types/PatientT.types"
import { AdminT } from "lib/types/AdminT.types"
import { ProfileDoctorT } from "lib/types/DoctorsT.types"
import { AuthRequiredError } from "lib/errorHandling/exceptions"

function ServicingHours(){
    const [triggedErr, setTriggedErr] = useState<boolean>(false)
    const [errTriggedMessages, setErrTriggedMessages] = useState<string>('')

    // swr fetching data
    // servicing hours
    const { data: dataService, error: errDataService, isLoading: loadDataService } = useSwr(endpoint.getServicingHours(), { refreshInterval: 4000 })
    const newPatientRegistration: { [key: string]: any } | undefined = dataService as {}
    const getPatientRegistration: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientRegistrationT) => item?.id === 'patient-registration')
    const dataPatientRegis: PatientRegistrationT[] | undefined = getPatientRegistration?.data

    // confirmation patients
    const getConfirmationPatients: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: ConfirmationPatientsT) => item?.id === 'confirmation-patients')
    const dataConfirmationPatients: ConfirmationPatientsT[] | undefined = getConfirmationPatients?.data

    // finished treatment data
    const getFinishTreatment: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientFinishTreatmentT) => item?.id === 'finished-treatment')
    const dataFinishTreatment: PatientFinishTreatmentT[] | undefined = getFinishTreatment?.data

    // room
    const getRoomsTreatment: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: RoomTreatmentT) => item?.id === 'room')
    const dataRooms: RoomTreatmentT[] | undefined = getRoomsTreatment?.data

    // admin
    const { data: getDataAdmin, error: errGetDataAdmin, isLoading: loadGetDataAdmin } = useSwr(endpoint.getAdmin())
    const findDataAdmin: { [key: string]: any } | undefined = getDataAdmin as {}
    const dataAdmin: AdminT[] | undefined = findDataAdmin?.data

    // doctors
    const { data: getDataDoctors, error: errGetDataDoctors, isLoading: loadDataDoctors } = useSwr(endpoint.getDoctors())
    const newDataDoctor: { [key: string]: any } | undefined = getDataDoctors as {}
    const getDoctorDocument: { [key: string]: any } | undefined = newDataDoctor?.data?.find((data: { [key: string]: any }) => data?.id === 'doctor')
    const doctors: ProfileDoctorT[] | undefined = getDoctorDocument?.data

    useEffect(()=>{
        if(!loadDataService && errDataService){
            setTriggedErr(true)
            setErrTriggedMessages('a server error occurred while retrieving patient data. Please try again')
        }
    }, [loadDataService, dataService])

    useEffect(()=>{
        if(!loadGetDataAdmin && errGetDataAdmin){
            setTriggedErr(true)
            setErrTriggedMessages('a server error occurred while retrieving admin data. Please try again')
        }
    }, [loadGetDataAdmin, getDataAdmin])

    useEffect(()=>{
        if(!loadDataDoctors && errGetDataDoctors){
            setTriggedErr(true)
            setErrTriggedMessages(`a server error occurred while retrieving doctor's data. Please try again`)
        }
    }, [loadDataDoctors, getDataDoctors])

    if(triggedErr){
        throw new AuthRequiredError(errTriggedMessages)
    }

    function pushTriggedErr(message: string):void{
        setTriggedErr(true)
        setErrTriggedMessages(message)
    }

    return {
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
        pushTriggedErr,
    }
}

export default ServicingHours