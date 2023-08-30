'use client'

import { CSSProperties, ReactElement, ReactNode } from "react"

type ButtonProps = {
    colorBtnTxt?: string
    classBtn?: string
    clickBtn?: () => void
    styleBtn?: CSSProperties
    nameBtn?: string | number
    disabled?: boolean
}

type ChildrenButton = ButtonProps & {
    children?: ReactNode
}

type IconButton = ChildrenButton & {
    icon?: ReactElement
    iconLeft?: ReactElement
}

type LoadingProps = IconButton & {
    idLoading?: string
    classLoading?: string
    styleLoading?: CSSProperties
    heightWidthLoading?: string
    styleCircleLoading?: CSSProperties
}

type Props = LoadingProps

export default function Button({
    colorBtnTxt,
    classBtn,
    clickBtn,
    disabled,
    styleBtn,
    nameBtn,
    children,
    iconLeft,
    icon,
    idLoading,
    classLoading,
    styleLoading,
    styleCircleLoading,
    heightWidthLoading = 'h-5 w-5'
}: Props) {
    return <button className={`flex text-center ${typeof colorBtnTxt === 'undefined' ? 'text-white' : colorBtnTxt} justify-center items-center py-[0.7rem] px-2 border-bdr-one border-color-default bg-color-default 
    text-[0.85rem] font-semibold hover:text-color-default hover:border-color-default transition ${classBtn}`} disabled={disabled} onClick={clickBtn} style={styleBtn}>
        {iconLeft && (
            <>
            {iconLeft}
            </>
        )}

        {nameBtn}
        {children}

        {icon && (
            <>
                {icon}
            </>
        )}

        <div
            id={idLoading}
            className={`${classLoading} flex justify-center items-center`}
            style={styleLoading}
        >
            <div className={`${heightWidthLoading} animate-spin ml-2 rounded-full border-t-color-default border-[2.5px] border-white`} style={styleCircleLoading}></div>
        </div>
    </button>
}