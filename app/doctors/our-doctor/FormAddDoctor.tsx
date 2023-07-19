'use client'

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { AddNewDoctorT } from "lib/types/InputT.type"
import { getImgValue } from "lib/actions/getImgValue"
import { DoctorScheduleT, HolidaySchedule, MedsosDoctorT, ProfileDoctorT } from "lib/types/DoctorsT.types"
import { createDateFormat } from "lib/dates/createDateFormat"
import { API } from "lib/api"
import { uploadImg } from "lib/firebase/uploadImg"
import { getDownloadURL, ref } from "firebase/storage"
import { storage } from "lib/firebase/firebase"
import ServicingHours from "lib/actions/ServicingHours"
import { DataOptionT } from "lib/types/FilterT"
import { mailRegex } from "lib/regex/mailRegex"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faPencil, faUserPlus } from "@fortawesome/free-solid-svg-icons"

type PopupSetting = {
    title: string
    classIcon?: string
    classBtnNext?: string
    iconPopup?: IconDefinition
    nameBtnNext: string
    doctorId?: string
    categoryAction: 'delete-doctor' | 'edit-doctor' | 'add-doctor'
}

type ActionProps = {
    setOnPopupSetting: Dispatch<SetStateAction<PopupSetting>>
}

type PropsComponent = ActionProps

type ErrInputAddDoctor = {
    image: string
    name: string
    deskripsi: string
    email: string
    phone: string
    room: string
    medsos: string
    doctorSchedule: string
    holidaySchedule: string
}

