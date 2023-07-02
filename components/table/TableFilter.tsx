import { ReactElement } from "react"

type Props = {
    leftChild: ReactElement
    rightChild: ReactElement
}

export function TableFilter({
    leftChild,
    rightChild
}: Props){
    return(
        <div
        className="flex flex-wrap w-full justify-between mb-2"
        >
            {/* left */}
            <div
            className="flex flex-col">
                {leftChild}
            </div>

            {/* right */}
            <div
            className="flex flex-col">
                {rightChild}
            </div>
        </div>
    )
}