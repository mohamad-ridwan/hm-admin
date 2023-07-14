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
export type DateConfirmInfo = {
    dateConfirm: string,
    confirmHour: string,
    treatmentHours: string
}

export type RoomInfo = {
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

type IsConfirmDrugCounterT = {
    dateConfirm:{
        dateConfirm: string
        confirmHour: string
    }
    adminInfo: {adminId: string}
    paymentInfo: {
        paymentMethod: 'cash' | 'BPJS'
        bpjsNumber: string
        totalCost: string
    }
}

// drug counter
export type DrugCounterT = {
    id: string
    patientId: string
    loketInfo: {loketId: string}
    message: string
    adminInfo: {adminId: string}
    presence: string
    submissionDate: {
        submissionDate: string
        submitHours: string
    }
    isConfirm: {confirmState: boolean} & IsConfirmDrugCounterT
}

// finished treatment
export type ConfirmedTime = {
    dateConfirm: string
    confirmHour: string
}

export type PatientFinishTreatmentT = {
    id: string
    patientId: string
    confirmedTime: ConfirmedTime
    adminInfo: { adminId: string }
    isCanceled: boolean | string
}

// room
export type RoomTreatmentT = {
    id: string
    room: string
}