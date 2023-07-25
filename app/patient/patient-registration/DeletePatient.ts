'use client'

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import {useRouter} from 'next/navigation'
import { API } from "lib/api"
import { preloadFetch } from 'lib/useFetch/preloadFetch'
import { endpoint } from "lib/api/endpoint"
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT } from "lib/types/PatientT.types"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { DataTableContentT } from "lib/types/FilterT"
import { SubmitFinishedTreatmentT } from "lib/types/InputT.type"
import { createDateFormat } from "lib/formats/createDateFormat"
import { createHourFormat } from "lib/formats/createHourFormat"
import { authStore } from "lib/useZustand/auth"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"
import { faBan, faTrash } from "@fortawesome/free-solid-svg-icons"
import { PopupSetting } from "lib/types/TableT.type"

type Props = {
    findDataRegistration: (
        dataPatientRegis: PatientRegistrationT[] | undefined,
        dataConfirmationPatients: ConfirmationPatientsT[] | undefined,
        dataFinishTreatment: PatientFinishTreatmentT[] | undefined
    ) => void
    setOnPopupSetting: Dispatch<SetStateAction<PopupSetting>>
    onPopupSetting?: PopupSetting
}

export function DeletePatient({
    findDataRegistration,
    setOnPopupSetting,
    onPopupSetting
}: Props) {
    const [idLoadingDeletePatient, setIdLoadingDeletePatient] = useState<string[]>([])
    const [idLoadingCancelTreatment, setIdLoadingCancelTreatment] = useState<string[]>([])
    const [onMsgCancelTreatment, setOnMsgCancelTreatment] = useState<boolean>(false)
    const [inputMsgCancelPatient, setInputMsgCancelPatient] = useState<string>('')

    const {
        dataPatientRegis,
        pushTriggedErr
    } = ServicingHours()
    
    const {user} = authStore()
    const router = useRouter()

    function preloadDataRegistration(
        dataService: { [key: string]: any } | { [key: string]: any }[],
        patientId: string,
        actionFor: 'delete' | 'cancel'
    ): void {
        const newPatientRegistration: { [key: string]: any } | undefined = dataService as {}
        const getPatientRegistration: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientRegistrationT) => item?.id === 'patient-registration')
        const dataPatientRegis: PatientRegistrationT[] | undefined = getPatientRegistration?.data

        // confirmation patients
        const getConfirmationPatients: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: ConfirmationPatientsT) => item?.id === 'confirmation-patients')
        const dataConfirmationPatients: ConfirmationPatientsT[] | undefined = getConfirmationPatients?.data

        // finished treatment data
        const getFinishTreatment: { [key: string]: any } | undefined = newPatientRegistration?.data?.find((item: PatientFinishTreatmentT) => item?.id === 'finished-treatment')
        const dataFinishTreatment: PatientFinishTreatmentT[] | undefined = getFinishTreatment?.data

        setTimeout(() => {
            findDataRegistration(
                dataPatientRegis,
                dataConfirmationPatients,
                dataFinishTreatment
            )

            setTimeout(() => {
                if(actionFor === 'delete'){
                    const removeIdLoading = idLoadingDeletePatient.filter(id=> id !== patientId)
                    setIdLoadingDeletePatient(removeIdLoading)
                }else if(actionFor === 'cancel'){
                    const removeIdLoading = idLoadingCancelTreatment.filter(id=> id !== patientId)
                    setIdLoadingCancelTreatment(removeIdLoading)
                }
            }, 0);
        }, 500)
    }

    function clickDelete(
        id: string,
        name: string,
    ): void {
        const findId = idLoadingDeletePatient.find(patientId => patientId === id)
        if (!findId) {
            setOnPopupSetting({
                title: `Delete patient of "${name}"`,
                classIcon: 'text-pink-old',
                classBtnNext: 'bg-pink-old border-pink-old hover:bg-white hover:text-pink-old hover:border-pink-old',
                iconPopup: faTrash,
                nameBtnNext: 'Yes',
                patientId: id,
                categoryAction: 'delete-patient'
            })
        }
    }

    function nextConfirmDelete(id: string):void{
        setIdLoadingDeletePatient((current) => [...current, id])
        deleteDataPersonalPatient(id)
        setOnPopupSetting({} as PopupSetting)
    }

    function deleteDataPersonalPatient(id: string): void {
        API().APIDeletePatientData(
            'patient-registration',
            id,
            id
        )
            .then((deleteResult) => {
                preloadFetch(endpoint.getServicingHours())
                    .then((res) => {
                        if (res?.data) {
                            let newId: {[key: string]: any} = deleteResult as {[key: string]: any}
                            preloadDataRegistration(res, newId?.id as string, 'delete')
                            alert(`Successfully deleted data patient`)
                        } else {
                            pushTriggedErr('error preload data service. no property "data" found')
                        }
                    })
                    .catch(err => {
                        pushTriggedErr('error preload data service')
                    })
            })
            .catch((err: any) => {
                pushTriggedErr('a server error has occurred. Please try again later')
            })
    }

    // action cancel treatment
    function clickCancelTreatment(id: string, name: string):void{
        const findId = idLoadingCancelTreatment.find(patientId => patientId === id)
        if(!findId){
                setOnPopupSetting({
                    title: `Cancel patient registration "${name}"?`,
                    classIcon: 'text-red-default',
                    classBtnNext: 'bg-red border-red-default hover:bg-white hover:text-red-default hover:border-red-default',
                    iconPopup: faBan,
                    nameBtnNext: 'Yes',
                    patientId: id,
                    categoryAction: 'cancel-treatment'
                })
        }
    }

    function nextCancelTreatment():void{
        setOnMsgCancelTreatment(true)
    }
    
    function handleCancelMsg(e: ChangeEvent<HTMLInputElement>):void{
        setInputMsgCancelPatient(e.target.value)
    }

    function submitCancelTreatment():void{
        if(inputMsgCancelPatient.length > 0){
            setIdLoadingCancelTreatment((current)=>[...current, onPopupSetting?.patientId as string])
            pushCancelTreatment(onPopupSetting?.patientId as string)
            setOnPopupSetting({} as PopupSetting)
            setOnMsgCancelTreatment(false)
        }
    }

    function pushCancelTreatment(patientId: string):void{
        const data: SubmitFinishedTreatmentT = {
            patientId: patientId,
            confirmedTime: {
                dateConfirm: createDateFormat(new Date),
                confirmHour: createHourFormat(new Date())
            },
            adminInfo: {
                adminId: user.user?.id as string
            },
            isCanceled: true,
            messageCancelled: inputMsgCancelPatient
        }
        API().APIPostPatientData(
            'finished-treatment',
            data
        )
        .then(finishedRes=>{
            if(finishedRes?.patientId){
                preloadFetch(endpoint.getServicingHours())
                    .then((res) => {
                        if (res?.data) {
                            alert('Successfully cancel patient registration')
                            const findPatientRegis = dataPatientRegis?.find(patient=>patient.id === finishedRes?.patientId)
                            const getName = findPatientRegis?.patientName?.replace(specialCharacter, '')?.replace(spaceString, '')

                            setTimeout(() => {
                                router.push(`patient-registration/personal-data/not-yet-confirmed/${getName}/${findPatientRegis?.id}`) 
                            }, 0)
                        } else {
                            pushTriggedErr('error preload data service. no property "data" found')
                        }
                    })
                    .catch(err => {
                        pushTriggedErr('error preload data service')
                    })
            }
        })
        .catch(err=>pushTriggedErr('a server error occurred while canceling the patient. please try again'))
    }

    return {
        clickDelete,
        clickCancelTreatment,
        nextCancelTreatment,
        nextConfirmDelete,
        onMsgCancelTreatment,
        submitCancelTreatment,
        setOnMsgCancelTreatment,
        handleCancelMsg,
        inputMsgCancelPatient,
        idLoadingCancelTreatment,
        idLoadingDeletePatient
    }
}