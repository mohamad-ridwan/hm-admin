'use client'

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import { useRouter } from 'next/navigation'
import { API } from "lib/api"
import { preloadFetch } from 'lib/useFetch/preloadFetch'
import { endpoint } from "lib/api/endpoint"
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT } from "lib/types/PatientT.types"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { SubmitFinishedTreatmentT } from "lib/types/InputT.type"
import { createDateFormat } from "lib/formats/createDateFormat"
import { createHourFormat } from "lib/formats/createHourFormat"
import { authStore } from "lib/useZustand/auth"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"
import { faBan, faTrash } from "@fortawesome/free-solid-svg-icons"
import { AlertsT, PopupSettings } from "lib/types/TableT.type"
import { navigationStore } from "lib/useZustand/navigation"

type Props = {
    findDataRegistration: (
        dataPatientRegis: PatientRegistrationT[] | undefined,
        dataConfirmationPatients: ConfirmationPatientsT[] | undefined,
        dataFinishTreatment: PatientFinishTreatmentT[] | undefined
    ) => void
    setOnModalSettings: Dispatch<SetStateAction<PopupSettings>>
    onModalSettings?: PopupSettings
}

export function DeletePatient({
    findDataRegistration,
    setOnModalSettings,
    onModalSettings
}: Props) {
    const [idLoadingDeletePatient, setIdLoadingDeletePatient] = useState<string[]>([])
    const [idLoadingCancelTreatment, setIdLoadingCancelTreatment] = useState<string[]>([])
    const [onMsgCancelTreatment, setOnMsgCancelTreatment] = useState<boolean>(false)
    const [inputMsgCancelPatient, setInputMsgCancelPatient] = useState<string>('')

    const {
        dataPatientRegis,
        pushTriggedErr
    } = ServicingHours()

    const { user } = authStore()
    const {setOnAlerts} = navigationStore()
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
                if (actionFor === 'delete') {
                    const removeIdLoading = idLoadingDeletePatient.filter(id => id !== patientId)
                    setIdLoadingDeletePatient(removeIdLoading)
                } else if (actionFor === 'cancel') {
                    const removeIdLoading = idLoadingCancelTreatment.filter(id => id !== patientId)
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
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: `Delete patient of "${name}"`,
                classIcon: 'text-font-color-2',
                iconPopup: faTrash,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => nextConfirmDelete(id),
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

    function nextConfirmDelete(id: string): void {
        setIdLoadingDeletePatient((current) => [...current, id])
        deleteDataPersonalPatient(id)
        setOnModalSettings({} as PopupSettings)
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
                            let newId: { [key: string]: any } = deleteResult as { [key: string]: any }
                            preloadDataRegistration(res, newId?.id as string, 'delete')
                            setOnAlerts({
                                onAlert: true,
                                title: 'Successfully deleted data patient',
                                desc: 'The patient has been removed from the registration list'
                            })
                            setTimeout(() => {
                                setOnAlerts({} as AlertsT)
                            }, 3000);
                            window.location.reload()
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
    function clickCancelTreatment(id: string, name: string): void {
        const findId = idLoadingCancelTreatment.find(patientId => patientId === id)
        if (!findId) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: `Cancel patient registration "${name}"?`,
                classIcon: 'text-font-color-2',
                iconPopup: faBan,
                patientId: id,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => nextCancelTreatment(),
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

    function nextCancelTreatment(): void {
        setOnMsgCancelTreatment(true)
    }

    function handleCancelMsg(e: ChangeEvent<HTMLInputElement>): void {
        setInputMsgCancelPatient(e.target.value)
    }

    function submitCancelTreatment(): void {
        if (inputMsgCancelPatient.length > 0) {
            setIdLoadingCancelTreatment((current) => [...current, onModalSettings?.patientId as string])
            pushCancelTreatment(onModalSettings?.patientId as string)
            setOnModalSettings({} as PopupSettings)
            setOnMsgCancelTreatment(false)
        }
    }

    function pushCancelTreatment(patientId: string): void {
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
            .then(finishedRes => {
                if (finishedRes?.patientId) {
                    preloadFetch(endpoint.getServicingHours())
                        .then((res) => {
                            if (res?.data) {
                                setOnAlerts({
                                    onAlert: true,
                                    title: 'Successfully cancel patient registration',
                                    desc: `The patient's treatment schedule has been cancelled`
                                })
                                setTimeout(() => {
                                    setOnAlerts({} as AlertsT)
                                }, 3000);
                                const findPatientRegis = dataPatientRegis?.find(patient => patient.id === finishedRes?.patientId)
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
            .catch(err => pushTriggedErr('a server error occurred while canceling the patient. please try again'))
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