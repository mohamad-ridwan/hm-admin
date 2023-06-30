import { CSSProperties } from "react"

type PropsDefault = {
    id?: string
}

type PropsFirstDesc = {
    firstDesc?: string
    styleFirstDesc?: CSSProperties
}

type PropsName = {
    name: string
    styleName?: CSSProperties
}

type Props = PropsDefault & PropsFirstDesc & PropsName

export function TableData({
    id,
    name,
    firstDesc,
    styleFirstDesc,
    styleName
}: Props){
    return(
        <div
        id={id}
        className="flex w-[calc(100%/7)] p-[20px]"
        >
            <div
            className="flex flex-col w-full"
            >
                <p
                style={styleFirstDesc}
                className="text-[0.82rem] text-start"
                >{firstDesc}</p>
                <p
                style={styleName}
                className="text-[0.82rem] text-start"
                >{name}</p>
            </div>
        </div>
    )
}