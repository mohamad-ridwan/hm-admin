'use client'

import { ReactNode, useEffect } from "react"
import { setHead } from "components/SetHead"
import { navigationStore } from "lib/useZustand/navigation"

type DefaultProps = {
    isNavigateOff?: boolean
    className?: string
    children: ReactNode
}

type HeadProps = DefaultProps & {
    title?: string
    description?: string
}

type TemplateProps = HeadProps

export default function Template({
    isNavigateOff,
    className,
    children,
    title,
    description
}: TemplateProps) {
    const {setNavigate} = navigationStore()

    useEffect(() => {
        if (typeof title === 'string') {
            setHead({
                title: title,
                description: description as string
            })
        }
        if(isNavigateOff){
            setTimeout(() => {
                setNavigate(false)
            }, 50)
        }else if(typeof isNavigateOff === 'undefined') {
            setNavigate(true)
        }
    }, [])

    return <div className={className}>{children}</div>
}