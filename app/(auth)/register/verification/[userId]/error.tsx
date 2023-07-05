'use client'

import { useEffect } from "react"
import { ErrorUi } from "components/ErrorUi"

type Props = {
    error: Error
    reset: () => void
}

export default function Error({
    error,
    reset
}: Props) {
    useEffect(() => {
        console.log(error)
        console.log(error.cause)
    }, [error])

    return (
        <ErrorUi
        error={error}
        reset={reset}
        />
    )
}