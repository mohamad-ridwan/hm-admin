'use client'

import { backendUrl } from "lib/api/backendUrl"
import useSWR, { Fetcher } from "swr"

type APIData<T> = {
    data: T | undefined
    error: T
    isLoading: boolean
}

export function useSwr<T>(
        path: string,
        options?: { refreshInterval: number } | { [key:string]: T }
    ): APIData<T> {
    const getFetch = (url: string): Promise<T> => fetch(url, {
        method: 'GET',
    }).then((res) => {
        return res.json() as Promise<T>
    })

    const fetcher: Fetcher<T, string> = (url) => getFetch(url)

    const { data, error, isLoading } = useSWR(`${backendUrl}/${path}`, fetcher, options)

    return {
        data,
        error,
        isLoading,
    }
}