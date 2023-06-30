// patient registration
type PatientMessage = {
    message: string
    patientComplaints: string
}

type SubmissionDate = {
    submissionDate: string
    clock: string
}

export type PatientRegistrationT = {
    id: string
    patientName: string
    phone: string
    emailAddress: string
    dateOfBirth: string
    appointmentDate: string
    patientMessage: PatientMessage
    submissionDate: SubmissionDate
}

// confirmation patients
type DateConfirmInfo = {
    dateConfirm: string,
    confirmHour: string,
    treatmentHours: string
}

type RoomInfo = {
    roomId: string,
    queueNumber: string,
    presence: string
}

export type ConfirmationPatientsT = {
    id: string
    patientId: string
    adminInfo: { adminId: string }
    dateConfirmInfo: DateConfirmInfo
    doctorInfo: { doctorId: string }
    roomInfo: RoomInfo
}

// finished treatment
type ConfirmedTime = {
    dateConfirm: string
    confirmHour: string
}

export type PatientFinishTreatmentT = {
    id: string
    patientId: string
    confirmedTime: ConfirmedTime
    adminInfo: { adminId: string }
}