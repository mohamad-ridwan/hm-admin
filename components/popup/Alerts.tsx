'use client'

import { navigationStore } from "lib/useZustand/navigation"

export function Alerts() {
    const { alerts } = navigationStore()

    return (
        <>
            {alerts.onAlert && (
                <div className="flex fixed top-[5rem] z-[60] right-8 max-w-[340px]">
                    <div className="m-auto">
                        <div className="bg-white rounded-lg border-gray-300 border p-3 shadow-lg">
                            <div className="flex flex-row">
                                <div className="ml-2 mr-6">
                                    <span className="font-semibold">{alerts.title}</span>
                                    <span className="block text-gray-500">{alerts.desc}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}