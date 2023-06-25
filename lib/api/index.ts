import { useFetch } from "lib/useFetch/useFetch";
import { endpoint } from "./endpoint";

type PropsAPIType<T> = {
    [key: string]: (p1?: T, p2?: T) => any
}

// verification
const APIGetVerification = ()=>useFetch(endpoint.getVerification(), 'GET')
const APIPutVerification = <T>(userId: T, data: T)=>useFetch(endpoint.putVerification(userId as string), 'PUT', data)
const APIPostVerification = <T>(data: T)=>useFetch(endpoint.postVerification(), 'POST', data)
const APIDeleteVerification = <T>(id: T)=>useFetch(endpoint.deleteVerification(id as string), 'DELETE')

// admin
const APIGetAdmin = () => useFetch(endpoint.getAdmin(), 'GET')
const APIPutAdmin = <T>(adminId?: T, data?: T) => useFetch(endpoint.putAdmin(adminId as string), 'PUT', data)
const APIPutAdminVerification = <T>(adminId?: T, data?: T)=>useFetch(endpoint.putAdminVerification(adminId as string), 'PUT', data)
const APIPostAdmin = <T>(data?: T) => useFetch(endpoint.postAdmin(), 'POST', data)

export function API<T>(): PropsAPIType<T> {
    return {
        APIGetVerification,
        APIPutVerification,
        APIPostVerification,
        APIDeleteVerification,
        APIGetAdmin,
        APIPutAdmin,
        APIPutAdminVerification,
        APIPostAdmin,
    }
}