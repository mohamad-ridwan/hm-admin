'use client'

import { CSSProperties, ReactNode } from "react"
import { navigationStore } from "lib/useZustand/navigation"

type TitleProps = {
    title?: string
    desc?: string
    classHeadTitle?: string
    classHeadDesc?: string
}

type Props = TitleProps & {
    children: ReactNode
    maxWidth?: string
    overflow?: string
    isNavleft?: boolean
    classWrapp?: string
    styleContainer?: CSSProperties
    styleHead?: CSSProperties
    wrappId?: string
}

export function Container({
    title,
    desc,
    classHeadTitle,
    classHeadDesc,
    children,
    maxWidth = 'w-[1300px]',
    overflow,
    classWrapp,
    isNavleft = true,
    styleContainer,
    styleHead,
    wrappId
}: Props) {
    const { onNavLeft } = navigationStore()

    return (
        <div
            className={`flex ${isNavleft ? `justify-center w-full pt-[120px] pr-[20px] pb-[40px] mobile:max-tablet:px-[0.65rem] ${onNavLeft ? 'tablet:pl-[90px]' : 'tablet:pl-[270px]'}`: classWrapp}  transition-all`}
            id={wrappId}
        >
            <div
                className={`flex flex-col ${maxWidth} ${overflow}`}
                style={styleContainer}
            >
                <div
                    className={`flex flex-wrap overflow-hidden ${classHeadTitle}`}
                    style={styleHead}
                >
                    <h1
                        className="text-3xl mr-2 font-semibold text-font-color-3 text-start"
                    >
                        {title}
                    </h1>
                    <span className={`text-pink text-start ${classHeadDesc}`}>{desc}</span>
                </div>
                {children}
            </div>
        </div>
    )
}