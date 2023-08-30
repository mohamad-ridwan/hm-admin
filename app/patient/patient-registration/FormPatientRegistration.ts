'use client'

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import { useParams, useRouter } from 'next/navigation'
import addMonths from "addmonths"
import { getDay } from "date-fns"
import { InputAddPatientT, InputEditPatientRegistrationT } from "lib/types/InputT.type"
import { mailRegex } from "lib/regex/mailRegex"
import { createDateFormat } from "lib/formats/createDateFormat"
import { API } from "lib/api"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { faPencil, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { AlertsT, PopupSettings } from "lib/types/TableT.type"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"
import { DataOptionT } from "lib/types/FilterT"
import { dayNamesInd } from "lib/formats/dayNamesInd"
import { PatientRegistrationT } from "lib/types/PatientT.types"
import { createHourFormat } from "lib/formats/createHourFormat"
import { navigationStore } from "lib/useZustand/navigation"

type Props = {
    setOnModalSettings?: Dispatch<SetStateAction<PopupSettings>>
}

function FormPatientRegistration({
    setOnModalSettings,
}: Props) {
    const [patientName, setPatientName] = useState<string | null>(null)
    const [valueInputEditDetailPatient, setValueInputEditDetailPatient] = useState<InputEditPatientRegistrationT>({
        patientName: '',
        phone: '',
        emailAddress: '',
        dateOfBirth: '',
        appointmentDate: '',
        message: '',
        patientComplaints: '',
        submissionDate: '',
        clock: ''
    })
    const [onPopupEdit, setOnPopupEdit] = useState<boolean>(false)
    const [idPatientToEdit, setIdPatientToEdit] = useState<string | null>(null)
    const [idLoadingEdit, setIdLoadingEdit] = useState<string[]>([])
    const [errEditInputDetailPatient, setErrEditInputDetailPatient] = useState<InputEditPatientRegistrationT>({} as InputEditPatientRegistrationT)
    const [onAddPatient, setOnAddPatient] = useState<boolean>(false)
    const [inputAddPatient, setInputAddPatient] = useState<InputAddPatientT>({
        patientName: '',
        phone: '',
        emailAddress: '',
        dateOfBirth: '',
        selectDay: 'Select Day',
        appointmentDate: '',
        patientComplaints: '',
        message: '',
    })
    const [errInputAddPatient, setErrInputAddPatient] = useState<InputAddPatientT>({} as InputAddPatientT)
    const [loadingSubmitAddPatient, setLoadingSubmitAddPatient] = useState<boolean>(false)

    const getDayName: DataOptionT = dayNamesInd.map(day => {
        const newName = `${day.substr(0, 1).toUpperCase()}${day.substr(1)}`
        return {
            id: newName,
            title: newName
        }
    })
    const [optionsDay] = useState<DataOptionT>([
        {
            id: 'Select Day',
            title: 'Select Day'
        },
        ...getDayName
    ])

    // swr fetching data
    // servicing hours
    const {
        dataPatientRegis,
        pushTriggedErr,
        getServicingHours
    } = ServicingHours({})

    const { setOnAlerts } = navigationStore()

    const params = useParams()
    const router = useRouter()

    const currentDate: string = createDateFormat(new Date()).split('/')[1]
    const minDateFormAddP: Date | undefined = getServicingHours?.id ? new Date(`${getServicingHours.minDate}-${currentDate}`) : undefined
    const maxDateFormAddP: Date | undefined = getServicingHours?.id ? addMonths(new Date(getServicingHours.maxDate), 0) : undefined
    const filterDate = (date: Date): number | boolean => {
        const day = getDay(date)
        const findIndexDay = dayNamesInd.findIndex(days => days === inputAddPatient.selectDay.toLowerCase())
        if (findIndexDay !== -1) {
            const checkDay = findIndexDay === 6 ? 0 : findIndexDay + 1
            return day === checkDay
        }
        return day === 0
    }

    function changeEditDetailPatient(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setValueInputEditDetailPatient({
            ...valueInputEditDetailPatient,
            [e.target.name]: e.target.value
        })

        setErrEditInputDetailPatient({
            ...errEditInputDetailPatient,
            [e.target.name]: ''
        })
    }

    function clickClosePopupEdit(): void {
        setOnPopupEdit(false)
        setValueInputEditDetailPatient({
            patientName: '',
            phone: '',
            emailAddress: '',
            dateOfBirth: '',
            appointmentDate: '',
            message: '',
            patientComplaints: '',
            submissionDate: '',
            clock: ''
        })
        setIdPatientToEdit(null)
    }

    function changeDateEditDetailPatient(e: ChangeEvent<HTMLInputElement> | Date | undefined, inputName: string): void {
        setValueInputEditDetailPatient({
            ...valueInputEditDetailPatient,
            [inputName]: !e ? '' : `${e as Date}`
        })

        setErrEditInputDetailPatient({
            ...errEditInputDetailPatient,
            [inputName]: ''
        })
    }

    // submit update
    function handleSubmitUpdate(): void {
        const findIdLoading = idLoadingEdit.find(loadingId => loadingId === idPatientToEdit)
        if (!findIdLoading) {
            validateSubmitUpdate()
                .then(res => {
                    if (typeof setOnModalSettings !== 'undefined') {
                        setOnModalSettings({
                            clickClose: () => setOnModalSettings({} as PopupSettings),
                            title: `Update patient "${patientName}"?`,
                            classIcon: 'text-font-color-2',
                            iconPopup: faPencil,
                            actionsData: [
                                {
                                    nameBtn: 'Save',
                                    classBtn: 'hover:bg-white',
                                    classLoading: 'hidden',
                                    clickBtn: () => {
                                        nextSubmitUpdate()
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
                                }
                            ]
                        })
                    }
                })
        }
    }

    function nextSubmitUpdate(): void {
        setErrEditInputDetailPatient({} as InputEditPatientRegistrationT)
        pushToUpdatePatient()
    }

    async function validateSubmitUpdate(): Promise<{ message: string }> {
        let err = {} as InputEditPatientRegistrationT

        if (!valueInputEditDetailPatient.patientName.trim()) {
            err.patientName = 'Must be required'
        }
        if (!valueInputEditDetailPatient.phone.trim()) {
            err.patientName = 'Must be required'
        }
        if (!valueInputEditDetailPatient.emailAddress.trim()) {
            err.emailAddress = 'Must be required'
        } else if (!mailRegex.test(valueInputEditDetailPatient.emailAddress)) {
            err.emailAddress = 'Invalid e-mail address'
        }
        if (!valueInputEditDetailPatient.dateOfBirth.trim()) {
            err.dateOfBirth = 'Must be required'
        }
        if (!valueInputEditDetailPatient.appointmentDate.trim()) {
            err.appointmentDate = 'Must be required'
        }
        if (!valueInputEditDetailPatient.message.trim()) {
            err.message = 'Must be required'
        }
        if (!valueInputEditDetailPatient.patientComplaints.trim()) {
            err.patientComplaints = 'Must be required'
        }
        if (!valueInputEditDetailPatient.submissionDate.trim()) {
            err.clock = 'Must be required'
        }

        return await new Promise((resolve, reject) => {
            if (Object.keys(err).length === 0) {
                resolve({ message: 'success' })
            } else {
                setErrEditInputDetailPatient(err)
            }
        })
    }

    // push to update patient data
    function pushToUpdatePatient(): void {
        setIdLoadingEdit((current) => [...current, idPatientToEdit as string])

        const {
            patientName,
            phone,
            emailAddress,
            dateOfBirth,
            appointmentDate,
            message,
            patientComplaints,
            submissionDate,
            clock
        } = valueInputEditDetailPatient

        const data = {
            patientName,
            phone,
            emailAddress,
            dateOfBirth: createDateFormat(dateOfBirth),
            appointmentDate: createDateFormat(appointmentDate),
            patientMessage: {
                message,
                patientComplaints
            },
            submissionDate: {
                submissionDate: createDateFormat(submissionDate),
                clock
            }
        }

        API().APIPutPatientData(
            'patient-registration',
            idPatientToEdit as string,
            data
        )
            .then((res) => {
                const removeLoadingId = idLoadingEdit.filter(id => id !== res?.id)
                setIdLoadingEdit(removeLoadingId)
                const isRoutePersonalData = params?.params?.includes('personal-data')
                const currentRoute = params?.params?.split('/')
                const newName = patientName.replace(specialCharacter, '').replace(spaceString, '')
                const newRoute = params?.params?.replace(currentRoute[3], newName)
                if (isRoutePersonalData) {
                    router.push(`/patient/${newRoute}`)
                }
                setOnAlerts({
                    onAlert: true,
                    title: 'Updated successfully',
                    desc: 'Successfully updated the patient'
                })
                setTimeout(() => {
                    setOnAlerts({} as AlertsT)
                }, 3000);
                window.location.reload()
            })
            .catch((err) => {
                pushTriggedErr('a server error occurred. please try again later')
            })
    }

    function clickEdit(
        id: string,
        name: string,
    ): void {
        const findPatient = dataPatientRegis?.find(patient => patient.id === id)
        if (findPatient) {
            const {
                patientName,
                phone,
                emailAddress,
                dateOfBirth,
                appointmentDate,
                patientMessage,
                submissionDate
            } = findPatient

            setIdPatientToEdit(findPatient?.id)
            setValueInputEditDetailPatient({
                patientName,
                phone,
                emailAddress,
                dateOfBirth,
                appointmentDate,
                message: patientMessage.message,
                patientComplaints: patientMessage.patientComplaints,
                submissionDate: submissionDate.submissionDate,
                clock: submissionDate.clock
            })
            setPatientName(name)
        } else {
            alert('an error occurred, please try again or reload the page')
        }
    }

    function clickAddPatient(): void {
        setOnAddPatient(!onAddPatient)
    }

    function changeInputAddPatient(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setInputAddPatient({
            ...inputAddPatient,
            [e.target.name]: e.target.value
        })
        setErrInputAddPatient({
            ...errInputAddPatient,
            [e.target.name]: ''
        })
    }

    function changeDateAddPatient(
        e: Date | ChangeEvent<HTMLInputElement> | undefined,
        inputName: "dateOfBirth" | "appointmentDate"
    ): void {
        setInputAddPatient({
            ...inputAddPatient,
            [inputName]: !e ? '' : createDateFormat(e as Date)
        })
        setErrInputAddPatient({
            ...errInputAddPatient,
            [inputName]: ''
        })
    }

    function handleSelectAddPatient(
        idElement: "dayAddPatient",
        nameInput: "selectDay"
    ): void {
        const elem = document.getElementById(idElement) as HTMLSelectElement
        const value = elem.options[elem.selectedIndex].value
        setInputAddPatient({
            ...inputAddPatient,
            [nameInput]: value
        })
        setErrInputAddPatient({
            ...errInputAddPatient,
            [nameInput]: ''
        })
    }

    function submitAddPatient(): void {
        if (
            loadingSubmitAddPatient === false &&
            validateFormAddPatient() &&
            typeof setOnModalSettings === 'function'
        ) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: 'Add patient?',
                classIcon: 'text-font-color-2',
                iconPopup: faUserPlus,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => confirmSubmitAddPatient(),
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
                    }
                ]
            })
        }
    }

    function validateFormAddPatient(): string | undefined {
        let err = {} as InputAddPatientT
        if (!inputAddPatient.patientName.trim()) {
            err.patientName = 'Must be required'
        }
        if (!inputAddPatient.phone.trim()) {
            err.phone = 'Must be required'
        }
        if (!inputAddPatient.emailAddress.trim()) {
            err.emailAddress = 'Must be required'
        } else if (!mailRegex.test(inputAddPatient.emailAddress)) {
            err.emailAddress = 'Invalid e-mail address'
        }
        if (!inputAddPatient.dateOfBirth.trim()) {
            err.dateOfBirth = 'Must be required'
        }
        if (inputAddPatient.selectDay === 'Select Day') {
            err.selectDay = 'Must be required'
        }
        if (!inputAddPatient.appointmentDate.trim()) {
            err.appointmentDate = 'Must be required'
        }
        if (!inputAddPatient.patientComplaints.trim()) {
            err.patientComplaints = 'Must be required'
        }
        if (!inputAddPatient.message.trim()) {
            err.message = 'Must be required'
        }

        if (Object.keys(err).length !== 0) {
            setErrInputAddPatient(err)
            return
        }

        return 'success'
    }

    function confirmSubmitAddPatient(): void {
        setLoadingSubmitAddPatient(true)
        if (typeof setOnModalSettings === 'function') {
            setOnModalSettings({} as PopupSettings)
        }
        API().APIPostPatientData(
            'patient-registration',
            dataSubmitAddPatient()
        )
            .then(res => {
                setLoadingSubmitAddPatient(false)
                setInputAddPatient({
                    patientName: '',
                    phone: '',
                    emailAddress: '',
                    dateOfBirth: '',
                    selectDay: 'Select Day',
                    appointmentDate: '',
                    patientComplaints: '',
                    message: '',
                })
                setOnAlerts({
                    onAlert: true,
                    title: 'Successfully added a new patient',
                    desc: 'A new patient has been added to the patient list'
                })

                setTimeout(() => {
                    setOnAlerts({} as AlertsT)
                }, 3000);
                refreshPage()
            })
            .catch(err => pushTriggedErr('A server error occurred. Occurs when adding a new patient. Please try again'))
    }

    function refreshPage():void{
        window.location.reload()
    }

    function dataSubmitAddPatient(): PatientRegistrationT {
        const {
            patientName,
            phone,
            emailAddress,
            dateOfBirth,
            appointmentDate,
            patientComplaints,
            message
        } = inputAddPatient
        return {
            id: `${new Date().getTime()}`,
            patientName,
            phone,
            emailAddress,
            dateOfBirth,
            appointmentDate,
            patientMessage: {
                patientComplaints,
                message
            },
            submissionDate: {
                submissionDate: createDateFormat(new Date()),
                clock: createHourFormat(new Date())
            }
        }
    }

    return {
        patientName,
        onPopupEdit,
        setOnPopupEdit,
        setIdPatientToEdit,
        setValueInputEditDetailPatient,
        errEditInputDetailPatient,
        setErrEditInputDetailPatient,
        changeEditDetailPatient,
        clickClosePopupEdit,
        changeDateEditDetailPatient,
        handleSubmitUpdate,
        clickEdit,
        idPatientToEdit,
        idLoadingEdit,
        valueInputEditDetailPatient,
        nextSubmitUpdate,
        clickAddPatient,
        onAddPatient,
        changeInputAddPatient,
        inputAddPatient,
        errInputAddPatient,
        changeDateAddPatient,
        handleSelectAddPatient,
        optionsDay,
        submitAddPatient,
        minDateFormAddP,
        maxDateFormAddP,
        filterDate,
        loadingSubmitAddPatient
    }
}

export default FormPatientRegistration