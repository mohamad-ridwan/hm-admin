import { DoctorScheduleT, HolidaySchedule, MedsosDoctorT } from "./DoctorsT.types"
import { ConfirmedTime, DateConfirmInfo, RoomInfo } from "./PatientT.types"

export type InputEditPatientRegistrationT = {
    patientName: string
    phone: string
    emailAddress: string
    dateOfBirth: string
    appointmentDate: string
    message: string
    patientComplaints: string
    submissionDate: string
    clock: string
}

export type InputEditConfirmPatientT = {
    patientId: string
    emailAdmin: string
    dateConfirm: string
    confirmHour: string
    treatmentHours: string
    nameDoctor: string
    doctorSpecialist: string
    roomName: string
    queueNumber: string
    // presence: string
}

export type SubmitEditConfirmPatientT = {
    patientId: string
    adminInfo: { adminId: string }
    dateConfirmInfo: DateConfirmInfo
    doctorInfo: { doctorId: string }
    roomInfo: RoomInfo
}

export type DoctorActiveT = 'Active' | 'Not Active' | 'Select Active Doctor' | 'Must be required'

export type AddNewDoctorT = {
    image: string
    name: string
    deskripsi: string
    email: string
    phone: string
    room: string
    doctorActive: DoctorActiveT
    medsos: MedsosDoctorT[]
    doctorSchedule: DoctorScheduleT[]
    holidaySchedule: HolidaySchedule[]
}

export type ErrInputAddDoctor = {
    image: string
    name: string
    deskripsi: string
    email: string
    phone: string
    room: string
    doctorActive: DoctorActiveT
    medsos: string
    doctorSchedule: string
    holidaySchedule: string
}

export type InputPatientRegistrationT = {
    specialist: string
    doctor: string
    practiceHours: string
    roomName: string
    treatmentHours: string
}

export type SubmitFormPatientRegisT = {
    patientId: string
    adminInfo: {
        adminId: string
    }
    dateConfirmInfo: DateConfirmInfo
    doctorInfo: {
        doctorId: string
    }
    roomInfo: RoomInfo
}

export type InputEditPatientCounter = {
    patientId: string
    loketName: string
    message: string
    adminEmail: string
    submissionDate: string
    submitHour: string
    queueNumber: string
}

type InputEditConfirmPatientCPropsT = {
    dateConfirm: string
    confirmHour: string
    adminEmail: string
    bpjsNumber: string
    totalCost: string
    message: string
}

export type InputEditConfirmPatientCounter = InputEditConfirmPatientCPropsT & {
    paymentMethod: 'cash' | 'BPJS' | 'Select Payment Method' | null
}

export type ErrInputEditConfirmPatientCounter = InputEditConfirmPatientCPropsT & {
    paymentMethod: string
}

export type SubmitFinishedTreatmentT = {
    patientId: string
    confirmedTime: ConfirmedTime
    adminInfo: { adminId: string }
    isCanceled: boolean | string
    messageCancelled: string
}

export type InputDrugCounterT = {
    loketName: string
    message: string
}

export type SubmitDrugCounterT = {
    patientId: string
    loketInfo: { loketId: string }
    message: string
    adminInfo: { adminId: string }
    // presence: string
    submissionDate: {
        submissionDate: string
        submitHours: string
    }
    queueNumber: string
}

export type InputConfirmDrugCounterT = {
    paymentMethod: 'cash' | 'BPJS' | 'Select Payment Method'
    bpjsNumber: string
    totalCost: string
    message: string
}

type PaymentInfo = {
    paymentMethod: 'cash' | 'BPJS'
    bpjsNumber: string
    totalCost: string
    message: string
}

export type SubmitConfirmDrugCounterT = SubmitDrugCounterT & {
    isConfirm: {
        confirmState: boolean
        dateConfirm?: {
            dateConfirm: string
            confirmHour: string
        }
        adminInfo?: { adminId: string }
        paymentInfo?: PaymentInfo
        isSkipped?: boolean
    }
}

export type InputEditFinishTreatmentT = {
    patientId: string
    dateConfirm: string
    confirmHour: string
    adminEmail: string
    messageCancelled: string
}

export type SubmitEditFinishTreatmentT = {
    patientId: string
    confirmedTime: {
        dateConfirm: string
        confirmHour: string
    }
    adminInfo: {
        adminId: string
    }
    isCanceled: boolean
    messageCancelled: string
}

export type InputAddPatientT = {
    patientName: string
    phone: string
    emailAddress: string
    dateOfBirth: string
    selectDay: string
    appointmentDate: string
    patientComplaints: string
    message: string
}

export type InputAddRoomT = {
    room: string
    roomType: string
    procurementDate: string
    procurementHours: string
    roomActive: 'Active' | 'Not Active' | 'Select Room Active' | 'Must be required' | ''
}

export type InputSubmitAddRoomT = {
    room: string
    roomType?: string
    dates: {
        procurementDate: string
        procurementHours: string
    }
    roomActive: 'Active' | 'Not Active'
}

export type InputAddCounterT = {
    loketName: string
    counterType: 'BPJS' | 'cash' | 'Select Payment Method' | 'Must be required'
    roomActive: 'Active' | 'Not Active' | 'Select Room Active' | 'Must be required'
}

export type InputSubmitAddCounterT = {
    id: string
    loketName: string
    counterType: 'BPJS' | 'cash'
    dates: {
        procurementDate: string
        procurementHours: string
    }
    roomActive: 'Active' | 'Not Active'
}

export type FirebaseConfigT = {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
}

export type OptionImgCompressedT = {
    maxSizeMB: number,
    maxWidthOrHeight: number,
    useWebWorker: boolean,
}

export type InputEditCounterT = {
    loketName: string
    counterType: 'BPJS' | 'cash' | 'Select Payment Method' | 'Must be required'
    procurementDate: string
    procurementHours: string
    roomActive: 'Active' | 'Not Active' | 'Select Room Active' | 'Must be required'
}

export type SubmitInputEditCounterT = {
    loketName: string
    counterType: 'BPJS' | 'cash',
    dates: {
        procurementDate: string
        procurementHours: string
    }
    roomActive: 'Active' | 'Not Active'
}

export type SubmitEditProfileT = {
    name: string
    image: string
    password: string
}

export type FormatPDFT =
    'a4' |
    'a2' |
    'b3' |
    'c3' |
    'dl' |
    'letter' |
    'government-letter' |
    'legal' |
    'junior-legal' |
    'ledger' |
    'tabloid' |
    'credit-card' |
    number[] |
    undefined

export type UnitPDFT =
    'em' |
    'pt' |
    'px' |
    'in' |
    'mm' |
    'cm' |
    'ex' |
    'pc' |
    undefined