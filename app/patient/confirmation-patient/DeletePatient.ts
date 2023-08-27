'use client'

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { useRouter } from 'next/navigation'
import { API } from "lib/api"
import { createDateFormat } from "lib/formats/createDateFormat"
import { createHourFormat } from "lib/formats/createHourFormat"
import { spaceString } from "lib/regex/spaceString"
import { specialCharacter } from "lib/regex/specialCharacter"
import { SubmitFinishedTreatmentT } from "lib/types/InputT.type"
import { UserT } from "lib/types/ZustandT.types"
import { AlertsT, PopupSettings } from "lib/types/TableT.type"
import { faBan } from "@fortawesome/free-solid-svg-icons"
import { navigationStore } from "lib/useZustand/navigation"

type Props = {
    user: UserT
    setOnModalSettings?: Dispatch<SetStateAction<PopupSettings>>
    onModalSettings?: PopupSettings
}

export function DeletePatient({
    user,
    setOnModalSettings,
    onModalSettings
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

    const {setOnAlerts} = navigationStore()

    const router = useRouter()

    function clickDeleteIcon(
        patientId: string,
        patientName: string
    ): void {
        const findId = loadingIdPatientsDelete.find(id => id === patientId)
        if (!findId) {
            setNamePatientToDelete(patientName)
            setIdPatientToDelete(patientId)
            if (typeof setOnModalSettings !== 'undefined') {
                setOnModalSettings({
                    clickClose: () => setOnModalSettings({} as PopupSettings),
                    title: 'What do you want to delete?',
                    classIcon: 'text-font-color-2',
                    iconPopup: faBan,
                    actionsData: [
                        {
                            nameBtn: 'All Data',
                            classBtn: 'bg-orange hover:bg-white border-orange hover:border-orange hover:text-orange',
                            classLoading: 'hidden',
                            clickBtn: () => clickDeleteDetailAndConfirmData(patientId, patientName),
                            styleBtn: {
                                padding: '0.5rem',
                                marginRight: '0.5rem',
                                marginTop: '0.5rem'
                            }
                        },
                        {
                            nameBtn: 'Confirmation data',
                            classBtn: 'bg-pink-old hover:bg-white border-pink-old hover:border-pink-old hover:text-pink-old',
                            classLoading: 'hidden',
                            clickBtn: () => clickDeleteConfirmationData(patientId, patientName),
                            styleBtn: {
                                padding: '0.5rem',
                                marginRight: '0.5rem',
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
                                marginRight: '0.5rem',
                                marginTop: '0.5rem',
                                color: '#495057',
                            }
                        },
                    ]
                })
            }
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
                    setOnAlerts({
                        onAlert: true,
                        title: alertMessage as string,
                        desc: ''
                    })
                    setTimeout(() => {
                        setOnAlerts({} as AlertsT)
                    }, 3000);
                    window.location.reload()
                }
            })
            .catch(err => {
                pushTriggedErr(errMessage as string)
            })
    }

    // click delete detail and confirm data
    function clickDeleteDetailAndConfirmData(
        patientId: string,
        patientName: string
    ): void {
        if (typeof setOnModalSettings !== 'undefined') {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: `Delete details and confirmation data from patient "${patientName}"?`,
                classIcon: 'text-font-color-2',
                iconPopup: faBan,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: ()=>nextDeleteDetailAndConfirmData(patientId),
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.5rem',
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
                            marginRight: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#495057',
                        }
                    },
                ]
            })
        }
    }

    function nextDeleteDetailAndConfirmData(patientId: string): void {
        setLoadingIdPatientsDelete((current) => [...current, patientId])
        // setOnPopupChooseDelete(false)

        const findIdConfirmData = dataConfirmationPatients?.find(patient => patient.patientId === patientId)
        deleteActionCallback(
            'confirmation-patients',
            findIdConfirmData?.id as string,
            patientId,
            '',
            'There was an error deleting patient data details and confirmation',
            false,
            () => deleteActionCallback(
                'patient-registration',
                patientId,
                patientId,
                'delete successfully',
                'There was an error deleting patient data details and confirmation',
                true
            )
        )

        if (typeof setOnModalSettings !== 'undefined') {
            setOnModalSettings({} as PopupSettings)
        }
    }

    function clickDeleteConfirmationData(
        patientId: string,
        patientName: string
    ): void {
        if (typeof setOnModalSettings !== 'undefined') {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: `Delete confirmation data from "${patientName}" patient`,
                classIcon: 'text-font-color-2',
                iconPopup: faBan,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => nextDeleteConfirmationData(patientId),
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.5rem',
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
                            marginRight: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#495057',
                        }
                    },
                ]
            })
        }
    }

    function nextDeleteConfirmationData(
        patientId: string
    ): void {
        setLoadingIdPatientsDelete((current) => [...current, patientId])
        const findIdConfirmData = dataConfirmationPatients?.find(patient => patient.patientId === patientId)

        deleteActionCallback(
            'confirmation-patients',
            findIdConfirmData?.id as string,
            patientId,
            'delete successfully',
            'There was an error deleting patient confirmation data',
            true
        )

        if (typeof setOnModalSettings !== 'undefined') {
            setOnModalSettings({} as PopupSettings)
        }
    }

    // action cancel treatment
    function clickCancelTreatment(id: string, name: string): void {
        const findId = idLoadingCancelTreatment.find(patientId => patientId === id)
        if (!findId) {
            if (typeof setOnModalSettings !== 'undefined') {
                setOnModalSettings({
                    clickClose: () => setOnModalSettings({} as PopupSettings),
                    title: `Cancel treatment from patient "${name}"?`,
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
                                marginRight: '0.5rem',
                                marginTop: '0.5rem',
                                color: '#495057',
                            }
                        },
                    ]
                })
            }
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
            if (typeof setOnModalSettings !== 'undefined') {
                setOnModalSettings({} as PopupSettings)
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
                    setOnAlerts({
                        onAlert: true,
                        title: 'Patient has been cancelled',
                        desc: 'Has successfully canceled the patient'
                    })
                    setTimeout(() => {
                        setOnAlerts({} as AlertsT)
                    }, 3000);
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