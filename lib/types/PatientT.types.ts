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
    // presence: string
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
        message?: string
    }
}

// drug counter
export type DrugCounterT = {
    id: string
    patientId: string
    loketInfo: {loketId: string}
    message: string
    adminInfo: {adminId: string}
    // presence: string
    submissionDate: {
        submissionDate: string
        submitHours: string
    }
    queueNumber: string
    isConfirm: {
        confirmState: boolean
        isSkipped?: boolean
    } & IsConfirmDrugCounterT
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
    isCanceled: boolean
    messageCancelled: string
}

// room
export type RoomTreatmentT = {
    id: string
    room: string
    roomType?: string
    dates?: {
        procurementDate: string
        procurementHours: string
    }
    roomActive?: 'Active' | 'Not Active'
}

// info loket
export type InfoLoketT = {
    id: string
    loketName: string
}

// type for pdf download
export type ConfirmInfoPDFT = {
    queueNumber: string
    treatmentHours: string
    roomName: string
    doctorName: string
    doctorSpecialist: string
    confirmHours: string
    confirmDate: string
    adminInfo: {
        email: string
        name: string
    }
}

type PaymentInfoTreatmentPDFT = {
    message: string
    paymentMethod: string
    totalCost: string
    counterName: string
    dateConfirm: string
    confirmHour: string
}

export type TreatmentResultsPDFT = {
    doctorName: string
    doctorSpecialist: string
    doctorRoom: string
    patientName: string
    patientId: string
    patientEmail: string
    adminInfo: {
        adminName: string
        adminEmail: string
    }
    paymentInfo: PaymentInfoTreatmentPDFT
}

type ArrDataServicingHours = {
    id: string
    day: string
    time: string
}

export type ServicingHoursT = {
    id: string
    title: string
    deskripsi: string
    data: ArrDataServicingHours[]
    minDate: string
    maxDate: string
}