import { DoctorScheduleT, HolidaySchedule, MedsosDoctorT } from "./DoctorsT.types"
import { DateConfirmInfo, RoomInfo } from "./PatientT.types"

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
    medsos: MedsosDoctorT[]
    doctorSchedule: DoctorScheduleT[]
    holidaySchedule: HolidaySchedule[]
}