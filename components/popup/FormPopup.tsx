'use client'

import { ComponentType, ReactNode } from "react"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import InputContainer from "components/input/InputContainer"

type ActionProps = {
    clickClose: () => void
    submit?: () => void
}

type TitleProps = {
    title: string
    namePatient: string
}

type InputContainerProps = {
    children: ReactNode
    tag?: ComponentType | keyof JSX.IntrinsicElements
}

type Props = ActionProps & TitleProps & InputContainerProps

export function FormPopup({
    clickClose,
    submit,
    title,
    namePatient,
    children,
    tag = 'form'
}: Props) {
    return (
        <div
            className="flex flex-col bg-white h-fit w-full max-w-[400px] mt-[5rem] mb-[5rem] mx-[10px] rounded-md shadow-lg pt-4 px-[1rem] pb-6"
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="flex justify-end"
            >
                <button
                    className="text-font-color-2 text-sm"
                    onClick={clickClose}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>

            <div
                className="flex flex-wrap my-3"
            >
                <h1
                    className="text-start mr-1 font-bold text-font-color-2"
                >
                    {title}
                </h1>
                <span
                    className="text-start font-bold text-pink-old"
                >{namePatient}</span>
            </div>

            <InputContainer
                tag={tag}
            >
                {children}
            </InputContainer>
        </div>
    )
}