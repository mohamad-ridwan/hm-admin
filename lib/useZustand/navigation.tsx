import { create } from "zustand"

type NavigationProps = {
    isNavigation: boolean
    setNavigate: (param: boolean)=>void
}

type NotFoundProps = NavigationProps & {
    isNotFound: boolean
    setIsNotFound: (param: boolean)=>void
}

type NavLeftProps = {
    onNavLeft: boolean,
    setOnNavLeft: (p: boolean)=>void
}

type DefaultProps = NotFoundProps & NavLeftProps

export const navigationStore = create<DefaultProps>()((set)=>({
    isNavigation: false,
    setNavigate: (param)=>set((state)=>({isNavigation: param})),
    isNotFound: false,
    setIsNotFound: (param)=>set((state)=>({isNotFound: param})),
    // default (true)
    onNavLeft: true,
    setOnNavLeft: (p: boolean)=>set((state)=>({onNavLeft: p}))
}))