function FormAddDoctor({
    setOnPopupSetting
}: PropsComponent) {
    const [onPopupAddDoctor, setOnPopupAddDoctor] = useState<boolean>(false)
    const [titleFormDoctor, setTitleFormDoctor] = useState<{
        title: string
        peopleName: string
        btnName: string
    }>({
        title: '',
        peopleName: '',
        btnName: ''
    })
    const [onPopupAddMedsos, setOnPopupAddMedsos] = useState<boolean>(false)
    const [onPopupAddDoctorSchedule, setOnPopupDoctorSchedule] = useState<boolean>(false)
    const [onPopupAddHolidaySchedule, setOnPopupAddHolidaySchedule] = useState<boolean>(false)
    const [imgFile, setImgFile] = useState<File | null>(null)
    const [roomOptions, setRoomOptions] = useState<DataOptionT>([
        {
            id: 'Select Room',
            title: 'Select Room'
        }
    ])
    const [inputValueAddDoctor, setInputValueAddDoctor] = useState<AddNewDoctorT>({
        image: '',
        name: '',
        deskripsi: '',
        email: '',
        phone: '',
        room: '',
        medsos: [],
        doctorSchedule: [],
        holidaySchedule: []
    })
    const [inputAddMedsos, setInputAddMedsos] = useState<MedsosDoctorT>({
        id: '',
        nameIcon: '',
        elementIcon: '',
        path: '',
        medsosName: ''
    })
    const [inputAddDoctorSchedule, setInputAddDoctorSchedule] = useState<DoctorScheduleT>({
        id: '',
        dayName: '',
        practiceHours: ''
    })
    const [inputAddHolidaySchedule, setInputAddHolidaySchedule] = useState<HolidaySchedule>({
        id: '',
        date: ''
    })
    const [errInputAddHolidaySchedule, setErrInputAddHolidaySchedule] = useState<HolidaySchedule>({} as HolidaySchedule)
    const [errInputAddDoctorSchedule, setErrInputErrDoctorSchedule] = useState<DoctorScheduleT>({} as DoctorScheduleT)
    const [errInputAddMedsos, setErrInputAddMedsos] = useState<MedsosDoctorT>({} as MedsosDoctorT)
    const [errInputAddDoctor, setErrInputAddDoctor] = useState<ErrInputAddDoctor>({} as ErrInputAddDoctor)
    const [loadingSubmitAddDoctor, setLoadingSubmitAddDoctor] = useState<boolean>(false)
    // action edit doctor
    const [idEditDoctor, setIdEditDoctor] = useState<string | null>(null)
    const [idLoadingEdit, setIdLoadingEdit] = useState<string[]>([])

    const {
        loadDataService,
        dataRooms,
        doctors,
        pushTriggedErr
    } = ServicingHours()

    function getRooms(): void {
        if (
            Array.isArray(dataRooms) &&
            dataRooms.length > 0
        ) {
            const rooms = dataRooms?.map(room => ({
                id: room.room,
                title: room.room
            }))
            setRoomOptions([
                { id: 'Select Room', title: 'Select Room' },
                ...rooms
            ])
        }
    }

    useEffect(() => {
        if (!loadDataService) {
            getRooms()
        }
    }, [loadDataService, dataRooms])

    function closePopupAddDoctor(): void {
        setOnPopupAddDoctor(false)
    }

    function clickNewDoctor(): void {
        setOnPopupAddDoctor(true)
        setInputValueAddDoctor({
            image: '',
            name: '',
            deskripsi: '',
            email: '',
            phone: '',
            room: '',
            medsos: [],
            doctorSchedule: [],
            holidaySchedule: []
        })
        setImgFile(null)
        setTitleFormDoctor({
            title: 'Added a new doctor',
            peopleName: '',
            btnName: 'Add Doctor'
        })
        setErrInputAddDoctor({} as ErrInputAddDoctor)
    }

    function clickOpenImage(): void {
        document.getElementById('inputImg')?.click()
    }

    function getImgFile(e: ChangeEvent<HTMLInputElement>): void {
        const files = e.target.files
        getImgValue(files)
            .then(res => {
                setInputValueAddDoctor({
                    ...inputValueAddDoctor,
                    image: res.url
                })

                setImgFile(res.files[0])
            })
            .catch(err => {
                alert(err)
            })
    }

    function deleteImg(): void {
        setInputValueAddDoctor({
            ...inputValueAddDoctor,
            image: ''
        })
        setImgFile(null)
    }

    function changeInputAddDoctor(e: ChangeEvent<HTMLInputElement>): void {
        setInputValueAddDoctor({
            ...inputValueAddDoctor,
            [e.target.name]: e.target.value
        })

        setErrInputAddDoctor({
            ...errInputAddDoctor,
            [e.target.name]: ''
        })
    }

    function selectRoomDoctor(): void {
        const selectEl = document.getElementById('selectRoom') as HTMLSelectElement
        const id = selectEl?.options[selectEl.selectedIndex].value
        if (id) {
            if (id !== 'Select Room') {
                const findRoom = dataRooms?.find(room => room.room === id)
                setInputValueAddDoctor({
                    ...inputValueAddDoctor,
                    room: findRoom?.id as string
                })

                setErrInputAddDoctor({
                    ...errInputAddDoctor,
                    room: ''
                })
            } else {
                setInputValueAddDoctor({
                    ...inputValueAddDoctor,
                    room: ''
                })
            }
        }
    }

    // action add medsos
    function onAddMedsos(): void {
        if (onPopupAddMedsos === false) {
            setInputAddMedsos({
                ...inputAddMedsos,
                id: `${new Date().getTime()}`
            })
        }
        setOnPopupAddMedsos(!onPopupAddMedsos)
    }

    function changeInputAddMedsos(e: ChangeEvent<HTMLInputElement>): void {
        setInputAddMedsos({
            ...inputAddMedsos,
            [e.target.name]: e.target.value
        })

        setErrInputAddMedsos({
            ...errInputAddMedsos,
            [e.target.name]: ''
        })
    }

    function submitAddMedsos(): void {
        if (validateAddMedsos()) {
            const medsos = inputValueAddDoctor.medsos
            medsos.push(inputAddMedsos)
            setInputValueAddDoctor({
                ...inputValueAddDoctor,
                medsos: medsos
            })

            setOnPopupAddMedsos(false)
            setInputAddMedsos({
                id: '',
                nameIcon: '',
                elementIcon: '',
                path: '',
                medsosName: ''
            })
        }
    }

    function validateAddMedsos(): string | undefined {
        let err: MedsosDoctorT = {} as MedsosDoctorT

        if (!inputAddMedsos.id.trim()) {
            err.id = 'Must be required'
        }
        if (!inputAddMedsos.nameIcon.trim()) {
            err.nameIcon = 'Must be required'
        }
        if (!inputAddMedsos.elementIcon.trim()) {
            err.elementIcon = 'Must be required'
        }
        if (!inputAddMedsos.path.trim()) {
            err.path = 'Must be required'
        }
        if (!inputAddMedsos.medsosName.trim()) {
            err.medsosName = 'Must be required'
        }

        if (Object.keys(err).length !== 0) {
            setErrInputAddMedsos(err)
            return
        }

        return 'success'
    }

    function deleteMedsos(id: string): void {
        const checkId = inputValueAddDoctor.medsos.filter(item => item.id !== id)

        setInputValueAddDoctor({
            ...inputValueAddDoctor,
            medsos: checkId
        })
    }
    // end action add medsos

    // action add doctor schedule
    function onAddDoctorSchedule(): void {
        if (onPopupAddDoctorSchedule === false) {
            setInputAddDoctorSchedule({
                ...inputAddDoctorSchedule,
                id: `${new Date().getTime()}`
            })
        }

        setOnPopupDoctorSchedule(!onPopupAddDoctorSchedule)
    }

    function changeInputAddDocSchedule(e: ChangeEvent<HTMLInputElement>): void {
        setInputAddDoctorSchedule({
            ...inputAddDoctorSchedule,
            practiceHours: e.target.value
        })

        setErrInputErrDoctorSchedule({
            ...errInputAddDoctorSchedule,
            practiceHours: ''
        })
    }

    function selectDayAddDoctorSchedule(): void {
        const selectEl = document.getElementById('selectDay') as HTMLSelectElement
        const id = selectEl?.options[selectEl.selectedIndex].value
        if (id) {
            if (id !== 'Select Day') {
                setInputAddDoctorSchedule({
                    ...inputAddDoctorSchedule,
                    dayName: id
                })
            } else {
                setInputAddDoctorSchedule({
                    ...inputAddDoctorSchedule,
                    dayName: ''
                })
            }
        }
    }

    function deleteSchedule(id: string): void {
        const checkId = inputValueAddDoctor.doctorSchedule.filter(item => item.id !== id)

        setInputValueAddDoctor({
            ...inputValueAddDoctor,
            doctorSchedule: checkId
        })
    }

    function submitAddDoctorSchedule(): void {
        if (validateFormAddDocSchedule()) {
            const doctorSchedule = inputValueAddDoctor.doctorSchedule
            doctorSchedule.push(inputAddDoctorSchedule)
            setInputValueAddDoctor({
                ...inputValueAddDoctor,
                doctorSchedule: doctorSchedule
            })

            setOnPopupDoctorSchedule(false)
            setInputAddDoctorSchedule({
                id: '',
                dayName: '',
                practiceHours: ''
            })
            setErrInputErrDoctorSchedule({} as DoctorScheduleT)
        }
    }

    function validateFormAddDocSchedule(): string | undefined {
        let err: DoctorScheduleT = {} as DoctorScheduleT

        if (!inputAddDoctorSchedule.id.trim()) {
            err.id = 'Must be required'
        }
        if (!inputAddDoctorSchedule.dayName.trim()) {
            err.dayName = 'Must be required'
        }
        if (!inputAddDoctorSchedule.practiceHours.trim()) {
            err.practiceHours = 'Must be required'
        }

        if (Object.keys(err).length !== 0) {
            setErrInputErrDoctorSchedule(err)
            return
        }

        return 'success'
    }
    // end action add doctor schedule

    // action add holiday schedule
    function onAddHolidaySchedule(): void {
        if (onPopupAddHolidaySchedule === false) {
            setInputAddHolidaySchedule({
                ...inputAddHolidaySchedule,
                id: `${new Date().getTime()}`
            })
        }

        setOnPopupAddHolidaySchedule(!onPopupAddHolidaySchedule)
    }

    function selectHolidayDate(e?: Date | ChangeEvent<HTMLInputElement>): void {
        setInputAddHolidaySchedule({
            ...inputAddHolidaySchedule,
            date: createDateFormat(e as Date)
        })

        setErrInputAddHolidaySchedule({
            ...errInputAddHolidaySchedule,
            date: ''
        })
    }

    function deleteHolidaySchedule(id: string): void {
        const checkId = inputValueAddDoctor.holidaySchedule.filter(item => item.id !== id)
        setInputValueAddDoctor({
            ...inputValueAddDoctor,
            holidaySchedule: checkId
        })
    }

    function submitAddHolidaySchedule(): void {
        if (validateFormAddHoliday()) {
            const holidaySchedule = inputValueAddDoctor.holidaySchedule
            holidaySchedule.push(inputAddHolidaySchedule)
            setInputValueAddDoctor({
                ...inputValueAddDoctor,
                holidaySchedule: holidaySchedule
            })

            setOnPopupAddHolidaySchedule(false)
            setInputAddHolidaySchedule({
                id: '',
                date: ''
            })
        }
    }

    function validateFormAddHoliday(): string | undefined {
        let err: HolidaySchedule = {} as HolidaySchedule

        if (!inputAddHolidaySchedule.id.trim()) {
            err.id = 'Must be required'
        }
        if (!inputAddHolidaySchedule.date.trim()) {
            err.date = 'Must be required'
        }

        if (Object.keys(err).length !== 0) {
            setErrInputAddHolidaySchedule(err)
            return
        }

        return 'success'
    }
    // end action add holiday schedule

    // submit form add doctor
    function submitAddDoctor(): void {
        if (
            loadingSubmitAddDoctor === false &&
            validateFormAddDoctor()
            ) {
            setOnPopupSetting({
                title: `Add "${inputValueAddDoctor.name}" as a Doctor?`,
                classIcon: 'text-color-default',
                classBtnNext: 'hover:bg-white',
                iconPopup: faUserPlus,
                nameBtnNext: 'Yes',
                doctorId: idEditDoctor as string,
                categoryAction: 'add-doctor'
            })
        }
    }

    function nextSubmitAddDoctor(): void {
        setLoadingSubmitAddDoctor(true)
        pushToAddNewDoctor()
        setErrInputAddDoctor({} as ErrInputAddDoctor)
        setOnPopupSetting({} as PopupSetting)
    }

    function validateFormAddDoctor(): string | undefined {
        let err: ErrInputAddDoctor = {} as ErrInputAddDoctor

        if (!inputValueAddDoctor.name.trim()) {
            err.name = 'Must be required'
        }
        if (!inputValueAddDoctor.deskripsi.trim()) {
            err.deskripsi = 'Must be required'
        }
        if (!inputValueAddDoctor.email.trim()) {
            err.email = 'Must be required'
        } else if (!mailRegex.test(inputValueAddDoctor.email)) {
            err.email = 'Invalid e-mail address'
        }
        if (!inputValueAddDoctor.phone.trim()) {
            err.phone = 'Must be required'
        }
        if (!inputValueAddDoctor.room.trim()) {
            err.room = 'Must be required'
        }
        if (inputValueAddDoctor.medsos.length === 0) {
            err.medsos = 'Must be required'
        }
        if (inputValueAddDoctor.doctorSchedule.length === 0) {
            err.doctorSchedule = 'Must be required'
        }

        if (Object.keys(err).length !== 0) {
            setErrInputAddDoctor(err)
            return
        }

        return 'success'
    }

    async function uploadImgToFirebase(): Promise<string | undefined> {
        return await new Promise((resolve, reject) => {
            if (imgFile !== null) {
                uploadImg(
                    'doctors',
                    `${imgFile?.name}-${new Date().getTime()}`,
                    imgFile
                )
                    .then(snapshot => {
                        getDownloadURL(ref(storage, snapshot.metadata.fullPath))
                            .then(urlImg => {
                                resolve(urlImg)
                            })
                            .catch(err => {
                                reject('an error occurred while downloading the image file from firebase storage')
                            })
                    })
                    .catch(err => {
                        reject('an error occurred while uploading image to firebase storage')
                    })
            }
        })
    }

    function pushToAddNewDoctor() {
        let newData = inputValueAddDoctor
        if (imgFile === null) {
            API().APIPostNewDoctor(
                'doctor',
                newData
            )
                .then(res => {
                    alert('successfully added new doctor')
                    setLoadingSubmitAddDoctor(false)
                })
                .catch(err => {
                    pushTriggedErr('a server error occurred while adding new doctor data. please try again')
                    setLoadingSubmitAddDoctor(false)
                })
        } else {
            uploadImgToFirebase()
                .then(urlImg => {
                    newData.image = urlImg as string
                    API().APIPostNewDoctor(
                        'doctor',
                        newData
                    )
                        .then(res => {
                            alert('successfully added new doctor')
                            setLoadingSubmitAddDoctor(false)
                        })
                        .catch(err => {
                            pushTriggedErr('a server error occurred while adding new doctor data. please try again')
                            setLoadingSubmitAddDoctor(false)
                        })
                })
                .catch(err => {
                    pushTriggedErr(err)
                    setLoadingSubmitAddDoctor(false)
                })
        }
    }
    // end submit form add doctor

    // action edit doctor
    function clickEdit(doctorId: string): void {
        const findDoctor: ProfileDoctorT = doctors?.find(doctor => doctor.id === doctorId) as ProfileDoctorT
        const {
            image,
            name,
            deskripsi,
            email,
            phone,
            medsos,
            doctorSchedule,
            holidaySchedule,
            room
        } = findDoctor

        setInputValueAddDoctor({
            image,
            name,
            deskripsi,
            email,
            phone,
            medsos,
            doctorSchedule,
            holidaySchedule,
            room
        })
        setIdEditDoctor(doctorId)
        setOnPopupAddDoctor(true)
        setTitleFormDoctor({
            title: 'Edit Doctor',
            peopleName: name,
            btnName: 'Edit'
        })
        setErrInputAddDoctor({} as ErrInputAddDoctor)

        const currentRoom = dataRooms?.find(roomData => roomData.id === room)
        const findIdxRoom = roomOptions.findIndex(room => room.id === currentRoom?.room)
        setTimeout(() => {
            const roomElement = document.getElementById('selectRoom') as HTMLSelectElement
            if (roomElement && findIdxRoom !== -1) {
                roomElement.selectedIndex = findIdxRoom
            }
        }, 50)
    }

    function submitEditDoctor(): void {
        const findCurrentLoading = idLoadingEdit.find(id => id === idEditDoctor)
        if (
            !findCurrentLoading &&
            validateFormAddDoctor()
        ) {
            setOnPopupSetting({
                title: `update doctor "${titleFormDoctor.peopleName}"?`,
                classIcon: 'text-color-default',
                classBtnNext: 'hover:bg-white',
                iconPopup: faPencil,
                nameBtnNext: 'Save',
                doctorId: idEditDoctor as string,
                categoryAction: 'edit-doctor'
            })
        }
    }

    function nextSubmitEditDoctor(): void {
        setIdLoadingEdit((current) => [...current, idEditDoctor as string])
        pushToUpdateProfileDoctor()
    }

    function pushToUpdateProfileDoctor(): void {
        let newData = inputValueAddDoctor
        if (imgFile === null) {
            API().APIPutProfileDoctor(
                'doctor',
                idEditDoctor as string,
                newData
            )
                .then(res => {
                    if (res?.doctorId) {
                        const removeLoadingId = idLoadingEdit.filter(id => id !== res.doctorId)
                        setIdLoadingEdit(removeLoadingId)
                        alert('updated successfully')
                    } else {
                        pushTriggedErr('a server error occurred. please try again')
                    }
                })
                .catch(err => {
                    pushTriggedErr(err)
                })
        } else if (imgFile !== null) {
            uploadImgToFirebase()
                .then(urlImg => {
                    newData.image = urlImg as string
                    API().APIPutProfileDoctor(
                        'doctor',
                        idEditDoctor as string,
                        newData
                    )
                        .then(res => {
                            if (res?.doctorId) {
                                const removeLoadingId = idLoadingEdit.filter(id => id !== res.doctorId)
                                setIdLoadingEdit(removeLoadingId)
                                alert('updated successfully')
                            } else {
                                pushTriggedErr('a server error occurred. please try again')
                            }
                        })
                        .catch(err => {
                            pushTriggedErr(err)
                        })
                })
                .catch(err => {
                    pushTriggedErr(err)
                })
        }
    }
    // end action edit doctor

    return {
        onPopupAddDoctor,
        closePopupAddDoctor,
        clickNewDoctor,
        inputValueAddDoctor,
        errInputAddDoctor,
        clickOpenImage,
        getImgFile,
        deleteImg,
        changeInputAddDoctor,
        onAddMedsos,
        onPopupAddMedsos,
        inputAddMedsos,
        errInputAddMedsos,
        submitAddMedsos,
        changeInputAddMedsos,
        deleteMedsos,
        onPopupAddDoctorSchedule,
        onAddDoctorSchedule,
        inputAddDoctorSchedule,
        errInputAddDoctorSchedule,
        submitAddDoctorSchedule,
        changeInputAddDocSchedule,
        selectDayAddDoctorSchedule,
        deleteSchedule,
        onPopupAddHolidaySchedule,
        onAddHolidaySchedule,
        inputAddHolidaySchedule,
        errInputAddHolidaySchedule,
        deleteHolidaySchedule,
        selectHolidayDate,
        submitAddHolidaySchedule,
        submitAddDoctor,
        loadingSubmitAddDoctor,
        selectRoomDoctor,
        roomOptions,
        clickEdit,
        titleFormDoctor,
        submitEditDoctor,
        idEditDoctor,
        idLoadingEdit,
        nextSubmitEditDoctor,
        nextSubmitAddDoctor
    }
}

export default FormAddDoctor