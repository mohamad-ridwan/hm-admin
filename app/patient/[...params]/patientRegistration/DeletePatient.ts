'use client'

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import { useRouter } from 'next/navigation'
import { API } from "lib/api"
import { UsePatientData } from "lib/dataInformation/UsePatientData"
import { SubmitFinishedTreatmentT } from "lib/types/InputT.type"
import { createDateFormat } from "lib/formats/createDateFormat"
import { createHourFormat } from "lib/formats/createHourFormat"
import { authStore } from "lib/useZustand/auth"
import {  AlertsT, PopupSettings } from "lib/types/TableT.type"
import { faBan } from "@fortawesome/free-solid-svg-icons"
import { navigationStore } from "lib/useZustand/navigation"

type Props = {
    params?: string
    setOnModalSettings?: Dispatch<SetStateAction<PopupSettings>>
}

export function DeletePatient({
    params,
    setOnModalSettings
}: Props) {
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
    const [loadingCancelTreatment, setLoadingCancelTreatment] = useState<boolean>(false)
    const [onMsgCancelTreatment, setOnMsgCancelTreatment] = useState<boolean>(false)
    const [inputMsgCancelPatient, setInputMsgCancelPatient] = useState<string>('')
    const [isMenuActive, setIsMenuActive] = useState<boolean>(false)

    const {
        detailDataPatientRegis,
        dataConfirmPatient,
        drugCounterPatient,
        dataPatientFinishTreatment,
        pushTriggedErr
    } = UsePatientData({ params })

    const { user } = authStore()
    const {setOnAlerts} = navigationStore()

    const router = useRouter()

    async function pushDeletePatient(
        roleId: string,
        idDocument: string,
        patientId: string,
        errMessage: string
    ): Promise<{ [key: string]: any }> {
        return await new Promise((resolve, reject) => {
            API().APIDeletePatientData(
                roleId,
                idDocument,
                patientId
            )
                .then((res) => {
                    const newData = res as { [key: string]: any }
                    if (newData?.patientId) {
                        resolve(newData)
                    } else {
                        reject(errMessage)
                    }
                })
                .catch(err => reject(errMessage))
        })
    }

    function clickDelete(patientId: string): void {
        if (loadingDelete === false) {
            setLoadingDelete(true)
            pushDeletePatient(
                'finished-treatment',
                dataPatientFinishTreatment?.id,
                patientId,
                'There was an error deleting patient data after treatment. please try again'
            )
                .then(res => {
                    return pushDeletePatient(
                        'drug-counter',
                        drugCounterPatient?.id,
                        patientId,
                        'There was an error deleting counter patient data. please try again'
                    )
                })
                .then(res => {
                    return pushDeletePatient(
                        'confirmation-patients',
                        dataConfirmPatient?.id,
                        patientId,
                        'There was an error deleting patient confirmation data. please try again'
                    )
                })
                .then(res => {
                    return pushDeletePatient(
                        'patient-registration',
                        patientId,
                        patientId,
                        'There was an error deleting patient registration data. please try again'
                    )
                })
                .then(res => {
                    successDelete()
                })
                .catch(err => pushTriggedErr(err as string))
        }
    }

    function successDelete(): void {
        router.push('/patient/patient-registration')
        setLoadingDelete(false)
        setOnAlerts({
            onAlert: true,
            title: 'Successfully deleted all patient data',
            desc: 'All patient data is deleted'
        })
        setTimeout(() => {
            setOnAlerts({} as AlertsT)
        }, 3000);
    }

    // action cancel treatment
    function clickCancelTreatment(): void {
        if (loadingCancelTreatment === false && typeof setOnModalSettings !== 'undefined') {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: 'Cancel patient registration?',
                classIcon: 'text-font-color-2',
                iconPopup: faBan,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => {
                            setOnMsgCancelTreatment(true)
                            setOnModalSettings({} as PopupSettings)
                        },
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.6rem',
                            marginTop: '0.5rem'
                        }
                    },
                    {
                        nameBtn: 'Cancel',
                        classBtn: 'bg-white border-none',
                        classLoading: 'hidden',
                        clickBtn: () => setOnModalSettings({} as PopupSettings),
                        styleBtn: {
                            padding: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#495057'
                        }
                    },
                ]
            })
        }
    }

    function submitCancelTreatment(): void {
        if (inputMsgCancelPatient.length > 0) {
            setLoadingCancelTreatment(true)
            setOnMsgCancelTreatment(false)
            const data: SubmitFinishedTreatmentT = {
                patientId: detailDataPatientRegis?.id,
                confirmedTime: {
                    dateConfirm: createDateFormat(new Date()),
                    confirmHour: createHourFormat(new Date())
                },
                adminInfo: { adminId: user.user?.id as string },
                isCanceled: true,
                messageCancelled: inputMsgCancelPatient
            }
            API().APIPostPatientData(
                'finished-treatment',
                data,
            )
                .then(res => {
                    setOnAlerts({
                        onAlert: true,
                        title: 'Successfully cancel patient registration',
                        desc: 'Patient registration was cancelled'
                    })
                    setTimeout(() => {
                        setOnAlerts({} as AlertsT)
                    }, 3000);
                    setLoadingCancelTreatment(false)
                    window.location.reload()
                })
                .catch(err => pushTriggedErr('A server error occurred while unregistering the patient. please try again'))
        }
    }

    function handleCancelMsg(e?: ChangeEvent<HTMLInputElement>): void {
        setInputMsgCancelPatient(e?.target.value as string)
    }
    // end action cancel treatment

    function clickMenu(): void {
        setIsMenuActive(!isMenuActive)
    }

    return {
        clickDelete,
        loadingDelete,
        loadingCancelTreatment,
        clickCancelTreatment,
        onMsgCancelTreatment,
        setOnMsgCancelTreatment,
        handleCancelMsg,
        inputMsgCancelPatient,
        submitCancelTreatment,
        isMenuActive,
        clickMenu
    }
}