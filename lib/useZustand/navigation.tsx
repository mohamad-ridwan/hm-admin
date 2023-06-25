'use client'

import { create } from "zustand"

type NavigationProps = {
    isNavigation: boolean
    setNavigate: (param: boolean)=>void
}

type NotFoundProps = NavigationProps & {
    isNotFound: boolean
    setIsNotFound: (param: boolean)=>void
}

type DefaultProps = NotFoundProps

export const navigationStore = create<DefaultProps>()((set)=>({
    isNavigation: true,
    setNavigate: (param)=>set((state)=>({isNavigation: param})),
    isNotFound: false,
    setIsNotFound: (param)=>set((state)=>({isNotFound: param}))
}))