'use client'

import { ReactNode } from "react"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type ActionProps = {
    clickClose: ()=>void
}

type DescriptionProps = {
    title?: string
    desc?: string
}

type ChildProps = {
    children?: ReactNode
}

type Props = ActionProps & DescriptionProps & ChildProps

export function SettingPopup({
    clickClose,
    title,
    desc,
    children
}: Props){
    return (
        <div
        className="flex flex-col bg-white h-fit w-full max-w-[400px] mt-[5rem] mb-[5rem] mx-[10px] rounded-md shadow-lg pt-4 pb-6"
        onClick={(e)=>{
            e.stopPropagation()
        }}
        >
            <div
                className="flex justify-end px-[1rem]"
            >
                <button
                    className="text-font-color-2 text-sm"
                    onClick={clickClose}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>

            <div
            className="flex flex-col px-[1rem]"
            >
                <h1
                className="text-center font-semibold text-2xl text-font-color-3 mt-4"
                >{title}</h1>
                <p>{desc}</p>
            </div>

            {/* button action */}
            <div
            className="flex flex-wrap justify-center mt-4 border-t-[1px] border-bdr-bottom pt-4"
            >
                {children}
            </div>
        </div>
    )
}