import { backendUrl } from "lib/api/backendUrl"

type ParamT = string | number | boolean

export async function useFetch<Type extends
    {
        [key: string]: ParamT |
        { [key: string]: ParamT } |
        { [key: string]: ParamT }[]
    }
    |
    ParamT
>(
    path: string,
    method: string,
    data?: Type
): Promise<Type> {
    return await new Promise<Type>((resolve, reject) => {
        fetch(`${backendUrl}/${path}`, {
            method: method,
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then((res: Type) => resolve(res))
            .catch(err => reject(err))
    })
}