'use client'

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import { useParams, useRouter } from 'next/navigation'
import { InputEditPatientRegistrationT } from "lib/types/InputT.type"
import { mailRegex } from "lib/regex/mailRegex"
import { createDateFormat } from "lib/formats/createDateFormat"
import { API } from "lib/api"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { PopupSettings } from "lib/types/TableT.type"
import { specialCharacter } from "lib/regex/specialCharacter"
import { spaceString } from "lib/regex/spaceString"

type Props = {
    setOnModalSettings?: Dispatch<SetStateAction<PopupSettings>>
}

function FormPatientRegistration({
    setOnModalSettings
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

    // swr fetching data
    // servicing hours
    const {
        dataPatientRegis,
        pushTriggedErr,
    } = ServicingHours()

    const params = useParams()
    const router = useRouter()

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
                alert('Updated successfully')
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

    function clickAddPatient():void{
        setOnAddPatient(true)
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
        clickAddPatient
    }
}

export default FormPatientRegistration