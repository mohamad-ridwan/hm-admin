export type MedsosDoctorT={
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
    medsos: MedsosDoctorT[]
    doctorSchedule: DoctorScheduleT[]
    holidaySchedule: HolidaySchedule[]
    room: string
}