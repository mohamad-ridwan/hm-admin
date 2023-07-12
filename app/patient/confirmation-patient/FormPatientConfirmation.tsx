'use client'

import { ChangeEvent, useState } from "react"
import { InputEditConfirmPatientT, SubmitEditConfirmPatientT } from "lib/types/InputT.type"
import { DataOptionT } from "lib/types/FilterT"
import ServicingHours from "lib/actions/ServicingHours"
import { API } from "lib/api"
import { AdminT } from "lib/types/AdminT.types"
import { ProfileDoctorT } from "lib/types/DoctorsT.types"
import { RoomTreatmentT } from "lib/types/PatientT.types"

function FormPatientConfirmation(){
    const [nameEditConfirmPatient, setNameEditConfirmPatient] = useState<string>('')
    const [editActiveManualQueue, setEditActiveManualQueue] = useState<boolean>(true)
    const [editActiveAutoQueue, setEditActiveAutoQueue] = useState<boolean>(false)
    const [onPopupSettings, setOnPopupSettings] = useState<boolean>(false)
    const [onPopupEditConfirmPatient, setOnPopupEditConfirmPatient] = useState<boolean>(false)
    const [idPatientToEditConfirmPatient, setIdPatientToEditConfirmPatient] = useState<string | null>(null)
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
        presence: ''
    })
    const [selectPresence, setSelectPresence] = useState<DataOptionT>([
        {
            id: 'Select Presence',
            title: 'Select Presence'
        },
        {
            id: 'tidak hadir',
            title: 'tidak hadir'
        },
        {
            id: 'hadir',
            title: 'hadir'
        }
    ])
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
    const [idSubmitEditConfirmPatient, setIdSubmitEditConfirmPatient] = useState<string[]>([])
    const [errEditInputConfirmPatient, setErrEditInputConfirmPatient] = useState<InputEditConfirmPatientT>({} as InputEditConfirmPatientT)
    const [idWaitToSubmitConfirmPatient, setIdWaitToSubmitConfirmPatient] = useState<string[]>([])

    // swr fetching data
    // servicing hours
    const {
        pushTriggedErr,
        dataPatientRegis,
        doctors,
        dataAdmin,
        dataRooms,
        dataConfirmationPatients
    } = ServicingHours()

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

    function handleInputSelectConfirmPatient(
        idElement: string,
        nameInput: 'emailAdmin' | 'doctorSpecialist' | 'nameDoctor' | 'roomName' | 'presence',
        cb?: (id: string, p2?: boolean) => void,
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
                cb(id, true)
            }
            if (typeof cb2 === 'function') {
                cb2(true)
            }
        }
    }

    function changeDateConfirm(e: ChangeEvent<HTMLInputElement> | Date | undefined, inputName: string): void {
        setValueInputEditConfirmPatient({
            ...valueInputEditConfirmPatient,
            [inputName]: !e ? '' : `${e as Date}`
        })

        setErrEditInputConfirmPatient({
            ...errEditInputConfirmPatient,
            [inputName]: ''
        })
    }

    function loadDataDoctor(specialist: string, isActiveDoctor?: boolean): void {
        if (Array.isArray(doctors) && doctors.length > 0 && specialist) {
            const findDoctorSpecialist = doctors.filter(data => data.deskripsi === specialist)
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
            alert(`no doctor's data found. please try again`)
        }
    }

    function loadDataRoom(isActiveRoom?: boolean): void {
        if (Array.isArray(dataRooms) && dataRooms.length > 0) {
            const findRoom: DataOptionT = dataRooms?.map(room => ({
                id: room.room,
                title: room.room
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
            alert('medical room data not found. please try again')
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
        const findIdWaitSubmitEditConfirmPatient = idWaitToSubmitConfirmPatient.find(id => id === idPatientToEditConfirmPatient)

        if (!findIdWaitSubmitEditConfirmPatient) {
            validateEditConfirmPatient()
                .then(res => {
                    if (window.confirm(`Update confirmation data from patient "${nameEditConfirmPatient}"?`)) {
                        setErrEditInputConfirmPatient({} as InputEditConfirmPatientT)
                        pushToUpdateConfirmPatient()
                    }
                })
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
            presence
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
        if (presence === 'Select Presence') {
            err.presence = 'Please select attendance'
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
        setIdWaitToSubmitConfirmPatient((current) => [...current, idPatientToEditConfirmPatient as string])
        const findIdSubmitEdit = idSubmitEditConfirmPatient.find(id => id === idPatientToEditConfirmPatient)
        if (!findIdSubmitEdit) {
            setIdSubmitEditConfirmPatient((current) => [...current, idPatientToEditConfirmPatient as string])
        }

        const findId = dataConfirmationPatients?.find(patient => patient.patientId === idPatientToEditConfirmPatient)

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
            presence
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
                patientConfirm.patientId === patient.id && patientConfirm.patientId !== patientId
            )
            // get patient in this room
            const findPatientInRoom = dataRooms?.find(room => room?.id === findRoom?.id)

            return findPatientOnConfirm && findPatientInRoom
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
                presence
            }
        }

        API().APIPutPatientData(
            'confirmation-patients',
            findId?.id as string,
            data
        )
            .then((res) => {
                alert('patient confirmation data successfully updated')

                const findIdWaitSubmitConfirmPatient = idWaitToSubmitConfirmPatient.filter(id => {
                    const findIdSubmit = idSubmitEditConfirmPatient.find(idWait => idWait === id)

                    return !findIdSubmit
                })

                setIdWaitToSubmitConfirmPatient(findIdWaitSubmitConfirmPatient)
            })
            .catch((err: any) => {
                console.log(err)

                const findIdWaitSubmitConfirmPatient = idWaitToSubmitConfirmPatient.filter(id => {
                    const findIdSubmit = idSubmitEditConfirmPatient.find(idWait => idWait === id)

                    return !findIdSubmit
                })

                setIdWaitToSubmitConfirmPatient(findIdWaitSubmitConfirmPatient)
                pushTriggedErr('a server error occurred while updating confirmation data')
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
            setNameEditConfirmPatient(name)
            setIdPatientToEditConfirmPatient(findPatient?.patientId)

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
                presence: roomInfo?.presence
            })

            setTimeout(() => {
                loadDataAdmin()
                loadDataSpecialist()
                loadDataDoctor(findDoctor?.deskripsi as string)
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
            let newDataSpecialist: { id: string, title: string }[] = []
            let count: number = 0
            doctors.forEach(data => {
                count = count + 1
                const checkSpecialist = newDataSpecialist.find(specialist => specialist.id === data.deskripsi)
                if (!checkSpecialist) {
                    newDataSpecialist.push({ id: data.deskripsi, title: data.deskripsi })
                }
            })

            if (count === doctors.length) {
                setSelectDoctorSpecialist([
                    {
                        id: 'Select Specialist',
                        title: 'Select Specialist'
                    },
                    ...newDataSpecialist
                ])
            }
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

    function activeSelectPresence(): void {
        const findIndexPresence: number = selectPresence.findIndex(presence => presence.id === valueInputEditConfirmPatient?.presence)

        activeSelectEditConfirmPatient('selectPresence', findIndexPresence)
    }

    function clickOnEditConfirmPatient(): void {
        setOnPopupEditConfirmPatient(true)
        setOnPopupSettings(false)
        setEditActiveManualQueue(true)
        setEditActiveAutoQueue(false)

        setTimeout(() => {
            activeSelectEmailAdmin()
            activeSelectSpecialist()
            activeSelectDoctor()
            activeSelectRoom()
            activeSelectPresence()
        }, 500);
    }

    function closePopupEditConfirmPatient(): void {
        setOnPopupEditConfirmPatient(false)
    }

    return {
        onPopupEditConfirmPatient,
        clickEditToConfirmPatient,
        valueInputEditConfirmPatient,
        nameEditConfirmPatient,
        errEditInputConfirmPatient,
        onPopupSettings,
        setOnPopupSettings,
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
        selectPresence,
        idWaitToSubmitConfirmPatient,
        idPatientToEditConfirmPatient,
        submitEditConfirmPatient,
        clickOnEditConfirmPatient
    }
}

export default FormPatientConfirmation