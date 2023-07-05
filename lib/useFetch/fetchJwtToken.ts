import { backendUrl } from "lib/api/backendUrl"

export async function fetchJwtToken<T extends string>(
    path: T,
    method: T,
    token: T,
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