'use client'

import { ChangeEvent } from "react"

type ActionProps = {
    changeInput: (e: ChangeEvent<HTMLTextAreaElement>)=>void
}

type Props = ActionProps & {
    id?: string
    placeholder?: string
    nameInput: string
    valueInput: string
    cols?: number
    rows?: number
}

export function InputArea({
    changeInput,
    id,
    placeholder,
    nameInput,
    valueInput,
    cols = 5,
    rows = 3
}: Props){
    return(
        <textarea
        name={nameInput}
        id={id}
        cols={cols} 
        rows={rows}
        placeholder={placeholder}
        value={valueInput}
        onChange={changeInput}
        className="text-sm font-color-2 font-normal w-full py-2 px-3 border-solid border-bdr-one border-color-young-gray hover:border-color-default focus:outline-none focus:border-color-default my-1 transition"
        ></textarea>
    )
}