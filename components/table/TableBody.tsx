import { CSSProperties, ReactNode } from "react"

type Props = {
    children: ReactNode
    style?: CSSProperties
    width?: string
}

export function TableBody({
    children,
    style,
    width
}: Props) {
    return (
        <div
        className="flex pt-[20px] pb-[70px] w-full"
        >
            <table
                // className={`flex flex-col ${width ? width : 'w-[1300px]'} table-auto py-[40px] relative`}
                className="relative w-full text-sm text-left text-gray-500 dark:text-gray-400"
                style={style}
            >
                {children}
            </table>
        </div>
    )
}