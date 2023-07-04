'use client'

import {CSSProperties, ChangeEvent, HTMLAttributes} from 'react'

type Props = {
    id?: string
    type: string
    placeholder?: string
    nameInput: string
    valueInput?: string | number | string[] | undefined
    accept?: string
    maxLength?: number
    styles?: CSSProperties
    readonly?: boolean
    changeInput: (e: ChangeEvent<HTMLInputElement>)=>void
}

export default function Input({
    id,
    type,
    placeholder,
    nameInput,
    valueInput,
    accept,
    maxLength,
    styles,
    readonly,
    changeInput,
}: Props & HTMLAttributes<HTMLOrSVGElement>) {
    return (
        <>
            <input id={id} type={type} accept={accept} maxLength={maxLength} className="text-sm font-color-2 font-normal w-full py-2 px-3 border-solid border-bdr-one border-color-young-gray hover:border-color-default focus:outline-none focus:border-color-default my-1 transition" placeholder={placeholder} name={nameInput} value={valueInput} style={styles} readOnly={readonly} onChange={changeInput}/>
        </>
    )
}