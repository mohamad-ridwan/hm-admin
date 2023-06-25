type Props = {
    error: string
}

export default function ErrorInput({error}: Props){
    return(
        <span className="text-[0.65rem] text-red-default">
            {error}
        </span>
    )
}