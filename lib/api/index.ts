import { useFetch } from "lib/useFetch/useFetch";
import { endpoint } from "./endpoint";
import { fetchJwtToken } from "lib/useFetch/fetchJwtToken";

type ParamT = string | number | boolean

export type DataRequest = {
    [key: string]: ParamT |
    { [key: string]: ParamT } |
    { [key: string]: ParamT }[]
}

// servicing hours
// post patient data
const APIPostPatientData = (roleId: string, data: DataRequest)=>useFetch(endpoint.postPatientData(roleId), 'POST', data)
// update patient data
const APIPutPatientData = (roleId: string, id: string, data: DataRequest) => useFetch(endpoint.putPatientData(roleId, id), 'PUT', data)
// delete patient data
const APIDeletePatientData = (roleId: string, id: string, patientId: string) => useFetch(endpoint.deletePatientData(roleId, id, patientId), 'DELETE')

// doctors
const APIPostNewDoctor = (id: string, data: DataRequest)=>useFetch(endpoint.postNewDoctor(id), 'POST', data)
const APIDeleteProfileDoctor = (roleId: string, id: string)=>useFetch(endpoint.deleteProfileDoctor(roleId, id), 'DELETE')
const APIPutProfileDoctor = (roleId: string, id: string, data: DataRequest)=>useFetch(endpoint.putProfileDoctor(roleId, id), 'PUT', data)

// verification
const APIGetVerification = () => useFetch(endpoint.getVerification(), 'GET')
const APIPutVerification = (userId: string, data: DataRequest) => useFetch(endpoint.putVerification(userId), 'PUT', data)
const APIPostVerification = (data: DataRequest) => useFetch(endpoint.postVerification(), 'POST', data)
const APIDeleteVerification = (id: string) => useFetch(endpoint.deleteVerification(id), 'DELETE')
// verification create new password and create jwt-token
const APIPostCreateJwtToken = (userId: string) => useFetch(endpoint.postCreateJwtToken(userId), 'POST')
const APIGetJwtTokenVerif = (token: string) => fetchJwtToken(endpoint.getTokenJwt(), 'GET', token)

// admin
const APIGetAdmin = () => useFetch(endpoint.getAdmin(), 'GET')
const APIPutAdmin = (adminId: string, data: DataRequest) => useFetch(endpoint.putAdmin(adminId), 'PUT', data)
const APIPutAdminVerification = (adminId: string, data: DataRequest) => useFetch(endpoint.putAdminVerification(adminId), 'PUT', data)
const APIPostAdmin = (data: DataRequest) => useFetch(endpoint.postAdmin(), 'POST', data)

// blacklist token JWT
const APIPostBlackListJWT = (data: DataRequest) => useFetch(endpoint.postBlackListJWT(), 'POST', data)

export function API() {
    return {
        APIPostPatientData,
        APIPutPatientData,
        APIDeletePatientData,
        APIPostNewDoctor,
        APIDeleteProfileDoctor,
        APIPutProfileDoctor,
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
        APIPostBlackListJWT,
    }
}