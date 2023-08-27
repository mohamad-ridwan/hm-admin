'use client'

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { InputEditConfirmPatientT, SubmitEditConfirmPatientT } from "lib/types/InputT.type"
import { DataOptionT } from "lib/types/FilterT"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { API } from "lib/api"
import { AdminT } from "lib/types/AdminT.types"
import { ProfileDoctorT } from "lib/types/DoctorsT.types"
import { RoomTreatmentT } from "lib/types/PatientT.types"
import { createDateFormat } from "lib/formats/createDateFormat"
import { AlertsT, PopupSettings } from "lib/types/TableT.type"
import { faPenToSquare, faPencil } from "@fortawesome/free-solid-svg-icons"
import { navigationStore } from "lib/useZustand/navigation"
import { specialistDoctor } from "lib/formats/specialistDoctor"
import { spaceString } from "lib/regex/spaceString"
import { createDateNormalFormat } from "lib/formats/createDateNormalFormat"

type Props = {
    setOnModalSettings?: Dispatch<SetStateAction<PopupSettings>>
    setOnPopupEdit?: Dispatch<SetStateAction<boolean>>
}

function FormPatientConfirmation({
    setOnModalSettings,
    setOnPopupEdit
}: Props) {
    const [nameEditConfirmPatient, setNameEditConfirmPatient] = useState<string>('')
    const [editActiveManualQueue, setEditActiveManualQueue] = useState<boolean>(true)
    const [editActiveAutoQueue, setEditActiveAutoQueue] = useState<boolean>(false)
    const [onPopupEditConfirmPatient, setOnPopupEditConfirmPatient] = useState<boolean>(false)
    const [idPatientToEditConfirmPatient, setIdPatientToEditConfirmPatient] = useState<string | null>(null)
    const [idLoadingEditConfirmPatient, setIdLoadingEditConfirmPatient] = useState<string[]>([])
    const [getAppointmentDate, setGetAppointmentDate] = useState<string>('')
    const [valueInputEditConfirmPatient, setValueInputEditConfirmPatient] = useState<InputEditConfirmPatientT>({
        patientId: '',
        emailAdmin: '',
        dateConfirm: '',
        confirmHour: '',
        treatmentHours: '',
        nameDoctor: '',
        doctorSpecialist: '',
        roomName: '',
        queueNumber: '',
    })
    const [disableToggleQueue, setDisableToggleQueue] = useState<boolean>(false)
    const [selectDoctorSpecialist, setSelectDoctorSpecialist] = useState<DataOptionT>([
        {
            id: 'Select Specialist',
            title: 'Select Specialist'
        }
    ])
    const [selectEmailAdmin, setSelectEmailAdmin] = useState<DataOptionT>([
        {
            id: 'Select Admin',
            title: 'Select Admin'
        }
    ])
    const [selectDoctor, setSelectDoctor] = useState<DataOptionT>([
        {
            id: 'Select Doctor',
            title: 'Select Doctor'
        }
    ])
    const [selectRoom, setSelectRoom] = useState<DataOptionT>([
        {
            id: 'Select Room',
            title: 'Select Room'
        }
    ])
    const [errEditInputConfirmPatient, setErrEditInputConfirmPatient] = useState<InputEditConfirmPatientT>({} as InputEditConfirmPatientT)

    // swr fetching data
    // servicing hours
    const {
        pushTriggedErr,
        dataPatientRegis,
        doctors,
        dataAdmin,
        dataRooms,
        dataConfirmationPatients,
        dataFinishTreatment
    } = ServicingHours()

    const { setOnAlerts } = navigationStore()

    function changeEditConfirmPatient(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setValueInputEditConfirmPatient({
            ...valueInputEditConfirmPatient,
            [e.target.name]: e.target.value
        })

        setErrEditInputConfirmPatient({
            ...errEditInputConfirmPatient,
            [e.target.name]: ''
        })
    }

    function changeTreatmentHours(): void {
        if (
            Array.isArray(doctors) &&
            doctors.length > 0
        ) {
            const dayOfAppointment = createDateNormalFormat(getAppointmentDate).split(',')[1]?.replace(spaceString, '')
            const findDoctor = doctors.find(doctor=>doctor.name === valueInputEditConfirmPatient.nameDoctor)
            const findDaySchedule = findDoctor?.doctorSchedule.find(day=>day.dayName === dayOfAppointment)
            setValueInputEditConfirmPatient({
                ...valueInputEditConfirmPatient,
                treatmentHours: findDaySchedule?.practiceHours ?? ''
            })
        }
    }

    useEffect(() => {
        changeTreatmentHours()
    }, [valueInputEditConfirmPatient.nameDoctor])

    function handleInputSelectConfirmPatient(
        idElement: string,
        nameInput: 'emailAdmin' | 'doctorSpecialist' | 'nameDoctor' | 'roomName' | 'presence',
        cb?: (id: string, p2?: boolean, p3?: string) => void,
        cb2?: (p1?: boolean) => void
    ): void {
        const selectEl = document.getElementById(idElement) as HTMLSelectElement
        const id = selectEl?.options[selectEl.selectedIndex].value
        if (id) {
            setValueInputEditConfirmPatient({
                ...valueInputEditConfirmPatient,
                [nameInput]: id
            })

            if (typeof cb === 'function') {
                cb(id, true, getAppointmentDate)
            }
            if (typeof cb2 === 'function') {
                cb2(true)
            }
        }
    }

    function changeDateConfirm(e: ChangeEvent<HTMLInputElement> | Date | undefined, inputName: string): void {
        setValueInputEditConfirmPatient({
            ...valueInputEditConfirmPatient,
            [inputName]: !e ? '' : `${createDateFormat(e as Date)}`
        })

        setErrEditInputConfirmPatient({
            ...errEditInputConfirmPatient,
            [inputName]: ''
        })
    }

    function loadDataDoctor(specialist: string, isActiveDoctor?: boolean, appointmentDate?: string): void {
        if (Array.isArray(doctors) && doctors.length > 0 && specialist) {
            if (appointmentDate === undefined) return
            const dayOfAppointment = createDateNormalFormat(appointmentDate).split(',')[1]?.replace(spaceString, '')
            const dateOfAppointment = createDateFormat(new Date(appointmentDate.split(',')[0]))
            const findDoctorSpecialist = doctors.filter(data => {
                const checkCurrentSchedule = data.doctorSchedule.find(day => day.dayName.toLowerCase() === dayOfAppointment?.toLowerCase())
                const checkHolidaySchedule = data.holidaySchedule.find(day => day.date === dateOfAppointment)

                return data?.doctorActive === 'Active' &&
                    data.deskripsi === specialist &&
                    checkCurrentSchedule &&
                    !checkHolidaySchedule
            })
            const getDoctors = findDoctorSpecialist.map(data => ({
                id: data.name,
                title: data.name
            }))

            setSelectDoctor([
                {
                    id: 'Select Doctor',
                    title: 'Select Doctor'
                },
                ...getDoctors
            ])

            if (findDoctorSpecialist.length === 0) {
                setErrEditInputConfirmPatient({
                    ...errEditInputConfirmPatient,
                    nameDoctor: `No doctor's schedule is available on the patient's designated day`
                })
            } else {
                setErrEditInputConfirmPatient({
                    ...errEditInputConfirmPatient,
                    nameDoctor: ''
                })
            }

            if (isActiveDoctor) {
                const doctor = document.getElementById('selectDoctor') as HTMLSelectElement
                if (doctor) {
                    doctor.selectedIndex = 0
                }
                setValueInputEditConfirmPatient(current => ({
                    ...current,
                    nameDoctor: 'Select Doctor'
                }))
            }
        } else {
            setOnAlerts({
                onAlert: true,
                title: `no doctor's data found`,
                desc: 'please try again'
            })
            setTimeout(() => {
                setOnAlerts({} as AlertsT)
            }, 3000);
        }
    }

    function loadDataRoom(isActiveRoom?: boolean): void {
        if (Array.isArray(dataRooms) && dataRooms.length > 0) {
            const roomActive = dataRooms.filter(room => room?.roomActive === 'Active')
            const findRoom: DataOptionT = roomActive.map(room => ({
                id: room.room,
                title: `${room.room} - (${room?.roomType})`
            }))

            setSelectRoom([
                {
                    id: 'Select Room',
                    title: 'Select Room'
                },
                ...findRoom
            ])

            if (isActiveRoom) {
                const room = document.getElementById('selectRoom') as HTMLSelectElement
                if (room) {
                    room.selectedIndex = 0
                }
                setValueInputEditConfirmPatient(current => ({
                    ...current,
                    roomName: 'Select Room'
                }))
            }
        } else {
            setOnAlerts({
                onAlert: true,
                title: 'Medical room data not found.',
                desc: 'Please try again'
            })
            setTimeout(() => {
                setOnAlerts({} as AlertsT)
            }, 3000);
        }
    }

    function toggleChangeManualQueue(): void {
        setEditActiveManualQueue(!editActiveManualQueue)
        setEditActiveAutoQueue(false)

        changeActiveToggle('setAutoNumber', false)

        const findPatient = dataConfirmationPatients?.find(patient => patient.patientId === idPatientToEditConfirmPatient)
        setValueInputEditConfirmPatient({
            ...valueInputEditConfirmPatient,
            queueNumber: findPatient?.roomInfo?.queueNumber as string
        })
    }

    function changeActiveToggle(idElement: string, checked: boolean): void {
        const toggleManual = document.getElementById(idElement) as HTMLInputElement
        if (toggleManual) {
            toggleManual.checked = checked
        }
    }

    function toggleSetAutoQueue(): void {
        setEditActiveManualQueue(true)
        setEditActiveAutoQueue(!editActiveAutoQueue)

        changeActiveToggle('toggle', false)

        const findPatient = dataConfirmationPatients?.find(patient => patient.patientId === idPatientToEditConfirmPatient)
        setValueInputEditConfirmPatient({
            ...valueInputEditConfirmPatient,
            queueNumber: findPatient?.roomInfo?.queueNumber as string
        })
    }

    function submitEditConfirmPatient(): void {
        const isLoading = idLoadingEditConfirmPatient.find(id => id === idPatientToEditConfirmPatient)
        if (!isLoading) {
            validateEditConfirmPatient()
                .then(res => {
                    if (typeof setOnModalSettings !== 'undefined') {
                        setOnModalSettings({
                            clickClose: () => setOnModalSettings({} as PopupSettings),
                            title: `Update confirmation data from patient "${nameEditConfirmPatient}"?`,
                            classIcon: 'text-font-color-2',
                            iconPopup: faPencil,
                            actionsData: [
                                {
                                    nameBtn: 'Save',
                                    classBtn: 'hover:bg-white',
                                    classLoading: 'hidden',
                                    clickBtn: () => nextSubmitEditConfirmPatient(),
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
                })
        }
    }

    function nextSubmitEditConfirmPatient(): void {
        setErrEditInputConfirmPatient({} as InputEditConfirmPatientT)
        pushToUpdateConfirmPatient()
        if (typeof setOnModalSettings !== 'undefined') {
            setOnModalSettings({} as PopupSettings)
        }
    }

    async function validateEditConfirmPatient(): Promise<{ message: string }> {
        let err: InputEditConfirmPatientT = {} as InputEditConfirmPatientT

        const {
            patientId,
            emailAdmin,
            dateConfirm,
            confirmHour,
            treatmentHours,
            nameDoctor,
            doctorSpecialist,
            roomName,
            queueNumber,
            // presence
        } = valueInputEditConfirmPatient

        if (!patientId.trim()) {
            err.patientId = 'Must be required'
        }
        if (emailAdmin === 'Select Admin') {
            err.emailAdmin = 'Please select admin'
        }
        if (!dateConfirm.trim()) {
            err.dateConfirm = 'Must be required'
        }
        if (!confirmHour.trim()) {
            err.confirmHour = 'Must be required'
        }
        if (!treatmentHours.trim()) {
            err.treatmentHours = 'Must be required'
        }
        if (nameDoctor === 'Select Doctor') {
            err.nameDoctor = 'Please select doctor'
        }
        if (doctorSpecialist === 'Select Specialist') {
            err.doctorSpecialist = 'Please select specialist doctor'
        }
        if (roomName === 'Select Room') {
            err.roomName = 'Please select room'
        }
        if (!queueNumber.trim()) {
            err.queueNumber = 'Please select attendance'
        }

        return await new Promise((resolve, reject) => {
            if (Object.keys(err).length === 0) {
                resolve({ message: 'success' })
            } else {
                reject({ message: `an error occurred while submitting input` })
                setErrEditInputConfirmPatient(err)
            }
        })
    }

    function pushToUpdateConfirmPatient(): void {
        const findId = dataConfirmationPatients?.find(patient => patient.patientId === idPatientToEditConfirmPatient)
        setIdLoadingEditConfirmPatient((current) => [...current, idPatientToEditConfirmPatient as string])

        const {
            patientId,
            emailAdmin,
            dateConfirm,
            confirmHour,
            treatmentHours,
            nameDoctor,
            doctorSpecialist,
            roomName,
            queueNumber,
        } = valueInputEditConfirmPatient

        // admin
        const findAdmin: AdminT | null | undefined = dataAdmin?.find(admin => admin?.email === emailAdmin)
        // doctor
        const findDoctor: ProfileDoctorT | null | undefined = doctors?.find(doctor =>
            doctor?.name === nameDoctor && doctor?.deskripsi === doctorSpecialist
        )
        // room
        const findRoom: RoomTreatmentT | null | undefined = dataRooms?.find(room => room?.room === roomName)

        // find queue number if set auto number is active
        const findRegistration = dataPatientRegis?.filter((patient => {
            // patient already on confirm
            const findPatientOnConfirm = dataConfirmationPatients?.find((patientConfirm) =>
                patientConfirm.patientId === patient.id && patientConfirm.patientId !== patientId &&
                patientConfirm.roomInfo.roomId === findRoom?.id
            )

            return findPatientOnConfirm
        }))
        // find patient this data
        const findPatientThisData = dataPatientRegis?.find(patient => patient.id === patientId)
        // find patient registration to treatment in this date
        const findPatientRegisToTreatmentCurrentDate = Array.isArray(findRegistration) && findRegistration.length > 0 ? findRegistration.filter(patient => patient.appointmentDate === findPatientThisData?.appointmentDate) : []
        // find patient in confirmation
        const findPatientInConfirmation = dataConfirmationPatients?.filter(patient => {
            const checkPatientId = findPatientRegisToTreatmentCurrentDate.find(patientReg => patientReg.id === patient.patientId)

            return checkPatientId
        })
        // sort queue number patient treatment in current date of current room
        const sortQueueNumber = Array.isArray(findPatientInConfirmation) && findPatientInConfirmation.length > 0 ? findPatientInConfirmation.sort((a, b) => Number(b.roomInfo.queueNumber) - Number(a.roomInfo.queueNumber)) : undefined

        const specifyQueue = editActiveAutoQueue ? Array.isArray(sortQueueNumber) && sortQueueNumber.length > 0 ? `${Number(sortQueueNumber[0].roomInfo?.queueNumber) + 1}` : '1' : queueNumber

        const data: SubmitEditConfirmPatientT = {
            patientId,
            adminInfo: { adminId: findAdmin?.id as string },
            dateConfirmInfo: {
                dateConfirm,
                confirmHour,
                treatmentHours
            },
            doctorInfo: { doctorId: findDoctor?.id as string },
            roomInfo: {
                roomId: findRoom?.id as string,
                queueNumber: specifyQueue,
                // presence
            }
        }

        API().APIPutPatientData(
            'confirmation-patients',
            findId?.id as string,
            data
        )
            .then((res) => {
                const findPatientRegisId = dataConfirmationPatients?.find(patient => patient.id === res?.id)
                const removeLoadingId = idLoadingEditConfirmPatient.filter(id => id !== findPatientRegisId?.patientId)
                setIdLoadingEditConfirmPatient(removeLoadingId)
                setOnAlerts({
                    onAlert: true,
                    title: 'Patient confirmation data successfully updated',
                    desc: 'Confirmation patient updated successfully'
                })
                setTimeout(() => {
                    setOnAlerts({} as AlertsT)
                }, 3000);
                window.location.reload()
            })
            .catch((err) => {
                pushTriggedErr('a server error occurred. please try again')
            })
    }

    function clickEditToConfirmPatient(
        id: string,
        name: string
    ): void {
        const findPatient = dataConfirmationPatients?.find(patient => patient.patientId === id)
        if (findPatient) {
            const {
                patientId,
                adminInfo,
                dateConfirmInfo,
                doctorInfo,
                roomInfo
            } = findPatient
            const findPatientRegis = dataPatientRegis?.find(patient => patient.id === patientId)
            setNameEditConfirmPatient(name)
            setIdPatientToEditConfirmPatient(findPatient?.patientId)
            setGetAppointmentDate(findPatientRegis?.appointmentDate as string)

            // admin
            const findAdmin: AdminT | null | undefined = dataAdmin?.find(admin => admin?.id === adminInfo.adminId)
            // doctor
            const findDoctor: ProfileDoctorT | null | undefined = doctors?.find(doctor => doctor?.id === doctorInfo.doctorId)
            // room
            const findRoom: RoomTreatmentT | null | undefined = dataRooms?.find(room => room?.id === roomInfo.roomId)

            setValueInputEditConfirmPatient({
                patientId,
                emailAdmin: findAdmin?.email as string,
                dateConfirm: dateConfirmInfo.dateConfirm,
                confirmHour: dateConfirmInfo.confirmHour,
                treatmentHours: dateConfirmInfo.treatmentHours,
                nameDoctor: findDoctor?.name as string,
                doctorSpecialist: findDoctor?.deskripsi as string,
                roomName: findRoom?.room as string,
                queueNumber: roomInfo?.queueNumber,
            })

            const patientFT = dataFinishTreatment?.find(patient => patient.patientId === id)
            if (patientFT) {
                setDisableToggleQueue(true)
            } else {
                setDisableToggleQueue(false)
            }

            setTimeout(() => {
                loadDataAdmin()
                loadDataSpecialist()
                loadDataDoctor(findDoctor?.deskripsi as string, undefined, findPatientRegis?.appointmentDate)
                loadDataRoom()
            }, 0)
        } else {
            alert('an error occurred, please try again or reload the page')
        }
    }

    function loadDataAdmin(): void {
        if (Array.isArray(dataAdmin) && dataAdmin?.length > 0) {
            const newSelectAdmin = dataAdmin.map(admin => ({
                id: admin.email,
                title: admin.email
            }))

            setSelectEmailAdmin([
                {
                    id: 'Select Admin',
                    title: 'Select Admin'
                },
                ...newSelectAdmin
            ])
        } else {
            alert('no admin data found. please try again')
        }
    }

    function loadDataSpecialist(): void {
        if (Array.isArray(doctors) && doctors.length > 0) {
            // let newDataSpecialist: { id: string, title: string }[] = []
            // let count: number = 0
            // doctors.forEach(data => {
            //     count = count + 1
            //     const checkSpecialist = newDataSpecialist.find(specialist => specialist.id === data.deskripsi)
            //     if (!checkSpecialist) {
            //         newDataSpecialist.push({ id: data.deskripsi, title: data.deskripsi })
            //     }
            // })

            // if (count === doctors.length) {
            //     setSelectDoctorSpecialist([
            //         {
            //             id: 'Select Specialist',
            //             title: 'Select Specialist'
            //         },
            //         ...specialistDoctor
            //     ])
            // }
            setSelectDoctorSpecialist([
                {
                    id: 'Select Specialist',
                    title: 'Select Specialist'
                },
                ...specialistDoctor
            ])
        } else {
            alert(`no doctor's data found. please try again`)
        }
    }

    function activeSelectEditConfirmPatient(
        idElement: string,
        indexActive: number
    ): void {
        const element = document.getElementById(idElement) as HTMLSelectElement
        if (element && indexActive !== -1) {
            element.selectedIndex = indexActive
        }
    }

    function activeSelectEmailAdmin(): void {
        if (selectEmailAdmin.length > 0) {
            const findIndexAdmin: number = selectEmailAdmin.findIndex(admin => admin.id === valueInputEditConfirmPatient?.emailAdmin)

            activeSelectEditConfirmPatient('selectAdmin', findIndexAdmin)
        }
    }

    function activeSelectSpecialist(): void {
        if (selectDoctorSpecialist.length > 0) {
            const findIndexSpecialist: number = selectDoctorSpecialist.findIndex(specialist => specialist.id === valueInputEditConfirmPatient?.doctorSpecialist)

            activeSelectEditConfirmPatient('selectSpecialist', findIndexSpecialist)
        }
    }

    function activeSelectDoctor(): void {
        if (selectDoctor.length > 0) {
            const findIndexDoctor: number = selectDoctor.findIndex(doctor => doctor.id === valueInputEditConfirmPatient?.nameDoctor)

            activeSelectEditConfirmPatient('selectDoctor', findIndexDoctor)
        }
    }

    function activeSelectRoom(): void {
        if (selectRoom.length > 0) {
            const findIndexRoom: number = selectRoom.findIndex(doctor => doctor.id === valueInputEditConfirmPatient?.roomName)

            activeSelectEditConfirmPatient('selectRoom', findIndexRoom)
        }
    }

    function clickOnEditConfirmPatient(): void {
        setOnPopupEditConfirmPatient(true)
        setEditActiveManualQueue(true)
        setEditActiveAutoQueue(false)
    }

    useEffect(() => {
        setTimeout(() => {
            activeSelectEmailAdmin()
            activeSelectSpecialist()
            activeSelectDoctor()
            activeSelectRoom()
        }, 500);
    }, [onPopupEditConfirmPatient, valueInputEditConfirmPatient, selectEmailAdmin])

    function closePopupEditConfirmPatient(): void {
        setOnPopupEditConfirmPatient(false)
    }

    function openPopupEdit(): void {
        if (typeof setOnModalSettings !== 'undefined') {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: 'What do you want to edit?',
                classIcon: 'text-font-color-2',
                iconPopup: faPenToSquare,
                actionsData: [
                    {
                        nameBtn: 'Edit patient detail',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => {
                            if (typeof setOnPopupEdit !== 'undefined') {
                                setOnPopupEdit(true)
                                setOnModalSettings({} as PopupSettings)
                            }
                        },
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.5rem',
                            marginTop: '0.5rem'
                        }
                    },
                    {
                        nameBtn: 'Edit confirmation data',
                        classBtn: 'bg-orange border-orange hover:border-orange hover:bg-white hover:text-orange',
                        classLoading: 'hidden',
                        clickBtn: () => {
                            clickOnEditConfirmPatient()
                            setOnModalSettings({} as PopupSettings)
                        },
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

    return {
        onPopupEditConfirmPatient,
        clickEditToConfirmPatient,
        valueInputEditConfirmPatient,
        nameEditConfirmPatient,
        errEditInputConfirmPatient,
        closePopupEditConfirmPatient,
        changeEditConfirmPatient,
        selectEmailAdmin,
        handleInputSelectConfirmPatient,
        changeDateConfirm,
        selectDoctorSpecialist,
        loadDataDoctor,
        loadDataRoom,
        selectDoctor,
        selectRoom,
        editActiveManualQueue,
        toggleChangeManualQueue,
        toggleSetAutoQueue,
        idPatientToEditConfirmPatient,
        idLoadingEditConfirmPatient,
        submitEditConfirmPatient,
        clickOnEditConfirmPatient,
        nextSubmitEditConfirmPatient,
        openPopupEdit,
        disableToggleQueue
    }
}

export default FormPatientConfirmation