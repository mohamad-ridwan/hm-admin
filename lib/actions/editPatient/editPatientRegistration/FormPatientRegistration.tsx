'use client'

import { ChangeEvent, useState } from "react"
import { InputEditPatientRegistrationT } from "lib/types/InputT.type"
import { mailRegex } from "lib/regex/mailRegex"
import { createDateFormat } from "lib/datePicker/createDateFormat"
import { API } from "lib/api"
import ServicingHours from "lib/actions/ServicingHours"

function FormPatientRegistration() {
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
    const [idSuccessEdit, setIdSuccessEdit] = useState<string[]>([])
    const [loadingSubmitEdit, setLoadingSubmitEdit] = useState<boolean>(false)
    const [errEditInputDetailPatient, setErrEditInputDetailPatient] = useState<InputEditPatientRegistrationT>({} as InputEditPatientRegistrationT)

    // swr fetching data
    // servicing hours
    const {
        dataPatientRegis,
        pushTriggedErr,
    } = ServicingHours()

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
                    if (window.confirm(`update patient data from "${patientName}"?`)) {
                        setErrEditInputDetailPatient({} as InputEditPatientRegistrationT)
                        pushToUpdatePatient()
                    }
                })
        }
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
        setIdSuccessEdit((current) => [...current, idPatientToEdit as string])

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
            .then((res: any) => {
                alert(`Patient data from "${patientName}" updated successfully`)

                const findIdLoading = idLoadingEdit.filter(loadingId => {
                    const findIdSuccess = idSuccessEdit.find(successId => loadingId === successId)

                    return !findIdSuccess
                })

                setIdLoadingEdit(findIdLoading)
            })
            .catch((err: any) => {
                pushTriggedErr('a server error occurred. please try again later')

                const findIdLoading = idLoadingEdit.filter(loadingId => {
                    const findIdSuccess = idSuccessEdit.find(successId => loadingId === successId)

                    return !findIdSuccess
                })

                setIdLoadingEdit(findIdLoading)
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
        loadingSubmitEdit,
        clickEdit,
        setLoadingSubmitEdit,
        idPatientToEdit,
        idLoadingEdit,
        valueInputEditDetailPatient,
    }
}

export default FormPatientRegistration