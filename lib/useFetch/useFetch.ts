'use client'

import { backendUrl } from "lib/api/backendUrl"

export async function useFetch<Type = {[key: string]: any}>(
    path: string,
    method: string,
    data?: Type
): Promise<Type>{
    return await new Promise<Type>((resolve, reject)=>{
        fetch(`${backendUrl}/${path}`, {
            method: method,
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res=>res.json())
        .then(res=>resolve(res))
        .catch(err=>reject(err))
    })
}