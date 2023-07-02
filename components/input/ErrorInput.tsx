import { CSSProperties } from "react"

type Props = {
    error: string
    style?: CSSProperties
}

export default function ErrorInput({
    error,
    style
}: Props){
    return(
        <span className="text-[0.65rem] text-red-default" style={style}>
            {error}
        </span>
    )
}