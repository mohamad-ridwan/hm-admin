type MedsosDoctorT={
    id: string
    nameIcon: string
    path: string
}

type DoctorScheduleT = string[]

export type ProfileDoctorT = {
    id: string
    image: string
    name: string
    deskripsi: string
    medsos: MedsosDoctorT[]
    jadwalDokter: DoctorScheduleT
    room: string
}