import { useFetch } from "lib/useFetch/useFetch";
import { endpoint } from "./endpoint";
import { fetchJwtToken } from "lib/useFetch/fetchJwtToken";

type PropsAPIType<T> = {
    [key: string]: (p1?: T, p2?: T, p3?: T) => any
}

// servicing hours
// update patient data
const APIPutPatientData = <T>(roleId?: T, id?: T, data?: T)=>useFetch(endpoint.putPatientData(roleId as string, id as string), 'PUT', data)
// delete patient data
const APIDeletePatientData = <T>(roleId?: T, id?: T)=>useFetch(endpoint.deletePatientData(roleId as string, id as string), 'DELETE')

// verification
const APIGetVerification = ()=>useFetch(endpoint.getVerification(), 'GET')
const APIPutVerification = <T>(userId: T, data: T)=>useFetch(endpoint.putVerification(userId as string), 'PUT', data)
const APIPostVerification = <T>(data: T)=>useFetch(endpoint.postVerification(), 'POST', data)
const APIDeleteVerification = <T>(id: T)=>useFetch(endpoint.deleteVerification(id as string), 'DELETE')
// verification create new password and create jwt-token
const APIPostCreateJwtToken = <T>(userId?: T)=>useFetch(endpoint.postCreateJwtToken(userId as string), 'POST')
const APIGetJwtTokenVerif = <T>(token?: T)=>fetchJwtToken(endpoint.getTokenJwt(), 'GET', token as string)

// admin
const APIGetAdmin = () => useFetch(endpoint.getAdmin(), 'GET')
const APIPutAdmin = <T>(adminId?: T, data?: T) => useFetch(endpoint.putAdmin(adminId as string), 'PUT', data)
const APIPutAdminVerification = <T>(adminId?: T, data?: T)=>useFetch(endpoint.putAdminVerification(adminId as string), 'PUT', data)
const APIPostAdmin = <T>(data?: T) => useFetch(endpoint.postAdmin(), 'POST', data)

// blacklist token JWT
const APIPostBlackListJWT = <T>(data?: T)=>useFetch(endpoint.postBlackListJWT(), 'POST', data)

export function API<T>(): PropsAPIType<T> {
    return {
        APIPutPatientData,
        APIDeletePatientData,
        APIGetVerification,
        APIPutVerification,
        APIPostVerification,
        APIDeleteVerification,
        APIGetAdmin,
        APIPutAdmin,
        APIPutAdminVerification,
        APIPostAdmin,
        APIPostCreateJwtToken,
        APIGetJwtTokenVerif,
        APIPostBlackListJWT
    }
}