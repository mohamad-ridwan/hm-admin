'use client'

type Props = {
    title: string
    description: string
}

export function setHead({
    title,
    description
}: Props): void {
    if (typeof window !== 'undefined') {
        document.title = title
        document.querySelector('meta[name="description"]')?.setAttribute("content", description)
    }
}