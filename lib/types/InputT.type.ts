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
    presence: string
}

export type SubmitEditConfirmPatientT = {
    patientId: string
    adminInfo: { adminId: string }
    dateConfirmInfo: DateConfirmInfo
    doctorInfo: { doctorId: string }
    roomInfo: RoomInfo
}

export type AddNewDoctorT = {
    image: string
    name: string
    deskripsi: string
    email: string
    phone: string
    room: string
    medsos: MedsosDoctorT[]
    doctorSchedule: DoctorScheduleT[]
    holidaySchedule: HolidaySchedule[]
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
    adminInfo:{
        adminId: string
    }
    dateConfirmInfo: DateConfirmInfo
    doctorInfo:{
        doctorId: string
    }
    roomInfo: RoomInfo
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
    loketInfo: {loketId: string}
    message: string
    adminInfo: {adminId: string}
    presence: string
    submissionDate: {
        submissionDate: string
        submitHours:string
    }
}