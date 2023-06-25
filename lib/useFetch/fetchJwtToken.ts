import { backendUrl } from "lib/api/backendUrl"

export async function fetchJwtToken<T>(
    path: string,
    method: string,
    token: string
):Promise<T>{
    return await new Promise((resolve, reject)=>{
        fetch(`${backendUrl}/${path}`, {
            method: method,
            mode: 'cors',
            headers: {
                "Jwt-Token": token
            }
        })
        .then(res=>res.json())
        .then((res)=>resolve(res))
        .catch(err=>reject(err))
    })
}