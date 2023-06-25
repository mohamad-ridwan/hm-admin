export type AdminT = {
    _id: string
    id: string
    name: string
    email: string
    image: string
    password: string
    isVerification: boolean
    __v: number
}

export type VerificationT = {
    date: string
    token: string
}

export type VerificationDataResultT = {
    _id: string
    id: string
    userId: string
    verification?: VerificationT
    createdAt?: string
    updatedAt?: string
    __v?: number
}