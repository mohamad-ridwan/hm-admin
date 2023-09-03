import { AlertsT, NotificationT } from "lib/types/TableT.type"
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

type NotificationProps = {
    alerts: AlertsT
    notification: NotificationT
    setOnAlerts: (alerts: AlertsT)=>void
    setNotification: (notification: NotificationT)=>void
}

type DefaultProps = NotFoundProps & NavLeftProps & NotificationProps

export const navigationStore = create<DefaultProps>()((set)=>({
    isNavigation: false,
    setNavigate: (param)=>set((state)=>({isNavigation: param})),
    isNotFound: false,
    setIsNotFound: (param)=>set((state)=>({isNotFound: param})),
    // default (true)
    onNavLeft: true,
    setOnNavLeft: (p: boolean)=>set((state)=>({onNavLeft: p})),
    alerts: {
        onAlert: false,
        title: '',
        desc:''
    },
    setOnAlerts: (alerts)=>set((state)=>({alerts})),
    notification: {
        onNotif: false,
        title: '',
        desc: ''
    },
    setNotification:(notification)=>set((state)=>({notification}))
}))