'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DataOptionT } from "lib/types/FilterT"
import { ProfileDoctorT } from "lib/types/DoctorsT.types"
import { InputPatientRegistrationT, SubmitFormPatientRegisT } from "lib/types/InputT.type"
import { spaceString } from "lib/regex/spaceString"
import { API } from "lib/api"
import { authStore } from "lib/useZustand/auth"
import { createDateFormat } from "lib/dates/createDateFormat"
import { createHourFormat } from "lib/dates/createHourFormat"
import { UsePatientData } from "lib/actions/dataInformation/UsePatientData"
import { createDateNormalFormat } from "lib/dates/createDateNormalFormat"
import { PopupSetting } from "lib/types/TableT.type"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"

type Props = {
    params: string
    setOnPopupSetting?: Dispatch<SetStateAction<PopupSetting>>
}

export function HandleFormRegistration({
    params,
    setOnPopupSetting
}: Props) {
    const [inputValue, setInputValue] = useState<InputPatientRegistrationT>({
        specialist: 'Select Specialist',
        doctor: 'Select Doctor',
        practiceHours: '',
        roomName: 'Select Room',
        treatmentHours: ''
    })
    const [errInputValue, setErrInputValue] = useState<InputPatientRegistrationT>({} as InputPatientRegistrationT)
    const [isSetAutoRoom, setIsSetAutoRoom] = useState<boolean>(false)
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [optionsSpecialist, setOptionsSpecialist] = useState<DataOptionT>([
        {
            id: 'Select Specialist',
            title: 'Select Specialist'
        }
    ])
    const [optionsDoctor, setOptionsDoctor] = useState<DataOptionT>([
        {
            id: 'Select Doctor',
            title: 'Select Doctor'
        }
    ])
    const [optionsRoom, setOptionsRoom] = useState<DataOptionT>([
        {
            id: 'Select Room',
            title: 'Select Room'
        }
    ])

    const {
        detailDataPatientRegis,
        doctors,
        dataRooms,
        dataConfirmationPatients,
        dataPatientRegis,
        pushTriggedErr
    } = UsePatientData({ params })

    const appointmentDate = createDateNormalFormat(detailDataPatientRegis?.appointmentDate)
    const idPatientRegistration = detailDataPatientRegis?.id

    const { user } = authStore()
    const router = useRouter()

    function loadSpecialist(): void {
        if (
            Array.isArray(doctors) &&
            doctors.length > 0
        ) {
            const getSpecialist = doctors.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.deskripsi === value.deskripsi
                ))
            )

            const resultSpecialist = getSpecialist.map(doctor => ({
                id: doctor.deskripsi,
                title: doctor.deskripsi
            }))

            setOptionsSpecialist([
                {
                    id: 'Select Specialist',
                    title: 'Select Specialist'
                },
                ...resultSpecialist
            ])
        }
    }

    useEffect(() => {
        loadSpecialist()
    }, [doctors])

    function loadDoctorName(): void {
        if (inputValue.specialist !== 'Select Specialist') {
            const dayOfAppointment = appointmentDate.split(',')[1]?.replace(spaceString, '')
            const dateOfAppointment = createDateFormat(new Date(appointmentDate.split(',')[0]))
            const getDoctors = doctors?.filter(doctor => {
                const checkCurrentSchedule = doctor.doctorSchedule.find(day=>day.dayName.toLowerCase() === dayOfAppointment?.toLowerCase())
                const checkHolidaySchedule = doctor.holidaySchedule.find(day=>day.date === dateOfAppointment)

                return doctor.deskripsi === inputValue.specialist && 
                checkCurrentSchedule && 
                !checkHolidaySchedule
            })
            if(
                Array.isArray(getDoctors) &&
                getDoctors.length === 0
            ){
                setErrInputValue({
                    ...errInputValue,
                    doctor: `No doctor's schedule is available on the patient's designated day`
                })

                return
            }else{
                setErrInputValue({
                    ...errInputValue,
                    doctor: ''
                })
            }

            const currentDoctor = getDoctors?.map(doctor => ({
                id: doctor.name,
                title: doctor.name
            }))
            if (
                Array.isArray(currentDoctor) &&
                currentDoctor.length > 0
            ) {
                setOptionsDoctor([
                    {
                        id: 'Select Doctor',
                        title: 'Select Doctor'
                    },
                    ...currentDoctor
                ])
            }
        } else {
            setOptionsDoctor([
                {
                    id: 'Select Doctor',
                    title: 'Select Doctor'
                },
            ])
        }
    }

    useEffect(() => {
        loadDoctorName()
    }, [inputValue.specialist])

    function loadCurrentDoctor(): void {
        if (inputValue.doctor !== 'Select Doctor') {
            const findDoctor = doctors?.find(doctor =>
                doctor.deskripsi === inputValue.specialist &&
                doctor.name === inputValue.doctor
            )
            if (findDoctor) {
                const findPracticeHours = findDoctor.doctorSchedule.find(day => {
                    const checkDay = appointmentDate.split(',')[1]?.replace(spaceString, '')
                    return day.dayName.toLowerCase() === checkDay?.toLowerCase()
                })
                setInputValue((current) => ({
                    ...current,
                    practiceHours: findPracticeHours?.practiceHours as string,
                    treatmentHours: findPracticeHours?.practiceHours as string
                }))
                getDoctorRoom(findDoctor)
                setTimeout(() => {
                    setAutoSelectRoom(true)
                    setIsSetAutoRoom(true)
                }, 50);
            }
        } else {
            const roomElement = document.getElementById('roomName') as HTMLSelectElement
            if (roomElement) {
                roomElement.selectedIndex = 0
            }
            setInputValue((current) => ({
                ...current,
                practiceHours: '',
                roomName: 'Select Room',
                treatmentHours: ''
            }))
        }
    }

    function getDoctorRoom(
        doctor: ProfileDoctorT | undefined
    ): void {
        if (
            doctor &&
            Array.isArray(dataRooms) &&
            dataRooms.length > 0
        ) {
            const findRoom = dataRooms.find(room => room.id === doctor.room)
            setInputValue((current) => ({
                ...current,
                roomName: findRoom?.room as string
            }))

            const roomElement = document.getElementById('roomName') as HTMLSelectElement
            const indexRoom = optionsRoom.findIndex(room => room.id === findRoom?.room)
            if (roomElement) {
                roomElement.selectedIndex = indexRoom
            }
        }
    }

    // set auto select room
    function setAutoSelectRoom(
        checked: boolean
    ): void {
        const toggleAuto = document.getElementById('setAutoRoom') as HTMLInputElement
        if (toggleAuto) {
            toggleAuto.checked = checked
        }
    }

    useEffect(() => {
        loadCurrentDoctor()
    }, [inputValue.doctor])

    function loadRooms(): void {
        if (
            Array.isArray(dataRooms) &&
            dataRooms.length > 0
        ) {
            const getRooms = dataRooms.map(room => ({
                id: room.room,
                title: room.room
            }))
            setOptionsRoom([
                {
                    id: 'Select Room',
                    title: 'Select Room'
                },
                ...getRooms
            ])
        }
    }

    useEffect(() => {
        loadRooms()
    }, [dataRooms])

    function handleSelect(
        idElement: string
    ): void {
        const selectEl = document.getElementById(idElement) as HTMLSelectElement
        const id = selectEl?.options[selectEl.selectedIndex].value
        if (id) {
            if (idElement === 'specialist') {
                const selectEl = document.getElementById('doctor') as HTMLSelectElement
                selectEl.selectedIndex = 0
                setInputValue({
                    ...inputValue,
                    specialist: id,
                    doctor: 'Select Doctor'
                })
            } else if (idElement === 'doctor') {
                setInputValue({
                    ...inputValue,
                    [idElement]: id
                })
            } else if (idElement === 'roomName' && isSetAutoRoom === false) {
                setInputValue({
                    ...inputValue,
                    roomName: id
                })
                setErrInputValue({
                    ...errInputValue,
                    roomName: ''
                })
            } else if (idElement === 'roomName' && isSetAutoRoom) {
                const findIndexRoom = optionsRoom.findIndex(rooom => rooom.id === inputValue.roomName)
                const selectEl = document.getElementById(idElement) as HTMLSelectElement
                selectEl.selectedIndex = findIndexRoom

                setErrInputValue({
                    ...errInputValue,
                    roomName: 'Turn off select auto room first'
                })
            }
        }
    }

    function clickToggleAutoRoom(): void {
        if (inputValue.doctor !== 'Select Doctor') {
            setIsSetAutoRoom(!isSetAutoRoom)

            if (isSetAutoRoom === false) {
                const findDoctor = doctors?.find(doctor =>
                    doctor.deskripsi === inputValue.specialist &&
                    doctor.name === inputValue.doctor
                )

                getDoctorRoom(findDoctor)
            }
        } else {
            setErrInputValue({
                ...errInputValue,
                doctor: 'choose a doctor first'
            })
            setAutoSelectRoom(false)
            setIsSetAutoRoom(false)
        }
    }

    function submitConfirmation(): void {
        if (
            loadingSubmit === false &&
            validateSubmit() &&
            typeof setOnPopupSetting !== 'undefined'
        ) {
            setOnPopupSetting({
                title: 'Confirm patient?',
                classIcon: 'text-font-color-2',
                classBtnNext: 'hover:bg-white',
                iconPopup: faCircleCheck,
                nameBtnNext: 'Yes',
                patientId: '',
                categoryAction: 'confirm-registration'
            })
        }
    }

    function nextSubmitConfirmation():void{
        setLoadingSubmit(true)
        setErrInputValue({} as InputPatientRegistrationT)
        pushToConfirm()
        if(typeof setOnPopupSetting !== 'undefined'){
            setOnPopupSetting({} as PopupSetting)
        }
    }

    function validateSubmit(): string | undefined {
        let err = {} as InputPatientRegistrationT
        if (inputValue.specialist === 'Select Specialist') {
            err.specialist = 'Must be required'
        }
        if (inputValue.doctor === 'Select Doctor') {
            err.doctor = 'Must be required'
        }
        if (!inputValue.practiceHours.trim()) {
            err.practiceHours = 'Must be required'
        }
        if (inputValue.roomName === 'Select Room') {
            err.roomName = 'Must be required'
        }
        if (!inputValue.treatmentHours.trim()) {
            err.treatmentHours = 'Must be required'
        }

        if (Object.keys(err).length !== 0) {
            setErrInputValue(err)
            return
        }

        return 'success'
    }

    function pushToConfirm(): void {
        const {
            specialist,
            doctor,
            roomName,
            treatmentHours
        } = inputValue
        const findRoom = dataRooms?.find(room => room.room === roomName)
        const findDoctor = doctors?.find(doctorData =>
            doctorData.deskripsi === specialist &&
            doctorData.name === doctor
        )
        const getCurrentAppointmentDate = appointmentDate.split(',')[0]
        const getPatientInCurrentAppointment = dataPatientRegis?.filter(patient => {
            const checkConfirm = dataConfirmationPatients?.find(confirmPatient =>
                confirmPatient.patientId === patient.id
            )
            return checkConfirm && patient.appointmentDate === createDateFormat(new Date(getCurrentAppointmentDate))
        })
        const getPatientInCurrentRoom = dataConfirmationPatients?.filter(confirmPatient => {
            const currentPatientRegis = getPatientInCurrentAppointment?.find(patientRegis =>
                confirmPatient.patientId === patientRegis.id
            )

            return currentPatientRegis && confirmPatient.roomInfo.roomId === findRoom?.id
        })
        const sortQueueNumber = getPatientInCurrentRoom?.sort((a, b) =>
            Number(b.roomInfo.queueNumber) - Number(a.roomInfo.queueNumber)
        )
        const queueNumber = Array.isArray(getPatientInCurrentRoom) &&
            getPatientInCurrentRoom.length > 0 &&
            Array.isArray(sortQueueNumber) &&
            sortQueueNumber.length > 0
            ? Number(sortQueueNumber[0].roomInfo.queueNumber) + 1 : 1

        const data: SubmitFormPatientRegisT = {
            patientId: idPatientRegistration,
            adminInfo: {
                adminId: user.user?.id as string
            },
            dateConfirmInfo: {
                dateConfirm: createDateFormat(new Date()),
                confirmHour: createHourFormat(new Date),
                treatmentHours: treatmentHours
            },
            doctorInfo: {
                doctorId: findDoctor?.id as string
            },
            roomInfo: {
                roomId: findRoom?.id as string,
                queueNumber: `${queueNumber}`,
                presence: 'tidak hadir'
            }
        }

        API().APIPostPatientData(
            'confirmation-patients',
            data
        )
        .then(res=>{
            setLoadingSubmit(false)
            alert('successful confirmation')
            router.push(`/patient/${params[0]}/${params[1]}/confirmed/${params[3]}/${params[4]}`)
        })
        .catch(err=>{
            pushTriggedErr('There was a server error when confirming patient registration. please try again')
        })
    }

    return {
        optionsSpecialist,
        submitConfirmation,
        handleSelect,
        errInputValue,
        optionsDoctor,
        optionsRoom,
        inputValue,
        clickToggleAutoRoom,
        loadingSubmit,
        nextSubmitConfirmation,
    }
}