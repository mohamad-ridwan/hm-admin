'use client'

import { backendUrl } from 'lib/api/backendUrl'
import useSwr, {preload} from 'swr'

export async function preloadFetch<T = {[key: string]: any}>(path: string): Promise<T>{
    return await new Promise((resolve, reject)=>{
        const fetcher = (url: string)=>fetch(url)
        .then(res=>res.json())
        .then(res=>resolve(res))
        .catch(err=>reject(err))

        preload(`${backendUrl}/${path}`, fetcher)
    })
}