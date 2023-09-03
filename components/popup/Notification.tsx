'use client'

import { navigationStore } from "lib/useZustand/navigation"

export function Notification() {
    const { notification, setNotification } = navigationStore()

    function closeNotif():void{
        setNotification({
            onNotif: false,
            title: '',
            desc: ''
        })
    }

    return (
        <>
            {notification.onNotif && (
                <div id="alert-additional-content-2" className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 fixed bg-white z-[60] max-w-[340px] right-5 top-5 ml-5" role="alert">
                    <div className="flex justify-between">
                        <h3 className="text-lg font-medium">{notification.title}</h3>
                        <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-border-2" aria-label="Close" onClick={closeNotif}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                    <div className="mt-2 text-sm">
                        {notification.desc}
                    </div>
                </div>
            )}
        </>
    )
}