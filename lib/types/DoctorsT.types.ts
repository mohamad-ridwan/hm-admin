export type MedsosDoctorT = {
    id: string
    nameIcon: string
    path: string
    medsosName: string
    elementIcon: string
}

export type DoctorScheduleT = {
    id: string
    dayName: string
    practiceHours: string
}

export type HolidaySchedule = {
    id: string
    date: string
}

export type ProfileDoctorT = {
    id: string
    image: string
    name: string
    deskripsi: string
    email: string
    phone: string
    room: string
    doctorActive?: 'Active' | 'Not Active'
    medsos: MedsosDoctorT[]
    doctorSchedule: DoctorScheduleT[]
    holidaySchedule: HolidaySchedule[]
}