'use client'

import { CSSProperties, ReactElement, ReactNode } from "react"

type ButtonProps = {
    classBtn?: string
    clickBtn?: ()=>void
    styleBtn?: CSSProperties
    nameBtn: string | number
    disabled?: boolean
}

type ChildrenButton = ButtonProps & {
    children?: ReactNode
}

type IconButton = ChildrenButton & {
    icon?: ReactElement
}

type LoadingProps = IconButton & {
    classLoading?: string
    styleLoading?: CSSProperties
}

type Props = LoadingProps

export default function Button({
    classBtn,
    clickBtn,
    disabled,
    styleBtn,
    nameBtn,
    children,
    icon,
    classLoading,
    styleLoading,
}: Props){
    return <button className={`flex text-center justify-center items-center py-[0.7rem] px-2 border-bdr-one border-color-default bg-color-default text-white 
    text-[0.85rem] font-semibold hover:text-color-default hover:border-color-default transition ${classBtn}`} disabled={disabled} onClick={clickBtn} style={styleBtn}>
        {nameBtn}
        {children}

        {typeof icon !== 'undefined' && (
            <>{icon}</>
        )}

        <div className={`${classLoading} flex justify-center items-center`} style={styleLoading}>
            <div className="animate-spin h-5 w-5 ml-2 rounded-full border-t-color-default border-[2.5px] border-white"></div>
        </div>
    </button>
}