'use client'

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import ServicingHours from "lib/actions/ServicingHours"
import { useRouter } from 'next/navigation'
import { API } from "lib/api"
import { createDateFormat } from "lib/dates/createDateFormat"
import { createHourFormat } from "lib/dates/createHourFormat"
import { spaceString } from "lib/regex/spaceString"
import { specialCharacter } from "lib/regex/specialCharacter"
import { DataTableContentT } from "lib/types/FilterT"
import { SubmitFinishedTreatmentT } from "lib/types/InputT.type"
import { UserT } from "lib/types/ZustandT.types"
import { PopupSetting } from "lib/types/TableT.type"
import { faBan } from "@fortawesome/free-solid-svg-icons"

type Props = {
    user: UserT
    setOnPopupSetting?: Dispatch<SetStateAction<PopupSetting>>
    onPopupSetting?: PopupSetting
}

export function DeletePatient({
    user,
    setOnPopupSetting,
    onPopupSetting
}: Props) {
    const [loadingIdPatientsDelete, setLoadingIdPatientsDelete] = useState<string[]>([])
    const [idLoadingCancelTreatment, setIdLoadingCancelTreatment] = useState<string[]>([])
    const [namePatientToDelete, setNamePatientToDelete] = useState<string | null>(null)
    const [idPatientToDelete, setIdPatientToDelete] = useState<string>('')
    const [onPopupChooseDelete, setOnPopupChooseDelete] = useState<boolean>(false)
    const [onMsgCancelTreatment, setOnMsgCancelTreatment] = useState<boolean>(false)
    const [inputMsgCancelPatient, setInputMsgCancelPatient] = useState<string>('')

    const {
        dataConfirmationPatients,
        dataPatientRegis,
        pushTriggedErr
    } = ServicingHours()

    const router = useRouter()

    function clickDeleteIcon(
        patientId: string,
        patientName: string
    ): void {
        const findId = loadingIdPatientsDelete.find(id => id === patientId)
        if (!findId) {
            setNamePatientToDelete(patientName)
            setIdPatientToDelete(patientId)
            setOnPopupChooseDelete(true)
        }
    }

    function closePopupChooseDelete() {
        setOnPopupChooseDelete(false)
    }

    function deleteActionCallback(
        roleId: string,
        patientId: string,
        mainPatientId: string,
        alertMessage?: string,
        errMessage?: string,
        endDeleted?: boolean,
        cb?: () => void
    ): void {
        API().APIDeletePatientData(
            roleId,
            patientId,
            mainPatientId
        )
            .then((result) => {
                if (typeof cb === 'function') {
                    cb()
                }
                if (endDeleted) {
                    const getRes: { [key: string]: any } = result as {}
                    const removeIdLoading = loadingIdPatientsDelete.filter(id => id !== getRes?.patientId)
                    setLoadingIdPatientsDelete(removeIdLoading)
                    alert(alertMessage)
                }
            })
            .catch(err => {
                pushTriggedErr(errMessage as string)
            })
    }

    // click delete detail and confirm data
    function clickDeleteDetailAndConfirmData(): void {
        if (typeof setOnPopupSetting !== 'undefined') {
            setOnPopupSetting({
                title: `Delete details and confirmation data from patient "${namePatientToDelete}"?`,
                classIcon: 'text-font-color-2',
                classBtnNext: 'hover:bg-white',
                iconPopup: faBan,
                nameBtnNext: 'Yes',
                patientId: idPatientToDelete,
                categoryAction: 'delete-detail-and-confirmation'
            })
        }
    }

    function nextDeleteDetailAndConfirmData():void{
        setLoadingIdPatientsDelete((current) => [...current, idPatientToDelete])
        setOnPopupChooseDelete(false)

        const findIdConfirmData = dataConfirmationPatients?.find(patient => patient.patientId === idPatientToDelete)
        deleteActionCallback(
            'confirmation-patients',
            findIdConfirmData?.id as string,
            idPatientToDelete,
            '',
            'There was an error deleting patient data details and confirmation',
            false,
            () => deleteActionCallback(
                'patient-registration',
                idPatientToDelete,
                idPatientToDelete,
                'delete successfully',
                'There was an error deleting patient data details and confirmation',
                true
            )
        )

        if (typeof setOnPopupSetting !== 'undefined') {
            setOnPopupSetting({} as PopupSetting)
        }
    }

    function clickDeleteConfirmationData(): void {
        if (typeof setOnPopupSetting !== 'undefined') {
            setOnPopupSetting({
                title: `Delete confirmation data from "${namePatientToDelete}" patient`,
                classIcon: 'text-font-color-2',
                classBtnNext: 'hover:bg-white',
                iconPopup: faBan,
                nameBtnNext: 'Yes',
                patientId: idPatientToDelete,
                categoryAction: 'delete-confirmation'
            })
        }
    }

    function nextDeleteConfirmationData(): void {
        setLoadingIdPatientsDelete((current) => [...current, idPatientToDelete])
        setOnPopupChooseDelete(false)

        const findIdConfirmData = dataConfirmationPatients?.find(patient => patient.patientId === idPatientToDelete)

        deleteActionCallback(
            'confirmation-patients',
            findIdConfirmData?.id as string,
            idPatientToDelete,
            'delete successfully',
            'There was an error deleting patient confirmation data',
            true
        )

        if (typeof setOnPopupSetting !== 'undefined') {
            setOnPopupSetting({} as PopupSetting)
        }
    }

    // action delete
    // function loadingDeleteIcon(): void {
    //     if (dataColumns.length > 0) {
    //         dataColumns.forEach(patient => {
    //             const loadingElement = document.getElementById(`loadDelete${patient.id}`) as HTMLElement
    //             const iconDelete = document.getElementById(`iconDelete${patient.id}`) as HTMLElement

    //             if (loadingElement && iconDelete) {
    //                 loadingElement.style.display = 'none'
    //                 iconDelete.style.display = 'flex'
    //             }

    //             loadingIdPatientsDelete.forEach(id => {
    //                 const loadingElement = document.getElementById(`loadDelete${id}`) as HTMLElement
    //                 const iconDelete = document.getElementById(`iconDelete${id}`) as HTMLElement

    //                 if (loadingElement && iconDelete) {
    //                     loadingElement.style.display = 'flex'
    //                     iconDelete.style.display = 'none'
    //                 }
    //             })
    //         })
    //     }
    // }

    // useEffect(() => {
    //     loadingDeleteIcon()
    // }, [loadingIdPatientsDelete, dataColumns])

    // action cancel treatment
    function clickCancelTreatment(id: string, name: string): void {
        const findId = idLoadingCancelTreatment.find(patientId => patientId === id)
        if (!findId) {
            if (typeof setOnPopupSetting !== 'undefined') {
                setOnPopupSetting({
                    title: `cancel treatment from patient "${name}"?`,
                    classIcon: 'text-font-color-2',
                    classBtnNext: 'hover:bg-white',
                    iconPopup: faBan,
                    nameBtnNext: 'Yes',
                    patientId: id,
                    categoryAction: 'cancel-treatment'
                })
            }
        }
    }

    function nextCancelTreatment(): void {
        setOnMsgCancelTreatment(true)
    }

    function handleCancelMsg(e: ChangeEvent<HTMLInputElement>):void{
        setInputMsgCancelPatient(e.target.value)
    }

    function submitCancelTreatment():void{
        if(inputMsgCancelPatient.length > 0){
            setIdLoadingCancelTreatment((current) => [...current, onPopupSetting?.patientId as string])
            pushCancelTreatment(onPopupSetting?.patientId as string)
            if (typeof setOnPopupSetting !== 'undefined') {
                setOnPopupSetting({} as PopupSetting)
            }
            setOnMsgCancelTreatment(false)
        }
    }

    function pushCancelTreatment(patientId: string) {
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
            .then(res => {
                if (res?.patientId) {
                    const removeIdLoading = idLoadingCancelTreatment.filter(id => id !== res?.patientId)
                    setIdLoadingCancelTreatment(removeIdLoading)

                    const findPatientRegis = dataPatientRegis?.find(patient => patient.id === res?.patientId)
                    const getName = findPatientRegis?.patientName?.replace(specialCharacter, '')?.replace(spaceString, '')

                    setTimeout(() => {
                        router.push(`/patient/patient-registration/personal-data/confirmed/${getName}/${findPatientRegis?.id}`)
                    }, 0)
                }
            })
            .catch(err => pushTriggedErr('a server error occurred while canceling the patient. please try again'))
    }

    // function onLoadingCancelTreatment(): void {
    //     if (dataColumns.length > 0) {
    //         dataColumns.forEach(patient => {
    //             const loadingCancel = document.getElementById(`loadingCancel${patient.id}`) as HTMLElement
    //             const iconCancel = document.getElementById(`iconCancel${patient.id}`) as HTMLElement

    //             if (loadingCancel && iconCancel) {
    //                 loadingCancel.style.display = 'none'
    //                 iconCancel.style.display = 'flex'
    //             }

    //             idLoadingCancelTreatment.forEach(id => {
    //                 const loadingCancel = document.getElementById(`loadingCancel${id}`) as HTMLElement
    //                 const iconCancel = document.getElementById(`iconCancel${id}`) as HTMLElement

    //                 if (loadingCancel && iconCancel) {
    //                     loadingCancel.style.display = 'flex'
    //                     iconCancel.style.display = 'none'
    //                 }
    //             })
    //         })
    //     }
    // }

    // useEffect(() => {
    //     onLoadingCancelTreatment()
    // }, [idLoadingCancelTreatment, dataColumns])
    // end action cancel treatment

    return {
        clickDeleteIcon,
        namePatientToDelete,
        onPopupChooseDelete,
        setOnPopupChooseDelete,
        closePopupChooseDelete,
        clickDeleteDetailAndConfirmData,
        clickDeleteConfirmationData,
        clickCancelTreatment,
        nextCancelTreatment,
        nextDeleteConfirmationData,
        nextDeleteDetailAndConfirmData,
        handleCancelMsg,
        submitCancelTreatment,
        onMsgCancelTreatment,
        setOnMsgCancelTreatment,
        inputMsgCancelPatient,
        idLoadingCancelTreatment,
        loadingIdPatientsDelete
    }
}