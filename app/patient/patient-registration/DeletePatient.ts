'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import {useRouter} from 'next/navigation'
import { API } from "lib/api"
import { preloadFetch } from 'lib/useFetch/preloadFetch'
import { endpoint } from "lib/api/endpoint"
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT } from "lib/types/PatientT.types"
import ServicingHours from "lib/actions/ServicingHours"
import { DataTableContentT } from "lib/types/FilterT"
import { SubmitFinishedTreatmentT } from "lib/types/InputT.type"
import { createDateFormat } from "lib/dates/createDateFormat"
import { createHourFormat } from "lib/dates/createHourFormat"
import { authStore } from "lib/useZustand/auth"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faBan, faTrash } from "@fortawesome/free-solid-svg-icons"

type PopupSetting = {
    title: string
    classIcon?: string
    classBtnNext?: string
    iconPopup?: IconDefinition
    nameBtnNext: string
    patientId?: string
    categoryAction: 'edit-patient' | 'cancel-treatment' | 'delete-patient'
}

type Props = {
    findDataRegistration: (
        dataPatientRegis: PatientRegistrationT[] | undefined,
        dataConfirmationPatients: ConfirmationPatientsT[] | undefined,
        dataFinishTreatment: PatientFinishTreatmentT[] | undefined
    ) => void
    dataColumns: DataTableContentT[]
    setOnPopupSetting: Dispatch<SetStateAction<PopupSetting>>
}

export function DeletePatient({
    findDataRegistration,
    dataColumns,
    setOnPopupSetting
}: Props) {
    const [idLoadingDeletePatient, setIdLoadingDeletePatient] = useState<string[]>([])
    const [idLoadingCancelTreatment, setIdLoadingCancelTreatment] = useState<string[]>([])

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

    function onLoadingDelete(): void {
        if (
            dataColumns.length > 0
        ) {
            dataColumns.forEach(patient => {
                const deleteIconEl = document.getElementById(`iconDelete${patient.id}`) as HTMLElement
                const loadingIconEl = document.getElementById(`loadDelete${patient.id}`) as HTMLElement

                if (
                    deleteIconEl &&
                    loadingIconEl
                ) {
                    deleteIconEl.style.display = 'flex'
                    loadingIconEl.style.display = 'none'
                }

                idLoadingDeletePatient.forEach(id => {
                    const deleteIconEl = document.getElementById(`iconDelete${id}`) as HTMLElement
                    const loadingIconEl = document.getElementById(`loadDelete${id}`) as HTMLElement

                    if (
                        deleteIconEl &&
                        loadingIconEl
                    ) {
                        deleteIconEl.style.display = 'none'
                        loadingIconEl.style.display = 'flex'
                    }
                })
            })
        }
    }

    useEffect(() => {
        onLoadingDelete()
    }, [idLoadingDeletePatient, dataColumns])


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

    function nextCancelTreatment(id: string):void{
        setIdLoadingCancelTreatment((current)=>[...current, id])
        pushCancelTreatment(id)
        setOnPopupSetting({} as PopupSetting)
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
            isCanceled: true
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
                            // preloadDataRegistration(res, finishedRes?.id as string, 'cancel')

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

    function onLoadingCancelTreatment():void{
        if(dataColumns.length > 0){
            dataColumns.forEach(patient => {
                const cancelIconEl = document.getElementById(`iconCancel${patient.id}`) as HTMLElement
                const loadingIconEl = document.getElementById(`loadingCancel${patient.id}`) as HTMLElement

                if (
                    cancelIconEl &&
                    loadingIconEl
                ) {
                    cancelIconEl.style.display = 'flex'
                    loadingIconEl.style.display = 'none'
                }

                idLoadingCancelTreatment.forEach(id => {
                    const cancelIconEl = document.getElementById(`iconCancel${id}`) as HTMLElement
                    const loadingIconEl = document.getElementById(`loadingCancel${id}`) as HTMLElement

                    if (
                        cancelIconEl &&
                        loadingIconEl
                    ) {
                        cancelIconEl.style.display = 'none'
                        loadingIconEl.style.display = 'flex'
                    }
                })
            })
        }
    }

    useEffect(()=>{
        onLoadingCancelTreatment()
    }, [idLoadingCancelTreatment, dataColumns])
    // end action cancel treatment

    return {
        clickDelete,
        clickCancelTreatment,
        nextCancelTreatment,
        nextConfirmDelete
    }
}