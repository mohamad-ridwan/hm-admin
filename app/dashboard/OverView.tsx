'use client'

import { UseDashboard } from "./UseDashboard"
import { OverviewCard } from "./OverviewCard"

export function OverView() {
    const {
        overview
    } = UseDashboard()

    return (
        <>
            <div
                className="grid gap-4 grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 py-4 px-1 my-8"
            >
                <OverviewCard data={overview}/>
            </div>
        </>
    )
}